import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Award } from 'lucide-react';

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
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={onSkip}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 cursor-pointer select-none countdown-stage-backdrop transition-colors duration-300"
        >
            {/* Ambient Gold Radial Spotlight behind Medallion */}
            <div className="absolute w-[400px] sm:w-[520px] h-[400px] sm:h-[520px] rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/25 to-amber-600/20 blur-[110px] pointer-events-none -z-10" />

            {/* Top Award Gala Badge with High Contrast */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full royal-gold-pill text-xs sm:text-sm font-black tracking-widest uppercase mb-3 shadow-lg"
            >
                <Trophy className="w-4 h-4 text-amber-700 dark:text-yellow-300 animate-pulse" />
                <span>Detik-Detik Pengumuman Juara</span>
                <Sparkles className="w-4 h-4 text-amber-700 dark:text-yellow-300 animate-spin-slow" />
            </motion.div>

            {/* Category Name - High-Contrast Dedicated Plaque */}
            {categoryName && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="countdown-category-box px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl max-w-2xl sm:max-w-3xl text-center mb-4 sm:mb-6"
                >
                    <div className="text-[10px] sm:text-[11px] font-mono font-extrabold uppercase tracking-widest text-amber-800 dark:text-amber-300/90 mb-1 flex items-center justify-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-300" />
                        <span>Kategori Penghargaan</span>
                        <Award className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-300" />
                    </div>
                    <h3 className="text-base sm:text-xl md:text-2xl font-display font-black gold-title-crisp tracking-wide uppercase leading-tight drop-shadow-sm">
                        {categoryName}
                    </h3>
                </motion.div>
            )}

            {/* The Central Countdown Arena - Royal 3D Gold Medallion */}
            <div className="relative w-64 h-64 sm:w-76 sm:h-76 md:w-84 md:h-84 flex items-center justify-center my-1 sm:my-2">
                {/* 1. Continuous Rotating Dual Orbital Rings */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/40 pointer-events-none"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
                    className="absolute -inset-4 sm:-inset-5 rounded-full border border-amber-400/30 pointer-events-none"
                />

                {/* 2. Expanding Shockwave Ring (Triggers on each count change) */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={`shockwave-${currentNumber}`}
                        initial={{ scale: 0.85, opacity: 0.95 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full border-2 border-amber-400 pointer-events-none shadow-[0_0_40px_rgba(251,191,36,0.8)]"
                    />
                </AnimatePresence>

                {/* 3. Outer Royal Gold Beveled Frame Medallion */}
                <div className="absolute inset-2 sm:inset-3 rounded-full countdown-medallion-frame p-2 sm:p-2.5 flex items-center justify-center">
                    {/* Inner Medallion Core Disc */}
                    <div className="w-full h-full rounded-full countdown-medallion-core flex items-center justify-center relative overflow-hidden">
                        {/* Ambient Center Glow */}
                        <motion.div
                            animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.65, 0.35] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                            className="w-40 h-40 rounded-full bg-amber-400/25 blur-2xl pointer-events-none absolute"
                        />
                    </div>
                </div>

                {/* 4. Giant 3D Animated Number */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={currentNumber}
                        initial={{ scale: 2.4, opacity: 0, filter: 'blur(14px)', y: -20 }}
                        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)', y: 0 }}
                        exit={{ scale: 0.4, opacity: 0, filter: 'blur(10px)', y: 30 }}
                        transition={{
                            type: 'spring',
                            damping: 14,
                            stiffness: 280,
                            mass: 0.8,
                        }}
                        className="relative z-20 flex items-center justify-center"
                    >
                        <span className="font-display font-black text-8xl sm:text-9xl md:text-[10.5rem] countdown-number-3d select-none leading-none">
                            {currentNumber}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dynamic Subtitle Narrative in High-Contrast Box */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={`subtitle-${currentNumber}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="mt-4 sm:mt-5 text-center px-4"
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-50/95 border border-amber-300 text-amber-950 dark:bg-black/70 dark:border-amber-400/40 dark:text-amber-100 shadow-md">
                        <Sparkles className="w-4 h-4 text-amber-600 dark:text-yellow-300 animate-pulse" />
                        <p className="text-sm sm:text-base md:text-lg font-display font-extrabold tracking-wide">
                            {getSubtitle(currentNumber)}
                        </p>
                        <Sparkles className="w-4 h-4 text-amber-600 dark:text-yellow-300 animate-pulse" />
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Discreet Skip Hint Pill */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 dark:bg-black/60 dark:border-amber-400/30 dark:text-amber-200 text-[11px] font-mono tracking-wider backdrop-blur-md shadow-sm hover:border-amber-400/60 transition-colors"
            >
                <span>Klik di mana saja atau tekan Spasi/Enter untuk langsung membuka panggung</span>
            </motion.div>
        </motion.div>
    );
}
