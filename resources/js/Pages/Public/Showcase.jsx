import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import { AnimatePresence } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';
import WelcomeGate from './Partials/WelcomeGate';
import CategoryIntroSlide from './Partials/CategoryIntroSlide';
import NomineeSlide from './Partials/NomineeSlide';
import SuspenseSlide from './Partials/SuspenseSlide';
import WinnerRevealSlide from './Partials/WinnerRevealSlide';
import SlideshowControls from '@/Components/SlideshowControls';
import audioEngine from '@/Components/AudioEngine';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Showcase({ categories = [], backsounds = {}, settings = {} }) {
    const [hasStarted, setHasStarted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    // Current category & slide state
    const [categoryIndex, setCategoryIndex] = useState(0);
    const [slideStage, setSlideStage] = useState('intro'); // 'intro', 'nominee', 'suspense', 'winner'
    const [nomineeIndex, setNomineeIndex] = useState(0);

    const timerRef = useRef(null);

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

    // Initialize audio engine
    useEffect(() => {
        audioEngine.init(backsounds);
        return () => {
            audioEngine.stopAll();
        };
    }, [backsounds]);

    // Handle audio context changes based on slide stage
    useEffect(() => {
        if (!hasStarted) return;

        if (slideStage === 'intro') {
            audioEngine.playContext('general');
        } else if (slideStage === 'nominee') {
            audioEngine.playContext('nominee_display');
        } else if (slideStage === 'suspense') {
            // Suspense stage ("And the winner is...")
            audioEngine.playContext('suspense');
        } else if (slideStage === 'winner') {
            audioEngine.playContext('winner_reveal');
        }
    }, [hasStarted, slideStage, categoryIndex]);

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
            setSlideStage('winner');
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
    }, [currentCategory, slideStage, nomineeIndex, nominees.length, categoryIndex, categories.length, settings.auto_loop]);

    // Prev step logic
    const handlePrev = useCallback(() => {
        if (slideStage === 'winner') {
            setSlideStage('suspense');
        } else if (slideStage === 'suspense') {
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
    }, [slideStage, nomineeIndex, nominees.length, categoryIndex]);

    // Auto Advance Timer
    useEffect(() => {
        if (!hasStarted || !isPlaying || !currentCategory) return;

        let duration = slideDuration;
        if (slideStage === 'intro') duration = introDuration;
        if (slideStage === 'suspense') duration = suspenseDuration;
        if (slideStage === 'winner') duration = revealDuration;

        timerRef.current = setTimeout(() => {
            handleNext();
        }, duration);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [hasStarted, isPlaying, slideStage, nomineeIndex, categoryIndex, handleNext, slideDuration, suspenseDuration, revealDuration]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!hasStarted) return;

            if (e.code === 'Space') {
                e.preventDefault();
                setIsPlaying(prev => !prev);
            } else if (e.code === 'ArrowRight') {
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
    }, [hasStarted, handleNext, handlePrev, handleToggleMute]);

    const handleStart = () => {
        setHasStarted(true);
        audioEngine.playContext('general');
    };

    return (
        <div className="h-screen h-[100dvh] w-full bg-[#05070d] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
            <Head title={settings.event_title || 'Employee Award Showcase'} />

            {/* Ambient Lighting / Atmospheric Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[300px] bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent pointer-events-none blur-3xl" />
            <div className="absolute inset-0 stars-bg pointer-events-none opacity-50" />

            {/* Initial Welcome Gateway for Audio Context */}
            {!hasStarted && (
                <WelcomeGate
                    title={settings.event_title}
                    subtitle={settings.event_subtitle}
                    onStart={handleStart}
                />
            )}

            {/* Top Presentation Bar (Compact & Sleek) */}
            <header className="relative z-30 w-full px-5 py-2.5 flex items-center justify-between border-b border-amber-500/15 bg-[#070a14]/70 backdrop-blur-md flex-shrink-0">
                <div className="flex items-center gap-2.5">
                    <ApplicationLogo variant="icon" iconClassName="w-8 h-8" />
                    <div>
                        <h1 className="text-xs sm:text-sm font-display font-bold gold-shimmer tracking-wider leading-tight">
                            {settings.event_title || 'RSU Livasya Awards 2026'}
                        </h1>
                        <p className="text-[10px] text-slate-400 leading-tight">
                            {settings.event_subtitle || 'Malam Penganugerahan & Apresiasi Insan Berprestasi'}
                        </p>
                    </div>
                </div>

                {/* Right: Discreet Admin Access */}
                <div className="flex items-center gap-2">
                    <Link
                        href={route('admin.dashboard')}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-amber-500/20 text-slate-400 hover:text-amber-300 border border-slate-800 hover:border-amber-500/30 text-[11px] font-medium transition-all"
                        title="Masuk ke Dashboard Admin"
                    >
                        <Shield className="w-3 h-3" />
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
