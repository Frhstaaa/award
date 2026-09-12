import React from 'react';
import { Sparkles, Volume2, Play, Award, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ApplicationLogo from '@/Components/ApplicationLogo';
import GoldParticles from '@/Components/GoldParticles';
import { useTheme } from '@/Hooks/useTheme';

export default function WelcomeGate({ onStart, title, subtitle }) {
    const { isDark } = useTheme();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center royal-gold-stage overflow-hidden p-4 transition-colors duration-300">
            {/* Theatrical Golden Stage Lighting */}
            <div className="absolute inset-x-0 top-0 h-[380px] stage-overhead-beam pointer-events-none opacity-100" />
            <div className="absolute inset-0 theatrical-spotlight-left pointer-events-none opacity-80" />
            <div className="absolute inset-0 theatrical-spotlight-right pointer-events-none opacity-80" />
            <div className="absolute inset-0 stage-gold-halo pointer-events-none opacity-100" />
            <div className="absolute inset-x-0 bottom-0 h-44 stage-floor-glow pointer-events-none opacity-85" />

            {/* Dynamic Gold Particles (Adaptive for Light & Dark) */}
            <GoldParticles dustCount={65} starCount={14} bokehCount={8} isDark={isDark} />

            {/* Subtle Star Texture */}
            <div className="absolute inset-0 stars-bg pointer-events-none opacity-25 dark:opacity-35" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-md w-full text-center relative z-10 p-6 sm:p-8 rounded-3xl royal-gold-card my-auto"
            >
                {/* Official RSU Livasya Emblem */}
                <div className="flex justify-center mb-4">
                    <ApplicationLogo variant="icon" iconClassName="w-16 h-16 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full royal-gold-pill text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-3 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-300" />
                    <span>Grand Presentation Mode</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-extrabold gold-title-crisp tracking-tight mb-2 leading-tight">
                    {title || 'Livasya Excellence Awards'}
                </h1>

                <p className="text-amber-900/90 dark:text-amber-100/90 text-xs sm:text-sm max-w-sm mx-auto mb-6 leading-relaxed font-medium drop-shadow-sm">
                    {subtitle || 'Malam Penganugerahan & Apresiasi Karyawan Berprestasi.'}
                </p>

                {/* Big Glowing Action Button */}
                <button
                    onClick={onStart}
                    className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-display font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-[0_0_25px_rgba(245,158,11,0.7)] hover:shadow-[0_0_40px_rgba(245,158,11,0.9)] transition-all duration-300 hover:scale-105 active:scale-95 border border-yellow-200"
                >
                    <Play className="w-4 h-4 fill-current group-hover:translate-x-0.5 transition-transform" />
                    <span>Mulai Presentasi</span>
                    <Volume2 className="w-4 h-4 text-slate-950/70" />
                </button>

                <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-amber-800/90 dark:text-amber-200/80 font-semibold">
                    <span className="flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-400" />
                        Audio Otomatis
                    </span>
                    <span className="flex items-center gap-1">
                        <Maximize2 className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-400" />
                        Layar Penuh
                    </span>
                </div>
            </motion.div>
        </div>

    );
}
