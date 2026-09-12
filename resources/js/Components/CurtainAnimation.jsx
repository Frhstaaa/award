import { motion } from 'framer-motion';

export default function CurtainAnimation({ isOpen = false, children }) {
    return (
        <div className="relative w-full h-[400px] sm:h-[430px] md:h-[460px] overflow-hidden rounded-3xl border-2 border-amber-400/60 bg-gradient-to-b from-[#fffdfa] via-[#fef6e5] to-[#fbf0d8] text-amber-950 shadow-[0_25px_60px_-15px_rgba(180,83,9,0.22),0_0_40px_rgba(245,158,11,0.25)] dark:bg-gradient-to-b dark:from-[#181107] dark:via-[#110c04] dark:to-[#080502] dark:text-amber-50 dark:shadow-[0_16px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.18)] flex items-center justify-center transition-colors duration-300">
            {/* Full-Bleed Theatrical Stage Ambient Lighting (Unified 100% Height & Width) */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-400/15 via-yellow-400/8 to-transparent pointer-events-none z-0" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-full bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.2)_0%,_rgba(253,224,71,0.08)_45%,_transparent_75%)] blur-2xl pointer-events-none z-0" />

            {/* Background Content Revealed Behind Curtain (Full Height & Centered) */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-3 sm:p-5 md:p-6">
                {children}
            </div>

            {/* Left Velvet Curtain */}
            <motion.div
                initial={{ x: '0%' }}
                animate={{ x: isOpen ? '-100%' : '0%' }}
                transition={{
                    duration: 2.0,
                    ease: [0.77, 0, 0.175, 1], // cinematic smooth cubic bezier
                }}
                className="absolute top-0 left-0 bottom-0 w-1/2 z-20 velvet-curtain-left border-r-2 border-amber-400/40"
            >
                {/* Gold Fringe Trim at Bottom and Inner Edge */}
                <div className="absolute top-0 right-0 bottom-0 w-2.5 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 opacity-90 shadow-lg" />
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 border-t border-amber-300/40" />
                {/* Decorative Drapery Swag */}
                <div className="absolute top-3 left-4 px-2.5 py-0.5 rounded bg-black/50 border border-amber-400/40 text-amber-200 text-[10px] sm:text-xs font-display tracking-widest uppercase shadow">
                    Award Stage
                </div>
            </motion.div>

            {/* Right Velvet Curtain */}
            <motion.div
                initial={{ x: '0%' }}
                animate={{ x: isOpen ? '100%' : '0%' }}
                transition={{
                    duration: 2.0,
                    ease: [0.77, 0, 0.175, 1],
                }}
                className="absolute top-0 right-0 bottom-0 w-1/2 z-20 velvet-curtain-right border-l-2 border-amber-400/40"
            >
                {/* Gold Fringe Trim at Bottom and Inner Edge */}
                <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 opacity-90 shadow-lg" />
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 border-t border-amber-300/40" />
                <div className="absolute top-3 right-4 px-2.5 py-0.5 rounded bg-black/50 border border-amber-400/40 text-amber-200 text-[10px] sm:text-xs font-display tracking-widest uppercase shadow">
                    Excellence
                </div>
            </motion.div>

            {/* Top Pelmet / Valance Drapery Banner */}
            <div className="absolute top-0 left-0 right-0 h-8 sm:h-9 z-30 bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#fcd34d] border-b-2 border-amber-500/80 dark:bg-gradient-to-b dark:from-[#2a1705] dark:to-[#120a02] dark:border-amber-400/70 flex items-center justify-center shadow-md transition-colors duration-300">
                <div className="h-0.5 w-16 sm:w-20 bg-gradient-to-r from-transparent via-amber-600 dark:via-amber-400 to-transparent" />
                <div className="mx-3 text-[10px] sm:text-xs font-display tracking-widest text-amber-950 dark:text-amber-300 uppercase flex items-center gap-1.5 font-extrabold">
                    <span className="text-amber-700 dark:text-amber-400 text-[9px]">✦</span>
                    Official Award Ceremony
                    <span className="text-amber-700 dark:text-amber-400 text-[9px]">✦</span>
                </div>
                <div className="h-0.5 w-16 sm:w-20 bg-gradient-to-r from-transparent via-amber-600 dark:via-amber-400 to-transparent" />
            </div>
        </div>
    );
}
