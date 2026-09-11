import React from 'react';
import { User, Briefcase, Building, Star, Award, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NomineeSlide({ nominee, index, total, categoryName }) {
    const employee = nominee.employee || {};

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-4xl mx-auto px-4 py-1 my-auto"
        >
            {/* Stage Header */}
            <div className="text-center mb-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-semibold tracking-widest uppercase mb-1 shadow-sm">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Nominasi — {categoryName}</span>
                </div>
                <div className="text-slate-400 text-[11px] font-mono">
                    Kandidat {index + 1} dari {total}
                </div>
            </div>

            {/* Main Nominee Card (Compact & Balanced) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center bg-[#0d1326]/90 backdrop-blur-xl border border-amber-500/25 rounded-2xl p-4 sm:p-6 md:p-7 shadow-2xl relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

                {/* Left: Nominee Photo with Gold Frame */}
                <div className="md:col-span-5 flex justify-center">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="relative group"
                    >
                        {/* Outer Gold Frame */}
                        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 shadow-gold-glow">
                            <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#0a0e1a] relative">
                                {employee.photo_url ? (
                                    <img 
                                        src={employee.photo_url} 
                                        alt={employee.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600">
                                        <User className="w-14 h-14" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Nominee Badge */}
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-[10px] sm:text-xs font-bold font-display uppercase tracking-widest shadow-md flex items-center gap-1 whitespace-nowrap">
                            <Star className="w-3 h-3 fill-black" />
                            Official Nominee
                        </div>
                    </motion.div>
                </div>

                {/* Right: Nominee Details & Achievement */}
                <div className="md:col-span-7 space-y-3 text-center md:text-left">
                    <div>
                        <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="text-xl sm:text-2xl md:text-3xl font-display font-bold gold-shimmer tracking-tight leading-tight"
                        >
                            {employee.name}
                        </motion.h3>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2"
                        >
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                                {employee.position}
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
                                <Building className="w-3.5 h-3.5 text-slate-400" />
                                {employee.department}
                            </div>
                        </motion.div>
                    </div>

                    {/* Achievement / Description */}
                    {nominee.description && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="relative p-3 sm:p-4 rounded-xl bg-[#090e1d]/80 border border-amber-500/20 text-slate-200 max-h-24 overflow-y-auto"
                        >
                            <Quote className="w-6 h-6 text-amber-400/20 absolute -top-2 -left-2" />
                            <p className="text-xs sm:text-sm italic font-light leading-relaxed">
                                "{nominee.description}"
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
