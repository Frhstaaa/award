import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#070a13] stars-bg px-4 py-8 relative selection:bg-amber-500 selection:text-black">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center justify-center group">
                        <ApplicationLogo 
                            variant="full" 
                            iconClassName="w-12 h-12" 
                            subtitle="Administrator Portal" 
                            className="group-hover:scale-105 transition-transform"
                        />
                    </Link>
                </div>

                {/* Card Container */}
                <div className="rounded-3xl bg-[#0c1222]/90 backdrop-blur-xl border border-amber-500/30 p-8 shadow-2xl shadow-black">
                    {children}
                </div>

                {/* Back to Showcase */}
                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-amber-300 transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Halaman Showcase Publik</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
