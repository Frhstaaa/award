import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Award, 
    Users, 
    UserCheck, 
    Trophy, 
    Music, 
    Play, 
    CheckCircle2, 
    Clock, 
    ArrowRight,
    Sparkles
} from 'lucide-react';

export default function Dashboard({ stats = {}, recentWinners = [], categories = [] }) {
    const readinessPercent = stats.totalCategories > 0 
        ? Math.round((stats.categoriesWithWinner / stats.totalCategories) * 100)
        : 0;

    return (
        <AdminLayout title="Dashboard Administrator">
            <Head title="Admin Dashboard - Employee Award" />

            {/* Quick Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-[#11192e] via-[#0f172a] to-[#141d33] border border-amber-500/20 shadow-2xl mb-8">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            Sistem Siap Digunakan
                        </div>
                        <h2 className="text-2xl md:text-3xl font-display font-bold gold-shimmer tracking-tight">
                            Selamat Datang di Panel Employee Award
                        </h2>
                        <p className="text-slate-300 text-sm mt-1 max-w-2xl font-light">
                            Kelola kategori, master data karyawan, nominasi, dan pemenang. Anda dapat langsung menjalankan slideshow presentasi dengan musik latar interaktif.
                        </p>
                    </div>

                    <a
                        href={route('showcase')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-display font-bold text-sm tracking-wider uppercase shadow-gold-glow hover:scale-105 transition-all self-start md:self-auto"
                    >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Mulai Showcase</span>
                    </a>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-amber-500/15 shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Kategori</p>
                        <h3 className="text-3xl font-display font-bold text-slate-100 mt-1">{stats.totalCategories || 0}</h3>
                        <p className="text-xs text-amber-400/80 mt-1">{stats.activeCategories || 0} kategori aktif</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Award className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-amber-500/15 shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Karyawan</p>
                        <h3 className="text-3xl font-display font-bold text-slate-100 mt-1">{stats.totalEmployees || 0}</h3>
                        <p className="text-xs text-slate-400 mt-1">Master data sumber nominee</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Users className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-amber-500/15 shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Nominasi</p>
                        <h3 className="text-3xl font-display font-bold text-slate-100 mt-1">{stats.totalNominees || 0}</h3>
                        <p className="text-xs text-slate-400 mt-1">Tersebar di seluruh kategori</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <UserCheck className="w-6 h-6" />
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-amber-500/15 shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pemenang Ditetapkan</p>
                        <h3 className="text-3xl font-display font-bold text-amber-300 mt-1">
                            {stats.categoriesWithWinner || 0} / {stats.totalCategories || 0}
                        </h3>
                        <p className="text-xs text-emerald-400 mt-1">{readinessPercent}% kesiapan acara</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                        <Trophy className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Two-Column Grid: Status Per Kategori & Pemenang Terkini */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Kesiapan Kategori (8 Cols) */}
                <div className="lg:col-span-8 p-6 rounded-3xl bg-[#0a0f1d] border border-amber-500/15 shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-display font-bold text-slate-100">
                                Kesiapan Kategori Award
                            </h3>
                            <p className="text-xs text-slate-400">
                                Status nominasi dan penetapan pemenang per kategori
                            </p>
                        </div>
                        <Link
                            href={route('admin.winners.index')}
                            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                        >
                            <span>Atur Pemenang</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {categories.length === 0 ? (
                            <p className="text-sm text-slate-500 py-6 text-center">Belum ada kategori terdaftar.</p>
                        ) : (
                            categories.map((cat) => {
                                const hasWinner = !!cat.winner;
                                const winnerName = cat.winner?.nominee?.employee?.name;
                                return (
                                    <div
                                        key={cat.id}
                                        className="p-4 rounded-2xl bg-[#0f1526] border border-slate-800/80 hover:border-amber-500/30 transition-colors flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 text-xs font-bold font-display">
                                                {cat.order}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-200">
                                                    {cat.name}
                                                </h4>
                                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                                    <span>{cat.nominees_count} Nominee</span>
                                                    <span>•</span>
                                                    {hasWinner ? (
                                                        <span className="text-amber-300 flex items-center gap-1">
                                                            <Trophy className="w-3 h-3 text-amber-400" />
                                                            {winnerName}
                                                        </span>
                                                    ) : (
                                                        <span className="text-rose-400/90">Belum ada pemenang</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {hasWinner ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Siap
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/20">
                                                    <Clock className="w-3 h-3" />
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right: Quick Links & Audio Summary (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Audio Summary Card */}
                    <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-amber-500/15 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-display font-bold text-slate-100 flex items-center gap-2">
                                <Music className="w-4 h-4 text-amber-400" />
                                <span>Status Musik Acara</span>
                            </h3>
                            <Link
                                href={route('admin.backsounds.index')}
                                className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                            >
                                Kelola
                            </Link>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            Sistem dilengkapi modul audio otomatis untuk 3 konteks: Intro umum, looping presentasi nominee, dan fanfare kemenangan pemenang.
                        </p>
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
                            <span>Total Lagu Aktif</span>
                            <span className="font-bold">{stats.totalBacksounds || 0} Track</span>
                        </div>
                    </div>

                    {/* Quick Access Actions */}
                    <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-amber-500/15 shadow-xl space-y-2.5">
                        <h3 className="text-sm font-display font-bold text-slate-300 mb-3">
                            Aksi Cepat
                        </h3>
                        <Link
                            href={route('admin.categories.index')}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-amber-500/10 hover:text-amber-300 text-slate-300 text-xs font-medium transition-colors border border-slate-800"
                        >
                            <span>+ Tambah Kategori Baru</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        </Link>
                        <Link
                            href={route('admin.employees.index')}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-amber-500/10 hover:text-amber-300 text-slate-300 text-xs font-medium transition-colors border border-slate-800"
                        >
                            <span>+ Tambah Data Karyawan</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        </Link>
                        <Link
                            href={route('admin.nominees.index')}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-amber-500/10 hover:text-amber-300 text-slate-300 text-xs font-medium transition-colors border border-slate-800"
                        >
                            <span>+ Assign Nominee ke Kategori</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        </Link>
                        <Link
                            href={route('admin.settings.index')}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 hover:bg-amber-500/10 hover:text-amber-300 text-slate-300 text-xs font-medium transition-colors border border-slate-800"
                        >
                            <span>⏱ Pengaturan Durasi Slide</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
