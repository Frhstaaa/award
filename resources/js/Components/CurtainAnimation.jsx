import { motion } from 'framer-motion';

export default function CurtainAnimation({ isOpen = false, children }) {
    return (
        <div className="relative w-full min-h-[300px] h-[330px] sm:h-[370px] md:h-[400px] max-h-[58vh] overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#0a0d1a] to-[#04060d] shadow-2xl flex items-center justify-center">
            {/* Background Content Revealed Behind Curtain */}
            <div className="w-full h-full flex items-center justify-center p-3 sm:p-5 relative z-0">
                {/* Spotlight Background Beam */}
                <div className="absolute inset-0 spotlight-beam pointer-events-none opacity-80" />
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
                <div className="absolute top-3 left-4 px-2.5 py-0.5 rounded bg-black/40 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-display tracking-widest uppercase">
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
                <div className="absolute top-3 right-4 px-2.5 py-0.5 rounded bg-black/40 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs font-display tracking-widest uppercase">
                    Excellence
                </div>
            </motion.div>

            {/* Top Pelmet / Valance Drapery Banner */}
            <div className="absolute top-0 left-0 right-0 h-7 sm:h-8 z-30 bg-gradient-to-b from-[#3a0609] to-[#1e0204] border-b-2 border-amber-500/60 flex items-center justify-center shadow-lg">
                <div className="h-0.5 w-16 sm:w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                <div className="mx-3 text-[10px] sm:text-xs font-display tracking-widest text-amber-300 uppercase flex items-center gap-1.5">
                    <span className="text-amber-400 text-[9px]">✦</span>
                    Official Award Ceremony
                    <span className="text-amber-400 text-[9px]">✦</span>
                </div>
                <div className="h-0.5 w-16 sm:w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            </div>
        </div>
    );
}
