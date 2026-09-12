import { Howl, Howler } from 'howler';

/**
 * Production-Grade Single-Instance Audio Engine with Broadcast Crossfading
 * Guarantees smooth, elegant track crossfading between slide stages.
 * Features:
 * - Equal-power / linear crossfades (fade out current track, fade in next track).
 * - Context-aware transition timings (General, Nominees, Suspense, Winner).
 * - Automatic audio ducking during dramatic 3-2-1 countdowns.
 * - Idempotent track caching (does not restart if the same track is playing across nominees).
 * - Category-specific backsound resolution with global fallbacks.
 * - Zero-leak memory cleanup and strict race-condition session guards.
 */

const DEFAULT_TRANSITION_PROFILES = {
    general: { fadeOut: 1200, fadeIn: 1200 },
    nominee_display: { fadeOut: 1000, fadeIn: 1000 },
    nominee: { fadeOut: 1000, fadeIn: 1000 },
    suspense: { fadeOut: 1000, fadeIn: 1000 },
    winner_reveal: { fadeOut: 450, fadeIn: 200 },
    winner: { fadeOut: 450, fadeIn: 200 },
};

class AudioEngine {
    constructor() {
        this.currentSound = null;
        this.currentContext = null;
        this.currentTrackUrl = null;
        this.fadingSounds = new Set(); // Tracks currently fading out to prevent abrupt cuts
        this.html5FallbackAudio = null;
        this.volume = 0.8;
        this.isMuted = false;
        this.isDucked = false;
        this.backsoundsMap = {};
        this.isInitialized = false;
        this.playSessionId = 0; // Incremented on each track switch to cancel stale async callbacks
    }

    init(backsoundsMap = {}) {
        this.backsoundsMap = backsoundsMap;
        this.isInitialized = true;
    }

