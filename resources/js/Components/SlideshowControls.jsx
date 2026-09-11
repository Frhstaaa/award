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
            <div className="flex items-center gap-2 sm:gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#0a0e1a]/90 backdrop-blur-md border border-amber-500/25 shadow-xl shadow-black/80">
                {/* Category & Status Indicator */}
                <div className="flex items-center gap-1.5 pr-2.5 border-r border-amber-500/20 text-xs">
                    <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                    </span>
                    <span className="font-display font-semibold text-amber-300 max-w-[110px] sm:max-w-[180px] md:max-w-[220px] truncate text-[11px] sm:text-xs">
                        {categoryName || 'Penghargaan'}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px] sm:text-[11px]">
                        ({currentCategoryIndex + 1}/{totalCategories})
                    </span>
                </div>

                {/* Stage Badge */}
                <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-medium text-amber-300 uppercase tracking-wider">
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
                        className="p-1.5 rounded-full text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={onTogglePlay}
                        title={isPlaying ? 'Jeda Slideshow (Spasi)' : 'Mulai Slideshow (Spasi)'}
                        className="p-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold hover:from-amber-400 hover:to-amber-500 shadow-sm shadow-amber-500/30 transition-all hover:scale-105"
                    >
                        {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                    </button>

                    <button
                        onClick={onNext}
                        title="Slide Berikutnya (Panah Kanan)"
                        className="p-1.5 rounded-full text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                    >
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Audio & Screen Controls */}
                <div className="flex items-center gap-0.5 sm:gap-1 pl-1.5 border-l border-amber-500/20">
                    <button
                        onClick={toggleMute}
                        title={isMuted ? 'Nyalakan Suara (M)' : 'Bisukan Suara (M)'}
                        className={`p-1.5 rounded-full transition-colors ${
                            isMuted ? 'text-rose-400 hover:bg-rose-500/10' : 'text-slate-300 hover:text-amber-300 hover:bg-amber-500/10'
                        }`}
                    >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                        onClick={toggleFullscreen}
                        title={isFullscreen ? 'Keluar Layar Penuh (F)' : 'Layar Penuh (F)'}
                        className="p-1.5 rounded-full text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                    >
                        {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
