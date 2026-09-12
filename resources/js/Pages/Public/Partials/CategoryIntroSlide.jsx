import React from 'react';
import { Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CategoryIntroSlide({ category, categoryIndex, totalCategories }) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full max-w-2xl mx-auto text-center px-4 py-2 flex flex-col items-center justify-center my-auto"
        >
            {/* Category Counter Pill */}
            <motion.div 
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full royal-gold-pill text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
            >
                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-yellow-300" />
                <span>Kategori {categoryIndex + 1} dari {totalCategories}</span>
            </motion.div>

            {/* Glowing Category Icon */}
            <motion.div 
                initial={{ scale: 0.85, rotate: -8 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.25, type: 'spring', stiffness: 220 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 royal-gold-frame mb-4 shadow-md"
            >
                <div className="w-full h-full rounded-[14px] royal-gold-avatar-bg flex items-center justify-center overflow-hidden border border-amber-400/40">
                    {category.icon_url ? (
                        <img 
                            src={category.icon_url} 
                            alt={category.name} 
                            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                        />
                    ) : (
                        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 dark:text-yellow-400 animate-pulse" />
                    )}
                </div>
            </motion.div>

            {/* Category Title */}
            <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-2xl sm:text-3xl md:text-5xl font-display font-black gold-title-crisp tracking-tight mb-3 leading-tight"
            >
                {category.name}
            </motion.h2>

            {/* Category Description */}
            {category.description && (
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="text-amber-900/90 dark:text-amber-100/90 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-medium mb-4 line-clamp-3 drop-shadow-sm"
                >
                    {category.description}
                </motion.p>
            )}

            {/* Total Nominees Teaser */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="text-xs sm:text-sm text-amber-800 dark:text-yellow-300 font-mono uppercase tracking-widest font-bold drop-shadow-sm"
            >
                ✦ Menampilkan {category.nominees ? category.nominees.length : 0} Kandidat Nominasi ✦
            </motion.div>

        </motion.div>
    );
}
