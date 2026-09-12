import React, { useState, useEffect } from 'react';
import { 
    Play, 
    Pause, 
    ChevronLeft, 
    ChevronRight, 
    Volume2, 
    VolumeX, 
    Maximize, 
    Minimize
} from 'lucide-react';
import audioEngine from './AudioEngine';

export default function SlideshowControls({
    isPlaying,
    onTogglePlay,
    onNext,
    onPrev,
    currentCategoryIndex,
    totalCategories,
    categoryName,
    slideType, // 'intro', 'nominee', 'suspense', 'winner'
    slideIndex = 0,
    totalNominees = 0,
    isMuted: externalMuted,
    onToggleMute,
}) {
    const [internalMuted, setInternalMuted] = useState(false);
    const isMuted = externalMuted !== undefined ? externalMuted : internalMuted;
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showHud, setShowHud] = useState(true);

    // Auto hide HUD after 4 seconds of mouse inactivity
    useEffect(() => {
        let timer;
        const handleMouseMove = () => {
            setShowHud(true);
            clearTimeout(timer);
            timer = setTimeout(() => setShowHud(false), 4000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timer);
        };
    }, []);

    const toggleMute = () => {
        if (onToggleMute) {
            onToggleMute();
        } else {
            const nextMuted = !internalMuted;
            setInternalMuted(nextMuted);
            audioEngine.setMuted(nextMuted);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div 
            className={`fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform ${
                showHud ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-25 hover:opacity-100 hover:translate-y-0'
            }`}
        >
            <div className="flex items-center gap-2 sm:gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full royal-gold-hud transition-all duration-300">
                {/* Category & Status Indicator */}
                <div className="flex items-center gap-1.5 pr-2.5 border-r border-amber-400/40 text-xs">
                    <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-400"></span>
                    </span>
                    <span className="font-display font-bold text-amber-950 dark:text-yellow-300 max-w-[110px] sm:max-w-[180px] md:max-w-[220px] truncate text-[11px] sm:text-xs drop-shadow-sm">
                        {categoryName || 'Penghargaan'}
                    </span>
                    <span className="text-amber-800/80 dark:text-amber-200/80 font-mono text-[10px] sm:text-[11px] font-semibold">
                        ({currentCategoryIndex + 1}/{totalCategories})
                    </span>
                </div>

                {/* Stage Badge */}
                <div className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-950 border border-amber-400/50 dark:bg-amber-500/20 dark:text-yellow-200 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {slideType === 'intro' && 'Pengantar'}
                    {slideType === 'nominee' && `Nominee ${slideIndex + 1}/${totalNominees}`}
                    {slideType === 'suspense' && 'Pemenang?'}
                    {slideType === 'winner' && 'Juara! 🎉'}
                </div>

                {/* Playback Controls */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                    <button
                        onClick={onPrev}
                        title="Slide Sebelumnya (Panah Kiri)"
                        className="p-1.5 rounded-full text-amber-800 hover:text-amber-950 hover:bg-amber-200/60 dark:text-amber-200 dark:hover:text-yellow-200 dark:hover:bg-amber-400/20 transition-colors"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={onTogglePlay}
                        title={isPlaying ? 'Jeda Slideshow (Spasi)' : 'Mulai Slideshow (Spasi)'}
                        className="p-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black font-extrabold hover:scale-105 shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all"
                    >
                        {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                    </button>

                    <button
                        onClick={onNext}
                        title="Slide Berikutnya (Panah Kanan)"
                        className="p-1.5 rounded-full text-amber-800 hover:text-amber-950 hover:bg-amber-200/60 dark:text-amber-200 dark:hover:text-yellow-200 dark:hover:bg-amber-400/20 transition-colors"
                    >
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Audio & Screen Controls */}
                <div className="flex items-center gap-0.5 sm:gap-1 pl-1.5 border-l border-amber-400/40">
                    <button
                        onClick={toggleMute}
                        title={isMuted ? 'Nyalakan Suara (M)' : 'Bisukan Suara (M)'}
                        className={`p-1.5 rounded-full transition-colors ${
                            isMuted 
                                ? 'text-rose-500 hover:bg-rose-500/20 dark:text-rose-400' 
                                : 'text-amber-800 hover:text-amber-950 hover:bg-amber-200/60 dark:text-amber-200 dark:hover:text-yellow-200 dark:hover:bg-amber-400/20'
                        }`}
                    >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                        onClick={toggleFullscreen}
                        title={isFullscreen ? 'Keluar Layar Penuh (F)' : 'Layar Penuh (F)'}
                        className="p-1.5 rounded-full text-amber-800 hover:text-amber-950 hover:bg-amber-200/60 dark:text-amber-200 dark:hover:text-yellow-200 dark:hover:bg-amber-400/20 transition-colors"
                    >
                        {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

        </div>
    );
}
