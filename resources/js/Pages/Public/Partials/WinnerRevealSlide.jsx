import React, { useState, useEffect } from 'react';
import { Trophy, Star, Sparkles, User, Briefcase, Building, Award, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import CurtainAnimation from '@/Components/CurtainAnimation';
import ConfettiEffect from '@/Components/ConfettiEffect';

export default function WinnerRevealSlide({ winner, category }) {
    const [isCurtainOpen, setIsCurtainOpen] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showFlash, setShowFlash] = useState(false);

    const nominee = winner?.nominee;
    const employee = nominee?.employee;

    useEffect(() => {
        // Open curtain after a 500ms dramatic suspense pause
        const curtainTimer = setTimeout(() => {
            setIsCurtainOpen(true);
        }, 500);

        // Flash of stage lights as the winner is revealed
        const flashTimer = setTimeout(() => {
            setShowFlash(true);
        }, 1300);

        // Fire celebratory cannons & continuous grand celebration (1500ms)
        const confettiTimer = setTimeout(() => {
            setShowConfetti(true);
        }, 1500);

        return () => {
            clearTimeout(curtainTimer);
            clearTimeout(flashTimer);
            clearTimeout(confettiTimer);
        };
    }, []);

    return (
        <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 py-1 my-auto relative">
            {/* Sustained Continuous Confetti Engine */}
            <ConfettiEffect active={showConfetti} continuous={true} />

            {/* Category Banner Title with Gold Pulse */}
            <div className="text-center mb-3 sm:mb-4">
                <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-2 rounded-full royal-gold-pill text-xs sm:text-sm font-black tracking-widest uppercase shadow-md"
                >
                    <Trophy className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-700 dark:text-amber-400 animate-pulse" />
                    <span className="truncate max-w-[320px] sm:max-w-lg md:max-w-2xl lg:max-w-3xl">Pemenang Penghargaan: {category?.name}</span>
                    <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-700 dark:text-yellow-300 animate-spin-slow" />
                </motion.div>
            </div>

            {/* The Curtain Stage */}
            <CurtainAnimation isOpen={isCurtainOpen}>
                {/* Grand Gala Camera Flash Effect */}
                {showFlash && (
                    <motion.div
                        initial={{ opacity: 0.85 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 1.1, ease: 'easeOut' }}
                        className="absolute inset-0 bg-gradient-to-b from-yellow-100 via-amber-200 to-transparent pointer-events-none z-30 mix-blend-overlay"
                    />
                )}

                {employee ? (
                    <motion.div 
                        initial={{ scale: 0.88, opacity: 0 }}
                        animate={{ scale: isCurtainOpen ? 1 : 0.88, opacity: isCurtainOpen ? 1 : 0 }}
                        transition={{ duration: 0.8, delay: 0.65, ease: 'easeOut' }}
                        className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-14 lg:gap-16 py-2 px-3 sm:px-6 md:px-8 relative z-10"
                    >
                        {/* Winner Avatar Column with Dedicated Width to Fully Contain Ribbon */}
                        <div className="relative flex-shrink-0 w-52 sm:w-60 md:w-64 lg:w-72 flex flex-col items-center justify-center mb-6 md:mb-0">
                            {/* Rotating Conic Sunburst of Glory (Continuous 360° Ray Motion) */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
                                className="absolute -inset-16 sm:-inset-20 md:-inset-24 pointer-events-none opacity-45 mix-blend-screen"
                                style={{
                                    background: 'conic-gradient(from 0deg, rgba(245, 158, 11, 0.5) 0deg 12deg, transparent 12deg 24deg, rgba(253, 224, 71, 0.45) 24deg 36deg, transparent 36deg 48deg, rgba(245, 158, 11, 0.5) 48deg 60deg, transparent 60deg 72deg, rgba(253, 224, 71, 0.45) 72deg 84deg, transparent 84deg 96deg, rgba(245, 158, 11, 0.5) 96deg 108deg, transparent 108deg 120deg, rgba(253, 224, 71, 0.45) 120deg 132deg, transparent 132deg 144deg, rgba(245, 158, 11, 0.5) 144deg 156deg, transparent 156deg 168deg, rgba(253, 224, 71, 0.45) 168deg 180deg, transparent 180deg 192deg, rgba(245, 158, 11, 0.5) 192deg 204deg, transparent 204deg 216deg, rgba(234, 179, 8, 0.4) 216deg 228deg, transparent 228deg 240deg, rgba(245, 158, 11, 0.5) 240deg 252deg, transparent 252deg 264deg, rgba(253, 224, 71, 0.45) 264deg 276deg, transparent 276deg 288deg, rgba(245, 158, 11, 0.5) 288deg 300deg, transparent 300deg 312deg, rgba(253, 224, 71, 0.45) 312deg 324deg, transparent 324deg 336deg, rgba(245, 158, 11, 0.5) 336deg 348deg, transparent 348deg 360deg)',
                                    maskImage: 'radial-gradient(circle, black 32%, transparent 70%)',
                                    WebkitMaskImage: 'radial-gradient(circle, black 32%, transparent 70%)',
                                    willChange: 'transform',
                                    transform: 'translateZ(0)',
                                }}
                            />

                            {/* Continuous Expanding Golden Shockwave Halo Rings */}
                            <motion.div
                                animate={{ scale: [1, 1.38, 1.55], opacity: [0.75, 0.3, 0] }}
                                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
                                className="absolute inset-0 rounded-full border-2 border-amber-400/60 pointer-events-none"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.45, 1.7], opacity: [0.6, 0.2, 0] }}
                                transition={{ repeat: Infinity, duration: 2.2, delay: 0.75, ease: 'easeOut' }}
                                className="absolute inset-0 rounded-full border border-yellow-300/40 pointer-events-none"
                            />

                            {/* Floating Radiant Stars orbiting around Avatar */}
                            <motion.div
                                animate={{ y: [-4, 4, -4], rotate: [0, 18, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                className="absolute -top-1 -left-2 z-20 text-yellow-400 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
                            >
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400/40" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [4, -4, 4], scale: [0.9, 1.2, 0.9] }}
                                transition={{ repeat: Infinity, duration: 2.7, delay: 0.5, ease: 'easeInOut' }}
                                className="absolute -top-2 -right-2 z-20 text-amber-500 dark:text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                            >
                                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [-3, 3, -3], scale: [1, 1.25, 1] }}
                                transition={{ repeat: Infinity, duration: 2.4, delay: 1, ease: 'easeInOut' }}
                                className="absolute -bottom-1 -left-3 z-20 text-amber-500 dark:text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]"
                            >
                                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [3, -3, 3], rotate: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 3.2, delay: 0.3, ease: 'easeInOut' }}
                                className="absolute -bottom-1 -right-3 z-20 text-yellow-400 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
                            >
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-300/50" />
                            </motion.div>

                            {/* Floating Royal Crown / Trophy at Top */}
                            <motion.div 
                                animate={{ 
                                    y: [-4, 4, -4],
                                    scale: [1, 1.08, 1],
                                    rotate: [-3, 3, -3],
                                }}
                                transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
                                className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-400 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.85)] flex items-center justify-center"
                            >
                                <div className="w-full h-full rounded-full bg-amber-50 dark:bg-[#080c18] flex items-center justify-center border border-amber-300/60 shadow-sm">
                                    <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 dark:text-amber-400 fill-amber-500/40" />
                                </div>
                            </motion.div>

                            {/* Outer Golden Border Circle with Metallic Glow */}
                            <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 lg:w-56 lg:h-56 rounded-full p-2 sm:p-2.5 bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.65)] relative z-10">
                                <div className="w-full h-full rounded-full overflow-hidden bg-amber-100/90 dark:bg-[#070b14] relative border-2 border-amber-300/60 shadow-inner">
                                    {employee.photo_url ? (
                                        <img 
                                            src={employee.photo_url} 
                                            alt={employee.name}
                                            className="w-full h-full object-cover object-top filter contrast-[1.05]" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-amber-700/60 dark:text-slate-600">
                                            <User className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Grand Winner Ribbon Banner - Safely Contained Inside Column Width */}
                            <motion.div 
                                animate={{ scale: [1, 1.04, 1] }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                className="absolute -bottom-4 sm:-bottom-5 left-1/2 -translate-x-1/2 z-20 px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 font-display font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_6px_20px_rgba(0,0,0,0.3),0_0_22px_rgba(245,158,11,0.85)] whitespace-nowrap flex items-center gap-2 border-2 border-yellow-100"
                            >
                                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-950 text-amber-950" />
                                <span className="font-black tracking-wider">JUARA UTAMA</span>
                                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-950 text-amber-950" />
                            </motion.div>
                        </div>

                        {/* Winner Information & Festivity Details */}
                        <div className="text-center md:text-left space-y-3 sm:space-y-4 flex-1 min-w-0">
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-amber-900 dark:text-amber-300 font-mono tracking-widest uppercase mb-1.5 font-extrabold">
                                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-yellow-300 animate-pulse" />
                                    <span>Selamat Kepada Juara</span>
                                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-yellow-300 animate-pulse" />
                                </div>
                                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black gold-title-crisp tracking-tight leading-[1.15]">
                                    {employee.name}
                                </h3>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-0.5">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-2xl royal-gold-badge text-sm sm:text-base font-bold shadow-sm">
                                    <Briefcase className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-700 dark:text-yellow-300" />
                                    <span>{employee.position}</span>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-2xl royal-gold-badge-secondary text-sm sm:text-base font-semibold shadow-sm">
                                    <Building className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600 dark:text-amber-400" />
                                    <span>{employee.department}</span>
                                </div>
                            </div>

                            {nominee?.description && (
                                <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/95 border border-amber-300/80 text-amber-950 dark:bg-[#140e06]/95 dark:border-amber-400/35 dark:text-amber-100/90 text-sm sm:text-base leading-relaxed italic max-h-24 overflow-y-auto shadow-inner">
                                    "{nominee.description}"
                                </div>
                            )}

                            {/* Bottom Festivity Pill with Clean Separation */}
                            <div className="pt-2 flex items-center justify-center md:justify-start">
                                <div className="inline-flex items-center gap-2.5 px-5 py-1.5 sm:px-6 sm:py-2 rounded-full royal-gold-pill text-xs sm:text-sm font-bold tracking-wider uppercase shadow-md">
                                    <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600 dark:text-amber-400" />
                                    <span>Penghargaan Resmi Dianugerahkan</span>
                                    <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600 dark:text-yellow-300 animate-spin-slow" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="text-center py-8 relative z-10 px-6 royal-gold-card max-w-md mx-auto">
                        <Trophy className="w-12 h-12 text-amber-600 dark:text-amber-400 mx-auto mb-2 opacity-60" />
                        <h3 className="text-lg font-display font-bold text-amber-950 dark:text-amber-200">
                            Pemenang Belum Ditetapkan
                        </h3>
                        <p className="text-amber-800/80 dark:text-amber-300/70 text-xs mt-1">
                            Admin belum menetapkan pemenang untuk kategori ini.
                        </p>
                    </div>
                )}
            </CurtainAnimation>
        </div>
    );
}
