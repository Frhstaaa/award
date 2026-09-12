import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy } from 'lucide-react';

export default function CountdownOverlay({
    currentNumber = 3,
    categoryName = '',
    onSkip = null,
}) {
    // Dynamic narrative text for each count
    const getSubtitle = (num) => {
        if (num === 3) return 'Bersiaplah menyambut sang juara...';
        if (num === 2) return 'Momen apresiasi insan terbaik...';
        if (num === 1) return 'Dan Pemenangnya Adalah...! 🏆';
        return 'Pengumuman Pemenang';
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            onClick={onSkip}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center p-4 cursor-pointer select-none bg-[#030611]/70 backdrop-blur-md"
        >
            {/* Ambient Gold Radial Spotlights */}
            <div className="absolute w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/25 to-amber-600/15 blur-[120px] pointer-events-none -z-10" />

            {/* Top Award Gala Badge */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2.5 px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-semibold tracking-widest uppercase shadow-gold-glow mb-2"
            >
                <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Detik-Detik Pengumuman Juara</span>
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            </motion.div>

            {/* Category Name */}
            {categoryName && (
                <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-sm sm:text-base md:text-lg font-display font-medium text-slate-300 tracking-wide text-center max-w-xl truncate px-4 mb-4 sm:mb-6"
                >
                    Kategori: <span className="text-amber-300 font-bold">{categoryName}</span>
                </motion.h3>
            )}

            {/* The Central Countdown Arena */}
            <div className="relative w-56 h-56 sm:w-68 sm:h-68 md:w-76 md:h-76 flex items-center justify-center my-1 sm:my-3">
                {/* 1. Continuous Rotating Dual Orbital Rings */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border border-dashed border-amber-400/40 pointer-events-none"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 24, ease: 'linear' }}
                    className="absolute -inset-3 sm:-inset-4 rounded-full border border-amber-500/20 pointer-events-none"
                />

                {/* 2. Expanding Shockwave Ring (Triggers on each count change) */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={`shockwave-${currentNumber}`}
                        initial={{ scale: 0.85, opacity: 0.9 }}
                        animate={{ scale: 2.1, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full border-2 border-amber-300 pointer-events-none shadow-[0_0_35px_rgba(251,191,36,0.6)]"
                    />
                </AnimatePresence>

                {/* 3. Frosted Glass Circle Base */}
                <div className="absolute inset-3 sm:inset-4 rounded-full bg-gradient-to-b from-amber-500/15 via-[#080d1e]/85 to-amber-950/40 border border-amber-400/50 backdrop-blur-xl shadow-[0_0_60px_rgba(245,158,11,0.35)] flex items-center justify-center overflow-hidden">
                    {/* Interior Radiance Glow */}
                    <motion.div
                        animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        className="w-32 h-32 rounded-full bg-amber-400/25 blur-2xl pointer-events-none absolute"
                    />
                </div>

                {/* 4. Giant Animated Number */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={currentNumber}
                        initial={{ scale: 2.3, opacity: 0, filter: 'blur(14px)', y: -15 }}
                        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)', y: 0 }}
                        exit={{ scale: 0.4, opacity: 0, filter: 'blur(10px)', y: 25 }}
                        transition={{
                            type: 'spring',
                            damping: 14,
                            stiffness: 280,
                            mass: 0.8,
                        }}
                        className="relative z-20 flex items-center justify-center"
                    >
                        <span className="font-display font-black text-8xl sm:text-9xl md:text-[10.5rem] gold-shimmer drop-shadow-[0_0_40px_rgba(245,158,11,0.85)] select-none leading-none">
                            {currentNumber}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dynamic Subtitle Narrative */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={`subtitle-${currentNumber}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="mt-4 sm:mt-6 text-center"
                >
                    <p className={`text-base sm:text-xl font-display font-semibold tracking-wide ${
                        currentNumber === 1 
                            ? 'gold-shimmer text-lg sm:text-2xl drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] font-bold' 
                            : 'text-slate-200'
                    }`}>
                        {getSubtitle(currentNumber)}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Discreet Skip Hint */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-6 text-[11px] font-mono text-slate-400 tracking-wider hover:text-amber-300 transition-colors"
            >
                Klik di mana saja atau tekan Spasi/Enter untuk langsung membuka panggung
            </motion.p>
        </motion.div>
    );
}
