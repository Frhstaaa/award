import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';
import WelcomeGate from './Partials/WelcomeGate';
import CategoryIntroSlide from './Partials/CategoryIntroSlide';
import NomineeSlide from './Partials/NomineeSlide';
import SuspenseSlide from './Partials/SuspenseSlide';
import WinnerRevealSlide from './Partials/WinnerRevealSlide';
import CountdownOverlay from '@/Components/CountdownOverlay';
import SlideshowControls from '@/Components/SlideshowControls';
import ThemeToggle from '@/Components/ThemeToggle';
import audioEngine from '@/Components/AudioEngine';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GoldParticles from '@/Components/GoldParticles';
import { useTheme } from '@/Hooks/useTheme';

export default function Showcase({ categories = [], backsounds = {}, settings = {} }) {
    const { isDark } = useTheme();
    const [hasStarted, setHasStarted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    // Current category & slide state
    const [categoryIndex, setCategoryIndex] = useState(0);
    const [slideStage, setSlideStage] = useState('intro'); // 'intro', 'nominee', 'suspense', 'winner'
    const [nomineeIndex, setNomineeIndex] = useState(0);

    // Dramatic Countdown (3-2-1) state
    const [isCountingDown, setIsCountingDown] = useState(false);
    const [countdownNumber, setCountdownNumber] = useState(3);

    const timerRef = useRef(null);
    const countdownIntervalRef = useRef(null);

    const handleToggleMute = useCallback(() => {
        setIsMuted(prev => {
            const nextMuted = !prev;
            audioEngine.setMuted(nextMuted);
            return nextMuted;
        });
    }, []);

    const slideDuration = (settings.slide_duration || 8) * 1000;
    const suspenseDuration = (settings.suspense_duration || 4) * 1000;
    const revealDuration = (settings.reveal_duration || 10) * 1000;
    const introDuration = 5000; // 5 seconds for category intro

    const currentCategory = categories[categoryIndex] || null;
    const nominees = currentCategory?.nominees || [];
    const currentNominee = nominees[nomineeIndex] || null;
    const currentWinner = currentCategory?.winner || null;

    // Countdown handlers
    const stopCountdown = useCallback(() => {
        setIsCountingDown(false);
        audioEngine.unduck(400);
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
    }, []);

    const startCountdown = useCallback(() => {
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
        }

        setIsCountingDown(true);
        setCountdownNumber(3);
        audioEngine.duck(0.35, 400);
        audioEngine.playCountdown(3);

        let current = 3;
        countdownIntervalRef.current = setInterval(() => {
            current -= 1;
            if (current > 0) {
                setCountdownNumber(current);
                audioEngine.playCountdown(current);
            } else {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
                setIsCountingDown(false);
                audioEngine.unduck(100);
                setSlideStage('winner');
            }
        }, 1000);
    }, []);

    // Stop countdown whenever changing away from suspense stage
    useEffect(() => {
        if (slideStage !== 'suspense') {
            stopCountdown();
        }
    }, [slideStage, stopCountdown]);

    // Initialize audio engine
    useEffect(() => {
        audioEngine.init(backsounds);
        return () => {
            audioEngine.stopAll(800);
        };
    }, [backsounds]);

    // Handle audio context changes based on slide stage with smooth crossfade
    useEffect(() => {
        if (!hasStarted) return;

        const catId = currentCategory?.id || null;

        if (slideStage === 'intro') {
            audioEngine.playContext('general', null, catId, { fadeOutDuration: 1200, fadeInDuration: 1200 });
        } else if (slideStage === 'nominee') {
            audioEngine.playContext('nominee_display', null, catId, { fadeOutDuration: 1000, fadeInDuration: 1000 });
        } else if (slideStage === 'suspense') {
            // Suspense stage ("And the winner is...")
            audioEngine.playContext('suspense', null, catId, { fadeOutDuration: 1000, fadeInDuration: 1000 });
        } else if (slideStage === 'winner') {
            audioEngine.playContext('winner_reveal', null, catId, { fadeOutDuration: 400, fadeInDuration: 200 });
        }
    }, [hasStarted, slideStage, categoryIndex, currentCategory?.id]);

    // Next step logic
    const handleNext = useCallback(() => {
        if (!currentCategory) return;

        if (slideStage === 'intro') {
            if (nominees.length > 0) {
                setNomineeIndex(0);
                setSlideStage('nominee');
            } else {
                setSlideStage('suspense');
            }
        } else if (slideStage === 'nominee') {
            if (nomineeIndex + 1 < nominees.length) {
                setNomineeIndex(prev => prev + 1);
            } else {
                setSlideStage('suspense');
            }
        } else if (slideStage === 'suspense') {
            if (!isCountingDown) {
                startCountdown();
            } else {
                stopCountdown();
                setSlideStage('winner');
            }
        } else if (slideStage === 'winner') {
            // Move to next category
            if (categoryIndex + 1 < categories.length) {
                setCategoryIndex(prev => prev + 1);
                setNomineeIndex(0);
                setSlideStage('intro');
            } else {
                // End of all categories: loop if auto_loop is enabled
                if (settings.auto_loop !== false) {
                    setCategoryIndex(0);
                    setNomineeIndex(0);
                    setSlideStage('intro');
                } else {
                    setIsPlaying(false);
                }
            }
        }
    }, [currentCategory, slideStage, nomineeIndex, nominees.length, categoryIndex, categories.length, settings.auto_loop, isCountingDown, startCountdown, stopCountdown]);

    // Prev step logic
    const handlePrev = useCallback(() => {
        if (slideStage === 'winner') {
            setSlideStage('suspense');
        } else if (slideStage === 'suspense') {
            if (isCountingDown) {
                stopCountdown();
                return;
            }
            if (nominees.length > 0) {
                setNomineeIndex(nominees.length - 1);
                setSlideStage('nominee');
            } else {
                setSlideStage('intro');
            }
        } else if (slideStage === 'nominee') {
            if (nomineeIndex > 0) {
                setNomineeIndex(prev => prev - 1);
            } else {
                setSlideStage('intro');
            }
        } else if (slideStage === 'intro') {
            if (categoryIndex > 0) {
                setCategoryIndex(prev => prev - 1);
                setSlideStage('winner');
            }
        }
    }, [slideStage, nomineeIndex, nominees.length, categoryIndex, isCountingDown, stopCountdown]);

    // Auto Advance Timer
    useEffect(() => {
        if (!hasStarted || !isPlaying || !currentCategory || isCountingDown) return;

        let duration = slideDuration;
        if (slideStage === 'intro') duration = introDuration;
        if (slideStage === 'suspense') duration = suspenseDuration;
        if (slideStage === 'winner') duration = revealDuration;

        timerRef.current = setTimeout(() => {
            if (slideStage === 'suspense') {
                startCountdown();
            } else {
                handleNext();
            }
        }, duration);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [hasStarted, isPlaying, slideStage, nomineeIndex, categoryIndex, handleNext, startCountdown, isCountingDown, slideDuration, suspenseDuration, revealDuration]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!hasStarted) return;

            if (e.code === 'Space') {
                e.preventDefault();
                if (isCountingDown) {
                    stopCountdown();
                    setSlideStage('winner');
                } else {
                    setIsPlaying(prev => !prev);
                }
            } else if (e.code === 'ArrowRight' || e.code === 'Enter') {
                e.preventDefault();
                handleNext();
            } else if (e.code === 'ArrowLeft') {
                e.preventDefault();
                handlePrev();
            } else if (e.key === 'm' || e.key === 'M') {
                handleToggleMute();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hasStarted, handleNext, handlePrev, handleToggleMute, isCountingDown, stopCountdown]);

    const handleStart = () => {
        setHasStarted(true);
        const catId = currentCategory?.id || null;
        audioEngine.playContext('general', null, catId, { fadeInDuration: 1500 });
    };

    return (
        <div className="h-screen h-[100dvh] w-full royal-gold-stage text-amber-50 flex flex-col justify-between relative overflow-hidden select-none">
            <Head title={settings.event_title || 'Employee Award Showcase'} />

            {/* =========================================================
                Dominant Royal Gold Gala Stage Atmospheric Lighting
               ========================================================= */}
            {/* 1. Overhead Golden Stage Light Wash */}
            <div className="absolute inset-x-0 top-0 h-[380px] stage-overhead-beam pointer-events-none opacity-100" />

            {/* 2. Dual Diagonal Theatrical Spotlights (Angled toward center stage) */}
            <div className="absolute inset-0 theatrical-spotlight-left pointer-events-none opacity-85" />
            <div className="absolute inset-0 theatrical-spotlight-right pointer-events-none opacity-85" />

            {/* 3. Golden Halo Backdrop (Radiating warmly behind the presentation card) */}
            <div className="absolute inset-0 stage-gold-halo pointer-events-none opacity-100" />

            {/* 4. Bottom Stage Floor Luminescence */}
            <div className="absolute inset-x-0 bottom-0 h-48 stage-floor-glow pointer-events-none opacity-90" />

            {/* 5. Dynamic Floating Gold Particles (Dust, Twinkling Stars, & Bokeh Orbs) */}
            <GoldParticles dustCount={70} starCount={16} bokehCount={9} isDark={isDark} />

            {/* 6. Subtle Static Star Texture Overlay */}
            <div className="absolute inset-0 stars-bg pointer-events-none opacity-25 dark:opacity-35" />

            {/* Initial Welcome Gateway for Audio Context */}
            {!hasStarted && (
                <WelcomeGate
                    title={settings.event_title}
                    subtitle={settings.event_subtitle}
                    onStart={handleStart}
                />
            )}

            {/* Top Presentation Bar (Dual-mode: Ivory Champagne / Obsidian Gold) */}
            <header className="relative z-30 w-full px-5 py-2.5 flex items-center justify-between border-b border-amber-400/40 bg-[#fffdf8]/92 text-amber-950 dark:border-amber-500/30 dark:bg-[#0c0905]/85 dark:text-amber-100 backdrop-blur-md flex-shrink-0 shadow-sm dark:shadow-lg dark:shadow-black/50 transition-colors duration-300">
                <div className="flex items-center gap-2.5">
                    <ApplicationLogo variant="icon" iconClassName="w-8 h-8 drop-shadow-sm" />
                    <div>
                        <h1 className="text-xs sm:text-sm font-display font-bold gold-title-crisp tracking-wider leading-tight">
                            {settings.event_title || 'RSU Livasya Awards 2026'}
                        </h1>
                        <p className="text-[10px] text-amber-900/80 dark:text-amber-200/80 leading-tight">
                            {settings.event_subtitle || 'Malam Penganugerahan & Apresiasi Insan Berprestasi'}
                        </p>
                    </div>
                </div>

                {/* Right: Theme Toggle & Admin Access */}
                <div className="flex items-center gap-2">
                    <ThemeToggle showLabel={false} />
                    <Link
                        href={route('admin.dashboard')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/90 hover:bg-amber-200/90 text-amber-900 border border-amber-300 dark:bg-black/60 dark:hover:bg-amber-500/20 dark:text-amber-200 dark:hover:text-amber-100 dark:border-amber-500/35 dark:hover:border-amber-400 text-[11px] font-semibold transition-all shadow-sm"
                        title="Masuk ke Dashboard Admin"
                    >
                        <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span className="hidden sm:inline">Panel Admin</span>
                    </Link>
                </div>
            </header>


            {/* Main Stage Presentation Area (Strictly Fits Screen, Room for HUD) */}
            <main className="relative z-10 flex-1 w-full flex items-center justify-center px-4 pt-1 pb-16 overflow-hidden">
                {categories.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl font-display text-slate-400 mb-4">
                            Belum ada kategori penghargaan aktif.
                        </p>
                        <Link
                            href={route('admin.categories.index')}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-colors"
                        >
                            Tambah Kategori di Admin
                        </Link>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {slideStage === 'intro' && (
                            <CategoryIntroSlide
                                key={`intro-${categoryIndex}`}
                                category={currentCategory}
                                categoryIndex={categoryIndex}
                                totalCategories={categories.length}
                            />
                        )}

                        {slideStage === 'nominee' && currentNominee && (
                            <NomineeSlide
                                key={`nominee-${categoryIndex}-${nomineeIndex}`}
                                nominee={currentNominee}
                                index={nomineeIndex}
                                total={nominees.length}
                                categoryName={currentCategory.name}
                            />
                        )}

                        {slideStage === 'suspense' && (
                            <SuspenseSlide
                                key={`suspense-${categoryIndex}`}
                                categoryName={currentCategory.name}
                                nominees={nominees}
                                isCountingDown={isCountingDown}
                            />
                        )}

                        {slideStage === 'winner' && (
                            <WinnerRevealSlide
                                key={`winner-${categoryIndex}`}
                                winner={currentWinner}
                                category={currentCategory}
                            />
                        )}
                    </AnimatePresence>
                )}
            </main>

            {/* Grand Royal Countdown Overlay (3-2-1) with Full Viewport Authority */}
            <AnimatePresence>
                {isCountingDown && (
                    <CountdownOverlay
                        key={`countdown-${categoryIndex}`}
                        currentNumber={countdownNumber}
                        categoryName={currentCategory?.name}
                        onSkip={() => {
                            stopCountdown();
                            setSlideStage('winner');
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Slideshow HUD Controller */}
            {hasStarted && categories.length > 0 && (
                <SlideshowControls
                    isPlaying={isPlaying}
                    onTogglePlay={() => setIsPlaying(prev => !prev)}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    currentCategoryIndex={categoryIndex}
                    totalCategories={categories.length}
                    categoryName={currentCategory?.name}
                    slideType={slideStage}
                    slideIndex={nomineeIndex}
                    totalNominees={nominees.length}
                    isMuted={isMuted}
                    onToggleMute={handleToggleMute}
                />
            )}
        </div>
    );
}
