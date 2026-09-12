import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/Hooks/useTheme';

export default function ThemeToggle({ className = '', showLabel = false }) {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Ganti ke Mode Terang (Light Mode)' : 'Ganti ke Mode Gelap (Dark Mode)'}
            aria-label={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            className={`relative inline-flex items-center justify-center gap-2 p-2 rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                isDark
                    ? 'bg-slate-900/80 hover:bg-slate-800/90 text-amber-300 border border-amber-500/30 hover:border-amber-400/60 shadow-sm hover:shadow-gold-glow'
                    : 'bg-amber-100/90 hover:bg-amber-200/90 text-amber-900 border border-amber-300 shadow-sm hover:shadow-md'
            } ${className}`}
        >
            <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.div
                            key="moon"
                            initial={{ y: -12, opacity: 0, rotate: -40 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: 12, opacity: 0, rotate: 40 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="flex items-center justify-center"
                        >
                            <Moon className="w-4 h-4 text-amber-300 fill-amber-300/20" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            initial={{ y: -12, opacity: 0, rotate: 40 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: 12, opacity: 0, rotate: -40 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="flex items-center justify-center"
                        >
                            <Sun className="w-4 h-4 text-amber-700 fill-amber-500/30" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {showLabel && (
                <span className="text-xs font-semibold tracking-wide select-none">
                    {isDark ? 'Mode Gelap' : 'Mode Terang'}
                </span>
            )}
        </button>
    );
}
