import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Award, 
    Users, 
    UserCheck, 
    Trophy, 
    Music, 
    Sliders, 
    Play, 
    LogOut, 
    Menu, 
    X, 
    CheckCircle2, 
    AlertCircle, 
    ExternalLink,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';

export default function AdminLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, route: 'admin.dashboard' },
        { label: 'Kategori Award', icon: Award, route: 'admin.categories.index' },
        { label: 'Data Karyawan', icon: Users, route: 'admin.employees.index' },
        { label: 'Manajemen Nominasi', icon: UserCheck, route: 'admin.nominees.index' },
        { label: 'Penetapan Pemenang', icon: Trophy, route: 'admin.winners.index' },
        { label: 'Backsound & Audio', icon: Music, route: 'admin.backsounds.index' },
        { label: 'Pengaturan Acara', icon: Sliders, route: 'admin.settings.index' },
    ];

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <div className="h-screen h-[100dvh] w-full overflow-hidden bg-slate-100 dark:bg-[#070a13] text-slate-800 dark:text-slate-100 flex flex-col md:flex-row select-none transition-colors duration-300">
            {/* Mobile Header (Fixed at top on small screens) */}
            <div className="md:hidden flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white dark:bg-[#090d18] border-b border-slate-200 dark:border-amber-500/20 z-30 transition-colors duration-300">
                <ApplicationLogo variant="full" iconClassName="w-8 h-8" subtitle="Admin Panel" />
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-amber-700 dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-300 dark:hover:text-amber-400 dark:hover:border-amber-500/30 transition-all"
                        aria-label="Toggle Menu"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Sidebar (Fixed Desktop & Mobile Drawer, Never Scrolls with Main Content) */}
            <aside
                className={`fixed md:static inset-y-0 left-0 z-40 w-64 h-full flex-shrink-0 bg-white dark:bg-[#090d18] border-r border-slate-200 dark:border-amber-500/15 flex flex-col justify-between transform transition-transform duration-300 ease-out md:translate-x-0 transition-colors ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Brand / Logo Header */}
                <div className="p-5 border-b border-slate-200 dark:border-amber-500/10 flex-shrink-0">
                    <Link href={route('admin.dashboard')} className="block hover:opacity-90 transition-opacity">
                        <ApplicationLogo 
                            variant="full" 
                            iconClassName="w-10 h-10" 
                            subtitle="Panel Kontrol Admin" 
                        />
                    </Link>
                </div>

                {/* Navigation Menu (Scrolls independently if screen height is constrained) */}
                <nav className="p-3.5 space-y-1.5 flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="px-3 pb-1.5 text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 font-semibold">
                        Menu Utama
                    </div>

                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = route().current(item.route) || route().current(item.route + '.*');
                        return (
                            <Link
                                key={item.route}
                                href={route(item.route)}
                                onClick={() => setSidebarOpen(false)}
                                className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                                    isActive
                                        ? 'bg-amber-100/90 text-amber-950 border border-amber-300/80 shadow-sm font-bold dark:bg-[#101726] dark:bg-gradient-to-r dark:from-amber-500/20 dark:via-amber-500/10 dark:to-transparent dark:text-amber-300 dark:border-amber-400/40 dark:shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                                        : 'text-slate-600 hover:text-amber-950 hover:bg-amber-50/80 hover:translate-x-0.5 dark:text-slate-400 dark:hover:text-amber-200 dark:hover:bg-amber-500/10 dark:hover:border dark:hover:border-amber-500/20'
                                } active:scale-[0.98]`}
                            >
                                {isActive && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-amber-500 dark:bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                                )}
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg transition-colors ${
                                        isActive 
                                            ? 'bg-amber-200/90 text-amber-950 dark:bg-amber-500/20 dark:text-amber-300 dark:border dark:border-amber-400/30 shadow-xs' 
                                            : 'bg-slate-100 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-800 dark:bg-slate-900/60 dark:text-slate-400 dark:group-hover:bg-amber-500/15 dark:group-hover:text-amber-300'
                                    }`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span>{item.label}</span>
                                </div>
                                {isActive && (
                                    <ChevronRight className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400/90" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom User Profile & Quick Showcase Action (Pinned at bottom of sidebar) */}
                <div className="p-4 border-t border-slate-200 dark:border-amber-500/10 space-y-2.5 flex-shrink-0 bg-slate-50 dark:bg-[#070b14] transition-colors duration-300">
                    {/* Launch Showcase Button */}
                    <a
                        href={route('showcase')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-glow transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Buka Showcase</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Admin User Card */}
                    <div className="flex items-center justify-between pt-1 px-2 text-xs">
                        <div className="truncate pr-2">
                            <div className="flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{auth.user?.name}</p>
                            </div>
                            <p className="text-[10px] text-amber-700 dark:text-amber-400/70 font-mono capitalize tracking-wider font-medium">
                                {auth.user?.role || 'Super Admin'}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            title="Keluar dari Panel Admin"
                            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Backdrop Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden transition-opacity"
                />
            )}

            {/* Main Content Area (Independent Smooth Scrolling Container) */}
            <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden">
                {/* Desktop Sticky Header */}
                <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-white/90 dark:bg-[#090d18]/90 backdrop-blur-md border-b border-slate-200 dark:border-amber-500/15 flex-shrink-0 z-20 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-display font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                            {title || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300/80 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:text-emerald-400 text-[11px] font-mono">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>RSU LIVASYA LIVE</span>
                        </div>

                        {/* Theme Toggle Button */}
                        <ThemeToggle />

                        <a
                            href={route('showcase')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider transition-all shadow-sm dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/20"
                        >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Lihat Layar Panggung</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </header>

                {/* Flash Messages Banner */}
                {flash?.success && (
                    <div className="mx-6 md:mx-8 mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-500/40 dark:text-emerald-300 flex items-center gap-3 text-xs md:text-sm shadow-sm flex-shrink-0 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-6 md:mx-8 mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 dark:bg-rose-950/60 dark:border-rose-500/40 dark:text-rose-300 flex items-center gap-3 text-xs md:text-sm shadow-sm flex-shrink-0 animate-fade-in">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 dark:text-rose-400" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Independent Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-8 scroll-smooth bg-slate-100/70 dark:bg-[#070a13] transition-colors duration-300">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
