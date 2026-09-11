import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function ApplicationLogo({ 
    variant = 'full', 
    className = '', 
    iconClassName = 'w-9 h-9',
    logoUrl = null,
    title = null,
    subtitle = null
}) {
    const pageProps = usePage()?.props || {};
    const effectiveLogo = logoUrl || pageProps.app_logo || '/images/logo-rsu-livasya.png';
    const effectiveTitle = title || pageProps.event_title || 'RSU LIVASYA';
    const effectiveSubtitle = subtitle || pageProps.event_subtitle || 'Hospital Awards 2026';

    const [imgError, setImgError] = useState(false);

    // Fallback if image path is broken
    const fallbackNode = (
        <div className="w-full h-full flex items-center justify-center font-display font-black text-amber-600 text-xs">
            RSU
        </div>
    );

    const logoNode = (!imgError && effectiveLogo) ? (
        <img 
            src={effectiveLogo} 
            alt="Logo RSU Livasya" 
            className="w-full h-full object-contain filter drop-shadow-sm p-0.5"
            onError={() => setImgError(true)}
        />
    ) : fallbackNode;

    if (variant === 'icon') {
        return (
            <div className={`relative ${iconClassName} flex-shrink-0 flex items-center justify-center ${className}`}>
                <div className="w-full h-full rounded-xl bg-white p-1 border border-amber-400/40 shadow-gold-glow flex items-center justify-center overflow-hidden">
                    {logoNode}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className={`${iconClassName} flex-shrink-0 relative flex items-center justify-center`}>
                <div className="w-full h-full rounded-xl bg-white p-1 border border-amber-400/40 shadow-gold-glow flex items-center justify-center overflow-hidden">
                    {logoNode}
                </div>
            </div>

            <div className="truncate">
                <div className="flex items-center gap-1.5">
                    <span className="font-display font-black text-sm tracking-wider text-amber-300 gold-shimmer truncate">
                        {effectiveTitle}
                    </span>
                </div>
                <p className="text-[10px] text-amber-400/80 font-mono tracking-widest uppercase truncate">
                    {effectiveSubtitle}
                </p>
            </div>
        </div>
    );
}
