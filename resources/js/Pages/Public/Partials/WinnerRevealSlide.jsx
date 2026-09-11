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
        <div className="w-full max-w-4xl mx-auto px-3 py-1 my-auto relative">
            {/* Sustained Continuous Confetti Engine */}
            <ConfettiEffect active={showConfetti} continuous={true} />

            {/* Category Banner Title with Gold Pulse */}
            <div className="text-center mb-2">
                <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/25 via-yellow-400/35 to-amber-500/25 border border-amber-400/50 text-amber-300 text-[11px] sm:text-xs font-semibold tracking-widest uppercase shadow-gold-glow"
                >
                    <Trophy className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>Pemenang Penghargaan: {category?.name}</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
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

                {/* Ambient Golden Stage Lighting Spotlights */}
                <div className="absolute top-0 left-1/4 -translate-x-1/2 w-48 h-full bg-gradient-to-b from-amber-400/20 via-yellow-500/5 to-transparent blur-2xl pointer-events-none transform -rotate-12" />
                <div className="absolute top-0 right-1/4 translate-x-1/2 w-48 h-full bg-gradient-to-b from-amber-400/20 via-yellow-500/5 to-transparent blur-2xl pointer-events-none transform rotate-12" />

                {employee ? (
                    <motion.div 
                        initial={{ scale: 0.88, opacity: 0 }}
                        animate={{ scale: isCurtainOpen ? 1 : 0.88, opacity: isCurtainOpen ? 1 : 0 }}
                        transition={{ duration: 0.8, delay: 0.65, ease: 'easeOut' }}
                        className="w-full max-w-2xl flex flex-col md:flex-row items-center gap-5 sm:gap-7 py-2 px-3 relative z-10"
                    >
                        {/* Winner Avatar with Sunburst, Pulsing Halo, and Crown */}
                        <div className="relative flex-shrink-0">
                            {/* Rotating Conic Sunburst of Glory (Continuous 360° Ray Motion) */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
                                className="absolute -inset-14 sm:-inset-16 pointer-events-none opacity-45 mix-blend-screen"
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
                                className="absolute -top-1 -left-2 z-20 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
                            >
                                <Sparkles className="w-5 h-5 fill-yellow-400/40" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [4, -4, 4], scale: [0.9, 1.2, 0.9] }}
                                transition={{ repeat: Infinity, duration: 2.7, delay: 0.5, ease: 'easeInOut' }}
                                className="absolute -top-2 -right-2 z-20 text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                            >
                                <Star className="w-4 h-4 fill-amber-400" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [-3, 3, -3], scale: [1, 1.25, 1] }}
                                transition={{ repeat: Infinity, duration: 2.4, delay: 1, ease: 'easeInOut' }}
                                className="absolute -bottom-1 -left-3 z-20 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]"
                            >
                                <Star className="w-4 h-4 fill-amber-400" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [3, -3, 3], rotate: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 3.2, delay: 0.3, ease: 'easeInOut' }}
                                className="absolute -bottom-1 -right-3 z-20 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
                            >
                                <Sparkles className="w-4 h-4 fill-yellow-300/50" />
                            </motion.div>

                            {/* Floating Royal Crown / Trophy at Top */}
                            <motion.div 
                                animate={{ 
                                    y: [-4, 4, -4],
                                    scale: [1, 1.08, 1],
                                }}
                                transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
                                className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-400 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.8)] flex items-center justify-center"
                            >
                                <div className="w-full h-full rounded-full bg-[#080c18] flex items-center justify-center">
                                    <Crown className="w-4 h-4 text-amber-400 fill-amber-400/40" />
                                </div>
                            </motion.div>

                            {/* Outer Golden Border Circle with Metallic Glow */}
                            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full p-1.5 bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.6)] relative z-10">
                                <div className="w-full h-full rounded-full overflow-hidden bg-[#070b14] relative border-2 border-amber-300/40">
                                    {employee.photo_url ? (
                                        <img 
                                            src={employee.photo_url} 
                                            alt={employee.name}
                                            className="w-full h-full object-cover object-top filter contrast-[1.05]" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                                            <User className="w-14 h-14" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Grand Winner Ribbon Banner with Glowing Shimmer */}
                            <motion.div 
                                animate={{ scale: [1, 1.04, 1] }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black font-display font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-[0_0_18px_rgba(245,158,11,0.8)] whitespace-nowrap flex items-center gap-1.5 border border-yellow-200"
                            >
                                <Star className="w-3.5 h-3.5 fill-black" />
                                <span className="font-extrabold tracking-wider">JUARA UTAMA</span>
                                <Star className="w-3.5 h-3.5 fill-black" />
                            </motion.div>
                        </div>

                        {/* Winner Information & Festivity Details */}
                        <div className="text-center md:text-left space-y-2 flex-1 mt-3 md:mt-0">
                            <div>
                                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] text-amber-300 font-mono tracking-widest uppercase mb-0.5">
                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                    <span>Selamat Kepada Juara</span>
                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                </div>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-black gold-shimmer tracking-tight leading-tight">
                                    {employee.name}
                                </h3>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-400/40 text-amber-200 text-xs font-semibold shadow-sm">
                                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                                    <span>{employee.position}</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/95 border border-slate-700/80 text-slate-200 text-xs font-medium">
                                    <Building className="w-3.5 h-3.5 text-amber-400/80" />
                                    <span>{employee.department}</span>
                                </div>
                            </div>

                            {nominee?.description && (
                                <div className="p-2.5 rounded-lg bg-black/50 border border-amber-500/30 text-slate-300 text-xs leading-relaxed italic max-h-16 overflow-y-auto shadow-inner">
                                    "{nominee.description}"
                                </div>
                            )}

                            {/* Bottom Festivity Pill */}
                            <div className="pt-1 flex items-center justify-center md:justify-start gap-2">
                                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-[11px] text-amber-300 font-semibold tracking-wider uppercase shadow-gold-glow">
                                    <Award className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Penghargaan Resmi Dianugerahkan</span>
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="text-center py-6 relative z-10">
                        <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-2 opacity-50" />
                        <h3 className="text-lg font-display font-bold text-slate-400">
                            Pemenang Belum Ditetapkan
                        </h3>
                        <p className="text-slate-500 text-xs mt-1">
                            Admin belum menetapkan pemenang untuk kategori ini.
                        </p>
                    </div>
                )}
            </CurtainAnimation>
        </div>
    );
}
