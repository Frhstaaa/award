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
            className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 py-2 my-auto"
        >
            {/* Stage Header */}
            <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full royal-gold-pill text-xs sm:text-sm font-bold tracking-widest uppercase mb-2 shadow-sm">
                    <Award className="w-4 h-4 text-amber-600 dark:text-yellow-300" />
                    <span>Nominasi — {categoryName}</span>
                </div>
                <div className="text-amber-900 dark:text-amber-200 font-mono text-xs sm:text-sm font-extrabold tracking-widest drop-shadow-sm">
                    ✦ Kandidat {index + 1} dari {total} ✦
                </div>
            </div>

            {/* Main Nominee Card (Grand Royal Gold & Light/Dark Plaque) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-center royal-gold-card rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 relative overflow-hidden transition-all duration-300 shadow-2xl">
                {/* Decorative golden ambient card glow */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-bl from-amber-400/25 via-yellow-500/15 to-transparent rounded-full blur-[90px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-600/15 rounded-full blur-[80px] pointer-events-none" />

                {/* Left: Nominee Photo with Grand Royal Gold Frame */}
                <div className="md:col-span-5 flex justify-center">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        className="relative group mb-4 md:mb-0"
                    >
                        {/* Outer Grand Royal Gold Frame */}
                        <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-3xl p-2 royal-gold-frame relative shadow-xl">
                            <div className="w-full h-full rounded-[20px] overflow-hidden royal-gold-avatar-bg relative flex items-center justify-center border-2 border-amber-400/50 shadow-inner">
                                {employee.photo_url ? (
                                    <img 
                                        src={employee.photo_url} 
                                        alt={employee.name} 
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center p-3">
                                        <User className="w-16 h-16 sm:w-20 sm:h-20 text-amber-600 dark:text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
                                        <span className="text-xs sm:text-sm text-amber-900 dark:text-amber-300/80 font-mono mt-2 font-bold uppercase tracking-wider">RSU Livasya</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Nominee Badge with Enhanced Scale & Separation */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 sm:px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 text-xs sm:text-sm font-black font-display uppercase tracking-widest shadow-[0_4px_16px_rgba(0,0,0,0.25),0_0_18px_rgba(245,158,11,0.6)] flex items-center gap-2 whitespace-nowrap border-2 border-yellow-100">
                            <Star className="w-4 h-4 fill-amber-950 text-amber-950" />
                            <span>Official Nominee</span>
                            <Star className="w-4 h-4 fill-amber-950 text-amber-950" />
                        </div>
                    </motion.div>
                </div>

                {/* Right: Nominee Details & Achievement (Grand Scale) */}
                <div className="md:col-span-7 space-y-4 text-center md:text-left relative z-10">
                    <div>
                        <motion.h3 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black gold-title-crisp tracking-tight leading-tight"
                        >
                            {employee.name}
                        </motion.h3>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4"
                        >
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl royal-gold-badge text-sm sm:text-base font-bold tracking-wide">
                                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 dark:text-yellow-400" />
                                <span>{employee.position}</span>
                            </div>
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl royal-gold-badge-secondary text-sm sm:text-base font-semibold tracking-wide">
                                <Building className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                                <span>{employee.department}</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Achievement / Description */}
                    {nominee.description && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            className="relative p-4 sm:p-5 rounded-2xl bg-amber-50/95 border border-amber-300/90 text-amber-950 dark:bg-black/55 dark:border-amber-500/40 dark:text-amber-100 max-h-32 overflow-y-auto mt-4 shadow-inner"
                        >
                            <Quote className="w-5 h-5 text-amber-500/50 dark:text-amber-400/50 absolute -top-2.5 -left-2.5" />
                            <p className="text-sm sm:text-base italic font-medium leading-relaxed text-amber-950 dark:text-amber-100/95">
                                "{nominee.description}"
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

