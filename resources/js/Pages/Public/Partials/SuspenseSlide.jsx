import React from 'react';
import { Award, Sparkles, User, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuspenseSlide({ categoryName, nominees = [], isCountingDown = false }) {
    const count = nominees.length;

    // Card width tuned for up to 4 cards per row with optimal aesthetic balance
    const getCardWidthClass = () => {
        if (count <= 2) return 'w-48 sm:w-56 md:w-64';
        if (count === 3) return 'w-40 sm:w-48 md:w-52';
        if (count === 4) return 'w-36 sm:w-40 md:w-46 lg:w-52';
        // For count > 4 (e.g. 5-8), cards are organized in rows of max 4
        return 'w-[calc(50%-0.5rem)] sm:w-36 md:w-42 lg:w-48 xl:w-52';
    };

    // Photo size adjustment for visual harmony and zero-scroll viewport balance
    const getPhotoSizeClass = () => {
        if (count <= 2) return 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28';
        if (count === 3) return 'w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24';
        if (count === 4) return 'w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22';
        return 'w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20';
    };

    // Split nominees into rows with a maximum of 4 candidates per row
    const MAX_PER_ROW = 4;
    const chunkedNominees = [];
    for (let i = 0; i < nominees.length; i += MAX_PER_ROW) {
        chunkedNominees.push(nominees.slice(i, i + MAX_PER_ROW));
    }

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ 
                opacity: isCountingDown ? 0.65 : 1, 
                scale: isCountingDown ? 0.96 : 1,
                filter: isCountingDown ? 'blur(1.5px)' : 'blur(0px)',
            }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-5xl xl:max-w-6xl mx-auto text-center px-4 py-1 flex flex-col items-center justify-center my-auto relative z-10"
        >
            {/* Ambient Dramatic Pulsing Glow */}
            <motion.div 
                animate={{ scale: [1, 1.25, 1], opacity: [0.18, 0.35, 0.18] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                className="w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-600/15 blur-[100px] absolute pointer-events-none -z-10"
            />

            {/* Category Pill */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/20 to-amber-500/15 border border-amber-500/35 text-amber-300 text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-2 shadow-sm"
            >
                <Award className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="truncate max-w-[280px] sm:max-w-md md:max-w-lg">
                    Pengumuman: {categoryName}
                </span>
            </motion.div>

            {/* Dramatic Climax Heading */}
            <motion.h2
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-5xl font-display font-black gold-shimmer tracking-wider uppercase mb-1 drop-shadow-[0_0_25px_rgba(245,158,11,0.45)] leading-tight"
            >
                And The Winner Is...
            </motion.h2>

            {/* Suspense Subtitle with Live Pulse */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 text-slate-300 text-xs sm:text-sm font-light tracking-wide mb-3 sm:mb-4"
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>
                    {count > 0 
                        ? `Siapakah di antara ${count} kandidat terbaik yang akan meraih penghargaan?`
                        : 'Tirai kemenangan akan segera terbuka...'}
                </span>
            </motion.div>

            {/* All Nominees Candidates Gallery — MAX 4 PER ROW, REMAINDER ON ROW BELOW */}
            {count > 0 ? (
                <div className="flex flex-col items-center justify-center gap-2.5 sm:gap-3.5 md:gap-4 w-full mx-auto px-2">
                    {chunkedNominees.map((row, rowIdx) => (
                        <div 
                            key={`row-${rowIdx}`}
                            className="flex flex-wrap sm:flex-nowrap items-stretch justify-center gap-2.5 sm:gap-3.5 md:gap-4 w-full"
                        >
                            {row.map((nominee, colIdx) => {
                                const globalIdx = rowIdx * MAX_PER_ROW + colIdx;
                                const emp = nominee.employee || {};

                                return (
                                    <motion.div
                                        key={nominee.id || globalIdx}
                                        initial={{ opacity: 0, y: 15, scale: 0.88 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ 
                                            delay: 0.15 + globalIdx * 0.05, 
                                            duration: 0.4, 
                                            ease: 'easeOut' 
                                        }}
                                        className={`${getCardWidthClass()} flex-shrink-0 group relative rounded-2xl bg-[#0c1224]/90 backdrop-blur-md border border-amber-500/25 hover:border-amber-400/60 p-2.5 sm:p-3 flex flex-col items-center text-center shadow-xl transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]`}
                                    >
                                        {/* Nominee Number Badge */}
                                        <div className="absolute top-1.5 left-1.5 z-10 px-1.5 py-0.2 rounded-md bg-black/70 border border-amber-500/40 text-[9px] font-mono font-bold text-amber-300">
                                            #{globalIdx + 1}
                                        </div>

                                        {/* Photo Frame with Gold Gradient */}
                                        <div className={`${getPhotoSizeClass()} rounded-xl p-0.5 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 shadow-md relative group-hover:shadow-gold-glow transition-shadow duration-300 mb-2 flex-shrink-0`}>
                                            <div className="w-full h-full rounded-[10px] overflow-hidden bg-[#090e1c] relative flex items-center justify-center">
                                                {emp.photo_url ? (
                                                    <img 
                                                        src={emp.photo_url} 
                                                        alt={emp.name || 'Nominee'} 
                                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                                                    />
                                                ) : (
                                                    <User className="w-7 h-7 sm:w-8 sm:h-8 text-slate-500" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Candidate Name & Position */}
                                        <div className="w-full min-w-0 flex flex-col justify-between flex-1">
                                            <h4 
                                                className="text-[11px] sm:text-xs md:text-[13px] font-display font-bold text-slate-100 line-clamp-2 group-hover:text-amber-300 transition-colors leading-tight min-h-[2.1rem] flex items-center justify-center"
                                                title={emp.name}
                                            >
                                                {emp.name || 'Nama Kandidat'}
                                            </h4>

                                            {/* Position & Department */}
                                            <p 
                                                className="text-[10px] sm:text-[11px] text-amber-300/80 truncate mt-1 leading-tight"
                                                title={`${emp.position || ''} - ${emp.department || ''}`}
                                            >
                                                {emp.position || emp.department || 'Official Nominee'}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            ) : (
                /* Fallback if category has 0 nominees registered */
                <motion.div
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0e1424] border-2 border-dashed border-amber-400/50 flex items-center justify-center mb-4 shadow-gold-glow"
                >
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                </motion.div>
            )}
        </motion.div>
    );
}
