import React, { useEffect, useRef } from 'react';

/**
 * Luxury Gold Particles & Gala Lighting Engine
 * 
 * Provides high-performance 60 FPS HTML5 Canvas rendering for:
 * 1. Floating Gold Dust & Embers (rising stardust with organic sway)
 * 2. Twinkling Diamond Gala Sparkles (4-point starbursts)
 * 3. Cinematic Bokeh Light Orbs (theatrical depth-of-field)
 */
export default function GoldParticles({ 
    className = '', 
    dustCount = 55, 
    starCount = 12, 
    bokehCount = 7,
    isDark = true
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId;
        let isRunning = true;
        let width = 0;
        let height = 0;

        // Luxury Gold Color Palette (Adaptive for Dark & Light modes)
        const goldColors = isDark !== false ? [
            { r: 255, g: 215, b: 0 },    // Pure Gold (#FFD700)
            { r: 253, g: 224, b: 71 },   // Champagne Gold (#FDE047)
            { r: 245, g: 158, b: 11 },   // Warm Amber Gold (#F59E0B)
            { r: 226, g: 183, b: 85 },   // Royal Metallic Gold (#E2B755)
            { r: 254, g: 243, b: 199 },  // White Gold Sparkle (#FEF3C7)
        ] : [
            { r: 217, g: 119, b: 6 },    // Deep Polished Gold (#D97706)
            { r: 245, g: 158, b: 11 },   // Warm Amber Gold (#F59E0B)
            { r: 202, g: 138, b: 4 },    // Classic 24K Gold (#CA8A04)
            { r: 180, g: 83, b: 9 },     // Imperial Bronze Gold (#B45309)
            { r: 251, g: 191, b: 36 },   // Radiant Gold Sparkle (#FBBF24)
        ];

        // 1. Initialize Floating Gold Dust & Embers
        const dustParticles = [];
        const initDust = () => {
            dustParticles.length = 0;
            for (let i = 0; i < dustCount; i++) {
                const color = goldColors[Math.floor(Math.random() * goldColors.length)];
                dustParticles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: 0.8 + Math.random() * 2.2, // 0.8px - 3px
                    color,
                    vy: -(0.25 + Math.random() * 0.65), // Gentle upward drift
                    swayOffset: Math.random() * Math.PI * 2,
                    swaySpeed: 0.012 + Math.random() * 0.02,
                    swayAmplitude: 0.35 + Math.random() * 0.7,
                    baseAlpha: 0.35 + Math.random() * 0.55,
                    pulseSpeed: 0.015 + Math.random() * 0.03,
                    pulsePhase: Math.random() * Math.PI * 2,
                });
            }
        };

        // 2. Initialize Twinkling Diamond Stars (4-point gala sparkles)
        const twinklingStars = [];
        const initStars = () => {
            twinklingStars.length = 0;
            for (let i = 0; i < starCount; i++) {
                twinklingStars.push({
                    x: Math.random() * width,
                    y: Math.random() * height * 0.85, // mostly upper and mid stage
                    size: 4 + Math.random() * 8,       // sparkle ray length
                    alpha: 0,
                    targetAlpha: 0.5 + Math.random() * 0.5,
                    alphaSpeed: 0.01 + Math.random() * 0.02,
                    state: Math.random() > 0.5 ? 'fadeIn' : 'wait',
                    waitCounter: Math.floor(Math.random() * 120),
                    rotation: (Math.PI / 4) + (Math.random() * 0.2 - 0.1),
                });
            }
        };

        // 3. Initialize Soft Bokeh Light Orbs (Cinematic Depth-of-field)
        const bokehOrbs = [];
        const initBokeh = () => {
            bokehOrbs.length = 0;
            for (let i = 0; i < bokehCount; i++) {
                const color = goldColors[Math.floor(Math.random() * 3)];
                bokehOrbs.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: 35 + Math.random() * 60, // 35px - 95px
                    color,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.15,
                    alpha: 0.05 + Math.random() * 0.08,
                    pulse: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.008 + Math.random() * 0.012,
                });
            }
        };

        // Resize Canvas and scale for Retina Displays
        const handleResize = () => {
            const rect = canvas.getBoundingClientRect();
            width = rect.width || window.innerWidth;
            height = rect.height || window.innerHeight;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            initDust();
            initStars();
            initBokeh();
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        // Visibility Change Handler (Pause on hidden tab to preserve battery/CPU)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                isRunning = false;
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
            } else {
                isRunning = true;
                lastTime = performance.now();
                animationFrameId = requestAnimationFrame(render);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        let lastTime = performance.now();
        let tick = 0;

        // Render Loop
        const render = (time) => {
            if (!isRunning) return;

            tick++;
            ctx.clearRect(0, 0, width, height);

            // -------------------------------------------------------------
            // A. DRAW BOKEH LIGHT ORBS (Deepest Layer)
            // -------------------------------------------------------------
            for (let i = 0; i < bokehOrbs.length; i++) {
                const orb = bokehOrbs[i];
                orb.x += orb.vx;
                orb.y += orb.vy;
                orb.pulse += orb.pulseSpeed;

                // Screen Wrap
                if (orb.x < -orb.radius) orb.x = width + orb.radius;
                if (orb.x > width + orb.radius) orb.x = -orb.radius;
                if (orb.y < -orb.radius) orb.y = height + orb.radius;
                if (orb.y > height + orb.radius) orb.y = -orb.radius;

                const currentAlpha = orb.alpha * (0.8 + Math.sin(orb.pulse) * 0.2);
                const gradient = ctx.createRadialGradient(
                    orb.x, orb.y, 0,
                    orb.x, orb.y, orb.radius
                );
                gradient.addColorStop(0, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${currentAlpha})`);
                gradient.addColorStop(0.5, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${currentAlpha * 0.4})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            // -------------------------------------------------------------
            // B. DRAW FLOATING GOLD DUST & EMBERS (Mid Layer)
            // -------------------------------------------------------------
            for (let i = 0; i < dustParticles.length; i++) {
                const p = dustParticles[i];
                p.y += p.vy;
                p.swayOffset += p.swaySpeed;
                p.pulsePhase += p.pulseSpeed;
                p.x += Math.sin(p.swayOffset) * p.swayAmplitude;

                // Wrap to bottom when particle moves off top screen
                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }
                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;

                const currentAlpha = Math.max(0.1, Math.min(1, p.baseAlpha + Math.sin(p.pulsePhase) * 0.25));

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha})`;
                
                // Add delicate glow to larger embers
                if (p.radius > 1.8) {
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.7)`;
                } else {
                    ctx.shadowBlur = 0;
                }
                ctx.fill();
            }
            ctx.shadowBlur = 0; // reset

            // -------------------------------------------------------------
            // C. DRAW TWINKLING DIAMOND STARS (Gala Cross Sparkles)
            // -------------------------------------------------------------
            for (let i = 0; i < twinklingStars.length; i++) {
                const star = twinklingStars[i];

                if (star.state === 'wait') {
                    star.waitCounter--;
                    if (star.waitCounter <= 0) {
                        star.state = 'fadeIn';
                        star.x = Math.random() * width;
                        star.y = Math.random() * height * 0.85;
                        star.alpha = 0;
                    }
                    continue;
                }

                if (star.state === 'fadeIn') {
                    star.alpha += star.alphaSpeed;
                    if (star.alpha >= star.targetAlpha) {
                        star.alpha = star.targetAlpha;
                        star.state = 'fadeOut';
                    }
                } else if (star.state === 'fadeOut') {
                    star.alpha -= star.alphaSpeed * 0.8;
                    if (star.alpha <= 0) {
                        star.alpha = 0;
                        star.state = 'wait';
                        star.waitCounter = 40 + Math.floor(Math.random() * 140);
                    }
                }

                if (star.alpha > 0.02) {
                    ctx.save();
                    ctx.translate(star.x, star.y);
                    ctx.rotate(star.rotation);

                    const s = star.size;
                    const a = star.alpha;

                    // Central Bright Core
                    ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
                    ctx.beginPath();
                    ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
                    ctx.fill();

                    // 4-pointed golden sparkle ray
                    ctx.strokeStyle = isDark !== false 
                        ? `rgba(253, 224, 71, ${a * 0.9})` 
                        : `rgba(217, 119, 6, ${a * 0.9})`;
                    ctx.lineWidth = 1;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = isDark !== false 
                        ? `rgba(245, 158, 11, ${a * 0.8})` 
                        : `rgba(180, 83, 9, ${a * 0.7})`;

                    ctx.beginPath();
                    // Vertical ray
                    ctx.moveTo(0, -s);
                    ctx.lineTo(0, s);
                    // Horizontal ray
                    ctx.moveTo(-s, 0);
                    ctx.lineTo(s, 0);
                    ctx.stroke();

                    ctx.restore();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            isRunning = false;
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [dustCount, starCount, bokehCount, isDark]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
            style={{ zIndex: 1 }}
        />
    );
}