    setMuted(muted) {
        this.isMuted = muted;
        Howler.mute(muted);
        if (this.html5FallbackAudio) {
            this.html5FallbackAudio.muted = muted;
        }

        // If unmuting while a sound is active, fade up smoothly to avoid acoustic pops
        if (!muted && this.currentSound && typeof this.currentSound.fade === 'function') {
            try {
                const target = this.isDucked ? this.volume * 0.35 : this.volume;
                this.currentSound.fade(0, target, 300);
            } catch (e) {}
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        Howler.volume(this.volume);
        if (this.currentSound && typeof this.currentSound.volume === 'function') {
            try {
                const target = this.isDucked ? this.volume * 0.35 : this.volume;
                this.currentSound.volume(target);
            } catch (e) {}
        }
        if (this.html5FallbackAudio) {
            this.html5FallbackAudio.volume = this.isDucked ? this.volume * 0.35 : this.volume;
        }
    }

    /**
     * Smoothly duck current background music volume for dramatic tension (e.g. countdown beeps)
     */
    duck(targetMultiplier = 0.35, duration = 400) {
        if (this.isMuted) return;
        this.isDucked = true;
        const targetVol = this.volume * targetMultiplier;

        if (this.currentSound && typeof this.currentSound.fade === 'function') {
            try {
                const cur = this.currentSound.volume();
                this.currentSound.fade(cur, targetVol, duration);
            } catch (e) {}
        }

        if (this.html5FallbackAudio) {
            this.fadeHtml5Audio(this.html5FallbackAudio, this.html5FallbackAudio.volume, targetVol, duration);
        }
    }

    /**
     * Smoothly restore background music volume after ducking
     */
    unduck(duration = 400) {
        this.isDucked = false;
        if (this.isMuted) return;
        const targetVol = this.volume;

        if (this.currentSound && typeof this.currentSound.fade === 'function') {
            try {
                const cur = this.currentSound.volume();
                this.currentSound.fade(cur, targetVol, duration);
            } catch (e) {}
        }

        if (this.html5FallbackAudio) {
            this.fadeHtml5Audio(this.html5FallbackAudio, this.html5FallbackAudio.volume, targetVol, duration);
        }
    }

    /**
     * Resolve audio track URL with category-specific matching & context fallback
     */
    resolveTrackUrl(context, fallbackUrl = null, categoryId = null) {
        if (fallbackUrl) return fallbackUrl;
        if (!this.backsoundsMap) return null;

        const map = this.backsoundsMap;

        const findInList = (list) => {
            if (!Array.isArray(list) || list.length === 0) return null;
            // 1. If categoryId specified, check for category-specific track
            if (categoryId !== null && categoryId !== undefined) {
                const catTrack = list.find(item => item && item.category_id == categoryId && item.file_url);
                if (catTrack) return catTrack.file_url;
            }
            // 2. Global track (no category_id)
            const globalTrack = list.find(item => item && !item.category_id && item.file_url);
            if (globalTrack) return globalTrack.file_url;
            // 3. Any active track in the list
            if (list[0]?.file_url) return list[0].file_url;
            return null;
        };

        // 1. Check exact match
        if (map[context]) {
            const found = findInList(map[context]);
            if (found) return found;
        }

        // 2. Check alias fallbacks
        const aliases = {
            'suspense': ['winner_reveal', 'general', 'background_loop', 'nominee_display'],
            'nominee_display': ['nominee', 'general', 'background_loop', 'loop'],
            'nominee': ['nominee_display', 'general', 'background_loop', 'loop'],
            'winner_reveal': ['winner', 'suspense', 'general', 'background_loop', 'nominee_display'],
            'winner': ['winner_reveal', 'suspense', 'general', 'background_loop', 'nominee_display'],
            'general': ['background_loop', 'loop', 'nominee_display', 'nominee', 'suspense', 'winner_reveal', 'winner'],
            'background_loop': ['loop', 'general', 'nominee_display', 'nominee'],
            'loop': ['background_loop', 'general', 'nominee_display', 'nominee'],
        };

        const candidates = aliases[context] || ['general'];
        for (const candidate of candidates) {
            if (map[candidate]) {
                const found = findInList(map[candidate]);
                if (found) return found;
            }
        }

        // 3. Fallback to any song in 'all'
        if (map.all) {
            const found = findInList(map.all);
            if (found) return found;
        }

        // 4. Any track found anywhere in the map
        for (const key of Object.keys(map)) {
            const found = findInList(map[key]);
            if (found) return found;
        }

        return null;
    }

    fadeHtml5Audio(audio, fromVol, toVol, duration, onComplete = null) {
        if (!audio || duration <= 0) {
            if (audio) audio.volume = toVol;
            if (onComplete) onComplete();
            return;
        }

        const startTime = performance.now();
        const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const cur = fromVol + (toVol - fromVol) * progress;
            try {
                audio.volume = Math.max(0, Math.min(1, cur));
            } catch (e) {}

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                if (onComplete) onComplete();
            }
        };
        requestAnimationFrame(step);
    }

    playHtml5Fallback(trackUrl, isLoop, sessionId, fadeInDuration = 800) {
        if (this.playSessionId !== sessionId) return;

        try {
            console.log(`[AudioEngine] Mengaktifkan fallback HTML5 Audio untuk:`, trackUrl);

            // Clean previous HTML5 audio
            if (this.html5FallbackAudio) {
                const oldAudio = this.html5FallbackAudio;
                this.html5FallbackAudio = null;
                this.fadeHtml5Audio(oldAudio, oldAudio.volume, 0, 600, () => {
                    try {
                        oldAudio.pause();
                        oldAudio.src = '';
                    } catch (e) {}
                });
            }

            const audio = new Audio(trackUrl);
            audio.loop = isLoop;
            const targetVol = this.isMuted ? 0 : (this.isDucked ? this.volume * 0.35 : this.volume);
            audio.volume = fadeInDuration > 0 ? 0 : targetVol;
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    if (this.playSessionId !== sessionId) {
                        audio.pause();
                        audio.src = '';
                        return;
                    }
                    console.log(`[AudioEngine] Fallback HTML5 Audio berhasil diputar!`);
                    if (fadeInDuration > 0 && !this.isMuted) {
                        this.fadeHtml5Audio(audio, 0, targetVol, fadeInDuration);
                    }
                }).catch(err => {
                    console.warn(`[AudioEngine] Fallback HTML5 Audio play error:`, err);
                });
            }

            this.html5FallbackAudio = audio;
        } catch (e) {
            console.warn(`[AudioEngine] Gagal memutar fallback HTML5 Audio:`, e);
        }
    }

    /**
     * Stop and unload all audio nodes across Howler and HTML5 Audio immediately
     */
    killAllAudio() {
        for (const sound of this.fadingSounds) {
            try {
                sound.off();
                sound.stop();
                sound.unload();
            } catch (e) {}
        }
        this.fadingSounds.clear();

        if (this.currentSound) {
            try {
                this.currentSound.off();
                this.currentSound.stop();
                this.currentSound.unload();
            } catch (e) {}
            this.currentSound = null;
        }

        if (this.html5FallbackAudio) {
            try {
                this.html5FallbackAudio.pause();
                this.html5FallbackAudio.src = '';
            } catch (e) {}
            this.html5FallbackAudio = null;
        }

        try {
            Howler.stop();
        } catch (e) {}

        if (typeof window !== 'undefined' && window.speechSynthesis) {
            try {
                window.speechSynthesis.cancel();
            } catch (e) {}
        }
    }

    /**
     * Play audio for a given showcase context with smooth crossfade
     * @param {string} context - 'general' | 'nominee_display' | 'suspense' | 'winner_reveal'
     * @param {string|null} fallbackUrl - Optional explicit track URL override
     * @param {number|null} categoryId - Optional category ID for category-specific audio
     * @param {object} options - Optional { fadeOutDuration, fadeInDuration }
     */
    playContext(context, fallbackUrl = null, categoryId = null, options = {}) {
        if (!this.isInitialized) return;

        // Auto-resume WebAudio context on user gesture if suspended
        if (Howler.ctx && Howler.ctx.state === 'suspended') {
            Howler.ctx.resume();
        }

        const trackUrl = this.resolveTrackUrl(context, fallbackUrl, categoryId);
        if (!trackUrl) {
            console.warn(`[AudioEngine] Tidak ada file audio yang tersedia untuk konteks "${context}".`);
            return;
        }

        // =========================================================================
        // IDEMPOTENT CHECK: If the same track is ALREADY active or loading,
        // simply update the context and do NOT interrupt or restart!
        // =========================================================================
        if (this.currentTrackUrl === trackUrl) {
            this.currentContext = context;

            if (this.currentSound) {
                if (this.currentSound.state() === 'loaded' && !this.currentSound.playing()) {
                    this.currentSound.play();
                }
                // If ducked and context switched away from countdown, unduck
                if (this.isDucked) {
                    this.unduck(400);
                }
            } else if (this.html5FallbackAudio && this.html5FallbackAudio.paused) {
                this.html5FallbackAudio.play().catch(() => {});
            }
            return;
        }

        // =========================================================================
        // SMOOTH CROSSFADE TRANSITION:
        // Gracefully fade out previous track while fading in the new track
        // =========================================================================
        const sessionId = ++this.playSessionId;
        const profile = DEFAULT_TRANSITION_PROFILES[context] || { fadeOut: 1000, fadeIn: 1000 };
        const fadeOutDuration = options.fadeOutDuration !== undefined ? options.fadeOutDuration : profile.fadeOut;
        const fadeInDuration = options.fadeInDuration !== undefined ? options.fadeInDuration : profile.fadeIn;

        // 1. Gracefully fade out the currently active sound
        if (this.currentSound) {
            const oldSound = this.currentSound;
            this.fadingSounds.add(oldSound);
            this.currentSound = null;

            const curVol = (typeof oldSound.volume === 'function') ? oldSound.volume() : this.volume;
            const fadeTime = Math.max(100, fadeOutDuration);

            try {
                oldSound.fade(curVol, 0, fadeTime);
            } catch (e) {}

            const cleanupOldSound = () => {
                if (this.fadingSounds.has(oldSound)) {
                    try {
                        oldSound.off();
                        oldSound.stop();
                        oldSound.unload();
                    } catch (e) {}
                    this.fadingSounds.delete(oldSound);
                }
            };

            oldSound.once('fade', cleanupOldSound);
            setTimeout(cleanupOldSound, fadeTime + 250);
        }

        // 2. Clean up any older lingering fading sounds to prevent buffer leaks
        if (this.fadingSounds.size > 2) {
            for (const s of Array.from(this.fadingSounds).slice(0, this.fadingSounds.size - 2)) {
                try {
                    s.off();
                    s.stop();
                    s.unload();
                } catch (e) {}
                this.fadingSounds.delete(s);
            }
        }

        this.currentContext = context;
        this.currentTrackUrl = trackUrl;

        const isLoop = context !== 'winner_reveal' && context !== 'winner';
        const targetVolume = this.isMuted ? 0 : (this.isDucked ? this.volume * 0.35 : this.volume);
        const effectiveFadeIn = Math.max(50, fadeInDuration);

        console.log(`[AudioEngine] Transisi smooth audio "${context}" (Session #${sessionId}, FadeIn: ${effectiveFadeIn}ms, FadeOut: ${fadeOutDuration}ms):`, trackUrl);

        // 3. Instantiate new sound with volume 0 for smooth fade-in
        const newSound = new Howl({
            src: [trackUrl],
            html5: false,
            preload: true,
            loop: isLoop,
            volume: effectiveFadeIn > 0 ? 0 : targetVolume,
            onload: () => {
                if (this.playSessionId !== sessionId) {
                    newSound.stop();
                    newSound.unload();
                    return;
                }
                console.log(`[AudioEngine] Track berhasil dimuat (WebAudio):`, trackUrl);
            },
            onloaderror: (id, err) => {
                if (this.playSessionId !== sessionId) return;
                console.warn('[AudioEngine] WebAudio load error, mencoba fallback HTML5 Audio:', id, err, trackUrl);
                this.playHtml5Fallback(trackUrl, isLoop, sessionId, effectiveFadeIn);
            },
            onplayerror: (id, err) => {
                if (this.playSessionId !== sessionId) return;
                console.warn('[AudioEngine] WebAudio play error, membuka kunci autoplay:', err);
                newSound.once('unlock', () => {
                    if (this.playSessionId === sessionId) {
                        const playId = newSound.play();
                        if (effectiveFadeIn > 0 && !this.isMuted) {
                            newSound.fade(0, targetVolume, effectiveFadeIn, playId);
                        }
                    }
                });
            },
        });

        // Trigger fade-in as soon as the sound starts playing
        newSound.once('play', (soundId) => {
            if (this.playSessionId === sessionId && effectiveFadeIn > 0 && !this.isMuted) {
                newSound.fade(0, targetVolume, effectiveFadeIn, soundId);
            }
        });

        newSound.play();
        this.currentSound = newSound;
    }

    /**
     * Play cinematic tension countdown sound: sub-bass heartbeat pulse & tension chime.
     * (Human counting voice removed as requested)
     */
    playCountdown(count) {
        if (this.isMuted) return;

        // Play sub-bass heartbeat pulse & tension chime SFX
        this.playCountdownBeep(count);
    }

    /**
     * Synthesize cinematic tension tick / heartbeat for countdown (3, 2, 1).
     * Uses Web Audio API oscillator for instant, zero-latency playback.
     */
    playCountdownBeep(count) {
        if (this.isMuted) return;
        try {
            const ctx = Howler.ctx || (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null);
            if (!ctx) return;
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const now = ctx.currentTime;

            // 1. Sub-bass cinematic pulse/thump
            const subOsc = ctx.createOscillator();
            const subGain = ctx.createGain();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(count === 1 ? 130 : 90, now);
            subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

            subGain.gain.setValueAtTime(0.75 * this.volume, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

            subOsc.connect(subGain);
            subGain.connect(ctx.destination);
            subOsc.start(now);
            subOsc.stop(now + 0.36);

            // 2. High crisp tension chime
            const chimeOsc = ctx.createOscillator();
            const chimeGain = ctx.createGain();
            chimeOsc.type = count === 1 ? 'sawtooth' : 'triangle';

            const freqs = { 3: 440, 2: 554.37, 1: 880 };
            const freq = freqs[count] || 440;

            chimeOsc.frequency.setValueAtTime(freq, now);
            if (count === 1) {
                chimeOsc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.5); // high E sweep
            }

            chimeGain.gain.setValueAtTime((count === 1 ? 0.4 : 0.45) * this.volume, now);
            chimeGain.gain.exponentialRampToValueAtTime(0.001, now + (count === 1 ? 0.65 : 0.28));

            chimeOsc.connect(chimeGain);
            chimeGain.connect(ctx.destination);
            chimeOsc.start(now);
            chimeOsc.stop(now + (count === 1 ? 0.7 : 0.3));
        } catch (e) {
            console.warn('[AudioEngine] Countdown sound error:', e);
        }
    }

    /**
     * Stop all audio with optional smooth fade-out
     */
    stopAll(fadeOutDuration = 600) {
        this.playSessionId++; // Invalidate any in-flight loads

        if (fadeOutDuration > 0 && this.currentSound && typeof this.currentSound.fade === 'function') {
            const oldSound = this.currentSound;
            this.currentSound = null;
            this.currentContext = null;
            this.currentTrackUrl = null;

            try {
                const cur = oldSound.volume();
                oldSound.fade(cur, 0, fadeOutDuration);
                setTimeout(() => {
                    try {
                        oldSound.off();
                        oldSound.stop();
                        oldSound.unload();
                    } catch (e) {}
                }, fadeOutDuration + 100);
            } catch (e) {
                this.killAllAudio();
            }
        } else {
            this.killAllAudio();
            this.currentContext = null;
            this.currentTrackUrl = null;
        }
    }
}

export const audioEngine = new AudioEngine();
export default audioEngine;
