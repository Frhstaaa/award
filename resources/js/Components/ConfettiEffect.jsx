import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiEffect({ active = false, continuous = true }) {
    const timeoutsRef = useRef([]);
    const intervalRef = useRef(null);

    useEffect(() => {
        // Clear any previous animations
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (!active) {
            confetti.reset();
            return;
        }

        // Royal Gala celebratory palette: Pure Gold, Champagne, Warm Amber, Brilliant White, Sunburst Yellow
        const colors = ['#FFD700', '#F59E0B', '#FFFFFF', '#FBBF24', '#FDE047', '#E2B755', '#F5D061'];

        const safeTimeout = (fn, delay) => {
            const id = setTimeout(fn, delay);
            timeoutsRef.current.push(id);
            return id;
        };

        // -------------------------------------------------------------
        // PHASE 1: INITIAL GRAND EXPLOSION (First 1.5 seconds)
        // -------------------------------------------------------------

        // 1. Center Mega Burst with Stars & Circles
        confetti({
            particleCount: 120,
            spread: 120,
            origin: { x: 0.5, y: 0.65 },
            colors: colors,
            shapes: ['star', 'circle'],
            scalar: 1.2,
            startVelocity: 55,
            disableForReducedMotion: true,
            zIndex: 9999,
        });

        // 2. Left High-Power Cannon
        safeTimeout(() => {
            confetti({
                particleCount: 85,
                angle: 60,
                spread: 80,
                origin: { x: 0.02, y: 0.82 },
                colors: colors,
                startVelocity: 65,
                scalar: 1.1,
                zIndex: 9999,
            });
        }, 150);

        // 3. Right High-Power Cannon
        safeTimeout(() => {
            confetti({
                particleCount: 85,
                angle: 120,
                spread: 80,
                origin: { x: 0.98, y: 0.82 },
                colors: colors,
                startVelocity: 65,
                scalar: 1.1,
                zIndex: 9999,
            });
        }, 300);

        // 4. Sky Golden Stars Waterfall (Slow Floating Cascade)
        safeTimeout(() => {
            confetti({
                particleCount: 70,
                spread: 110,
                origin: { x: 0.5, y: 0.25 },
                colors: colors,
                shapes: ['star'],
                scalar: 1.3,
                gravity: 0.65,
                ticks: 280,
                startVelocity: 30,
                zIndex: 9999,
            });
        }, 600);

        // 5. Cross-Stage Cannon Volley
        safeTimeout(() => {
            confetti({
                particleCount: 60,
                angle: 50,
                spread: 65,
                origin: { x: 0.05, y: 0.75 },
                colors: colors,
                startVelocity: 60,
                zIndex: 9999,
            });
            confetti({
                particleCount: 60,
                angle: 130,
                spread: 65,
                origin: { x: 0.95, y: 0.75 },
                colors: colors,
                startVelocity: 60,
                zIndex: 9999,
            });
        }, 950);

        // -------------------------------------------------------------
        // PHASE 2: CONTINUOUS CELEBRATION LOOP (Until winner slide ends)
        // -------------------------------------------------------------
        if (continuous) {
            let cycle = 0;

            safeTimeout(() => {
                intervalRef.current = setInterval(() => {
                    // Pause generation if window/tab is in background to preserve CPU/memory
                    if (typeof document !== 'undefined' && document.hidden) {
                        return;
                    }

                    const step = cycle % 3;

                    if (step === 0) {
                        // Left Cannon Volley + Golden Rain from Top-Right
                        confetti({
                            particleCount: 40,
                            angle: 58,
                            spread: 70,
                            origin: { x: 0.02, y: 0.85 },
                            colors: colors,
                            startVelocity: 55,
                            zIndex: 9999,
                        });
                        confetti({
                            particleCount: 25,
                            spread: 60,
                            origin: { x: 0.75, y: 0.05 },
                            colors: colors,
                            shapes: ['star'],
                            scalar: 1.2,
                            gravity: 0.6,
                            ticks: 220,
                            zIndex: 9999,
                        });
                    } else if (step === 1) {
                        // Right Cannon Volley + Golden Rain from Top-Left
                        confetti({
                            particleCount: 40,
                            angle: 122,
                            spread: 70,
                            origin: { x: 0.98, y: 0.85 },
                            colors: colors,
                            startVelocity: 55,
                            zIndex: 9999,
                        });
                        confetti({
                            particleCount: 25,
                            spread: 60,
                            origin: { x: 0.25, y: 0.05 },
                            colors: colors,
                            shapes: ['star'],
                            scalar: 1.2,
                            gravity: 0.6,
                            ticks: 220,
                            zIndex: 9999,
                        });
                    } else {
                        // Central Sky Firework / Sparkle Pop
                        confetti({
                            particleCount: 50,
                            spread: 95,
                            origin: {
                                x: 0.35 + Math.random() * 0.3,
                                y: 0.2 + Math.random() * 0.25,
                            },
                            colors: colors,
                            shapes: ['star', 'circle'],
                            scalar: 1.25,
                            startVelocity: 35,
                            gravity: 0.7,
                            ticks: 240,
                            zIndex: 9999,
                        });
                    }

                    cycle++;
                }, 1300); // Trigger every 1.3s for a constant festive aura
            }, 1400);
        }

        // Cleanup function when slide changes or component unmounts
        return () => {
            timeoutsRef.current.forEach(clearTimeout);
            timeoutsRef.current = [];
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            confetti.reset();
        };
    }, [active, continuous]);

    return null;
}
