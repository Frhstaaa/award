import { Howl, Howler } from 'howler';

/**
 * Production-Grade Single-Instance Audio Engine
 * Guarantees that exactly ONE audio track plays at any given time.
 * Features race-condition session tokens, idempotent track switching,
 * and zero-leak cleanup to eliminate double sounds/echoes completely.
 */
class AudioEngine {
    constructor() {
        this.currentSound = null;
        this.currentContext = null;
        this.currentTrackUrl = null;
        this.html5FallbackAudio = null;
        this.volume = 0.8;
        this.isMuted = false;
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
    }

    setVolume(volume) {
        this.volume = volume;
        Howler.volume(volume);
        if (this.currentSound) {
            try {
                this.currentSound.volume(volume);
            } catch (e) {
                // ignore
            }
        }
        if (this.html5FallbackAudio) {
            this.html5FallbackAudio.volume = volume;
        }
    }

    resolveTrackUrl(context, fallbackUrl = null) {
        if (fallbackUrl) return fallbackUrl;
        if (!this.backsoundsMap) return null;

        const map = this.backsoundsMap;

        // 1. Check exact match
        if (map[context] && Array.isArray(map[context]) && map[context].length > 0 && map[context][0]?.file_url) {
            return map[context][0].file_url;
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
            if (map[candidate] && Array.isArray(map[candidate]) && map[candidate].length > 0 && map[candidate][0]?.file_url) {
                return map[candidate][0].file_url;
            }
        }

        // 3. Fallback to any song in 'all'
        if (map.all && Array.isArray(map.all) && map.all.length > 0 && map.all[0]?.file_url) {
            return map.all[0].file_url;
        }

        // 4. Any track found anywhere in the map
        for (const key of Object.keys(map)) {
            if (Array.isArray(map[key]) && map[key].length > 0 && map[key][0]?.file_url) {
                return map[key][0].file_url;
            }
        }

        return null;
    }

    playHtml5Fallback(trackUrl, isLoop, sessionId) {
        if (this.playSessionId !== sessionId) return;

        try {
            console.log(`[AudioEngine] Mengaktifkan fallback HTML5 Audio untuk:`, trackUrl);
            this.killAllAudio();

            const audio = new Audio(trackUrl);
            audio.loop = isLoop;
            audio.volume = this.isMuted ? 0 : this.volume;
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    if (this.playSessionId !== sessionId) {
                        audio.pause();
                        audio.src = '';
                        return;
                    }
                    console.log(`[AudioEngine] Fallback HTML5 Audio berhasil diputar!`);
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
     * Stop and unload all audio nodes across Howler and HTML5 Audio
     */
    killAllAudio() {
        if (this.currentSound) {
            try {
                this.currentSound.off(); // Remove all event listeners immediately
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

        // Global safeguard: Stop any orphaned sounds in Howler pool
        try {
            Howler.stop();
        } catch (e) {}
    }

    playContext(context, fallbackUrl = null) {
        if (!this.isInitialized) return;

        // Auto-resume WebAudio context on user gesture if suspended
        if (Howler.ctx && Howler.ctx.state === 'suspended') {
            Howler.ctx.resume();
        }

        const trackUrl = this.resolveTrackUrl(context, fallbackUrl);
        if (!trackUrl) {
            console.warn(`[AudioEngine] Tidak ada file audio yang tersedia untuk konteks "${context}".`);
            return;
        }

        // =========================================================================
        // IDEMPOTENT CHECK: If the same track is ALREADY active or loading,
        // simply update the context and do NOT start another sound!
        // =========================================================================
        if (this.currentTrackUrl === trackUrl) {
            this.currentContext = context;

            // If it's loaded and paused, resume it
            if (this.currentSound && this.currentSound.state() === 'loaded' && !this.currentSound.playing()) {
                this.currentSound.play();
            } else if (this.html5FallbackAudio && this.html5FallbackAudio.paused) {
                this.html5FallbackAudio.play().catch(() => {});
            }
            return;
        }

        // =========================================================================
        // NEW TRACK TRANSITION: Kill any previous audio immediately
        // =========================================================================
        const sessionId = ++this.playSessionId;
        this.killAllAudio();

        this.currentContext = context;
        this.currentTrackUrl = trackUrl;

        const isLoop = context !== 'winner_reveal' && context !== 'winner';

        console.log(`[AudioEngine] Memutar audio untuk konteks "${context}" (Session #${sessionId}):`, trackUrl);

        // Use Web Audio API (html5: false) for reliable XHR loading without HTTP Range 206 errors
        const newSound = new Howl({
            src: [trackUrl],
            html5: false,
            preload: true,
            loop: isLoop,
            volume: this.isMuted ? 0 : this.volume,
            onload: () => {
                // If another track was requested while this one was loading, abort!
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
                this.playHtml5Fallback(trackUrl, isLoop, sessionId);
            },
            onplayerror: (id, err) => {
                if (this.playSessionId !== sessionId) return;
                console.warn('[AudioEngine] WebAudio play error, membuka kunci autoplay:', err);
                newSound.once('unlock', () => {
                    if (this.playSessionId === sessionId) {
                        newSound.play();
                    }
                });
            },
        });

        newSound.play();
        this.currentSound = newSound;
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

    stopAll() {
        this.playSessionId++; // Invalidate any in-flight loads
        this.killAllAudio();
        this.currentContext = null;
        this.currentTrackUrl = null;
    }
}

export const audioEngine = new AudioEngine();
export default audioEngine;
