import React from 'react';
import { Sparkles, Volume2, Play, Award, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function WelcomeGate({ onStart, title, subtitle }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070a13] stars-bg overflow-hidden p-4">
            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-1/4 w-[250px] h-[250px] rounded-full bg-rose-600/10 blur-[100px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.94, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="max-w-md w-full text-center relative z-10 p-6 sm:p-8 rounded-2xl bg-[#0d1222]/85 backdrop-blur-xl border border-amber-500/30 shadow-2xl shadow-black my-auto"
            >
                {/* Official RSU Livasya Emblem */}
                <div className="flex justify-center mb-4">
                    <ApplicationLogo variant="icon" iconClassName="w-16 h-16" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest mb-3">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Grand Presentation Mode
                </div>

                <h1 className="text-2xl sm:text-3xl font-display font-bold gold-shimmer tracking-tight mb-2 leading-tight">
                    {title || 'Livasya Excellence Awards'}
                </h1>

                <p className="text-slate-300 text-xs sm:text-sm max-w-sm mx-auto mb-6 leading-relaxed font-light">
                    {subtitle || 'Malam Penganugerahan & Apresiasi Karyawan Berprestasi.'}
                </p>

                {/* Big Glowing Action Button */}
                <button
                    onClick={onStart}
                    className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-display font-bold text-sm sm:text-base tracking-wider uppercase shadow-gold-glow hover:shadow-gold-glow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    <Play className="w-4 h-4 fill-current group-hover:translate-x-0.5 transition-transform" />
                    <span>Mulai Presentasi</span>
                    <Volume2 className="w-4 h-4 text-slate-950/70" />
                </button>

                <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-amber-400" />
                        Audio Otomatis
                    </span>
                    <span className="flex items-center gap-1">
                        <Maximize2 className="w-3 h-3 text-amber-400" />
                        Layar Penuh
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
