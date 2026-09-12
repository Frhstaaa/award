import React, { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Sliders, Clock, Sparkles, RefreshCw, Save, Image, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function SettingsIndex({ settings = {} }) {
    const fileInputRef = useRef(null);
    const [logoPreview, setLogoPreview] = useState(null);

    const { data, setData, post, processing, errors, recentlySuccessful, transform } = useForm({
        event_title: settings.event_title || 'RSU Livasya Awards 2026',
        event_subtitle: settings.event_subtitle || 'Malam Penganugerahan & Apresiasi Insan Berprestasi',
        slide_duration: settings.slide_duration || 8,
        suspense_duration: settings.suspense_duration || 4,
        reveal_duration: settings.reveal_duration || 10,
        auto_loop: settings.auto_loop !== undefined ? Boolean(settings.auto_loop) : true,
        app_logo: null,
        remove_logo: false,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('app_logo', file);
            setData('remove_logo', false);
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogoPreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResetToDefault = () => {
        setData('app_logo', null);
        setData('remove_logo', true);
        setLogoPreview('/images/logo-rsu-livasya.png');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            forceFormData: true,
        });
    };

    const currentLogoDisplay = logoPreview || settings.app_logo || '/images/logo-rsu-livasya.png';

    return (
        <AdminLayout title="Pengaturan Acara & Logo">
            <Head title="Pengaturan Acara & Logo - Admin" />

            <div className="max-w-3xl">
                <div className="mb-6">
                    <h3 className="text-xl font-display font-bold text-slate-900 dark:text-slate-100">
                        Pengaturan Brand, Logo & Slideshow
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        Kelola logo resmi rumah sakit, judul panggung, dan durasi transisi acara
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Brand & Hospital Logo Section */}
                    <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm dark:bg-[#0a0f1d] dark:border-amber-500/15 dark:shadow-xl space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <h4 className="text-sm font-display font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-2">
                                <Image className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                                <span>Logo Rumah Sakit / Aplikasi</span>
                            </h4>
                            <span className="text-[11px] font-mono text-amber-700 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 dark:text-amber-400/80">
                                Digunakan di Semua Halaman
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            {/* Logo Preview Box */}
                            <div className="relative flex-shrink-0">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-2 border-2 border-amber-400/40 shadow-gold-glow flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={currentLogoDisplay} 
                                        alt="Logo Preview" 
                                        className="w-full h-full object-contain filter drop-shadow"
                                    />
                                </div>
                                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 whitespace-nowrap">
                                    Logo Aktif
                                </span>
                            </div>

                            {/* Upload Controls */}
                            <div className="flex-1 space-y-3 w-full">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                                        Upload File Logo Baru (PNG, JPG, SVG, WebP)
                                    </label>
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-2.5">
                                        Format disarankan: PNG transparan persegi / kotak (minimal 512x512 px) agar tampil tajam di layar proyektor panggung.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="logo-upload"
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-all hover:scale-[1.02]"
                                    >
                                        <Upload className="w-3.5 h-3.5" />
                                        <span>Pilih File Logo Baru</span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={handleResetToDefault}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:border-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Reset ke Logo RSU Livasya</span>
                                    </button>
                                </div>

                                {data.app_logo && (
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        File terpilih: {data.app_logo.name} (siap disimpan)
                                    </p>
                                )}

                                {errors.app_logo && (
                                    <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.app_logo}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* General Event Info */}
                    <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm dark:bg-[#0a0f1d] dark:border-amber-500/15 dark:shadow-xl space-y-5">
                        <h4 className="text-sm font-display font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                            <span>Informasi Teks Header Acara</span>
                        </h4>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Judul Acara (Event Title) *
                            </label>
                            <input
                                type="text"
                                value={data.event_title}
                                onChange={(e) => setData('event_title', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-display"
                                required
                            />
                            {errors.event_title && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.event_title}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Subtitle / Tema Acara
                            </label>
                            <input
                                type="text"
                                value={data.event_subtitle}
                                onChange={(e) => setData('event_subtitle', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                            />
                            {errors.event_subtitle && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.event_subtitle}</p>}
                        </div>
                    </div>

                    {/* Timing Settings */}
                    <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm dark:bg-[#0a0f1d] dark:border-amber-500/15 dark:shadow-xl space-y-5">
                        <h4 className="text-sm font-display font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                            <span>Konfigurasi Durasi Auto-Play Slideshow</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Slide Nominasi (Detik) *
                                </label>
                                <input
                                    type="number"
                                    min="3"
                                    max="60"
                                    value={data.slide_duration}
                                    onChange={(e) => setData('slide_duration', parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                    required
                                />
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Waktu tampil per nominee</span>
                                {errors.slide_duration && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.slide_duration}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Jeda Suspense (Detik) *
                                </label>
                                <input
                                    type="number"
                                    min="2"
                                    max="30"
                                    value={data.suspense_duration}
                                    onChange={(e) => setData('suspense_duration', parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                    required
                                />
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">"And the winner is..."</span>
                                {errors.suspense_duration && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.suspense_duration}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Selebrasi Juara (Detik) *
                                </label>
                                <input
                                    type="number"
                                    min="5"
                                    max="60"
                                    value={data.reveal_duration}
                                    onChange={(e) => setData('reveal_duration', parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                    required
                                />
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">Tirai terbuka & confetti</span>
                                {errors.reveal_duration && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.reveal_duration}</p>}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.auto_loop}
                                    onChange={(e) => setData('auto_loop', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-400 bg-white dark:bg-slate-900"
                                />
                                <div>
                                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Looping Otomatis ke Awal</span>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Setelah semua kategori selesai diumumkan, slideshow akan kembali mengulang dari kategori pertama secara mulus.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        {recentlySuccessful ? (
                            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-300 dark:text-emerald-400 font-semibold flex items-center gap-1.5 dark:bg-emerald-950/40 dark:border-emerald-500/30 px-3 py-1.5 rounded-xl">
                                ✓ Pengaturan dan logo berhasil disimpan
                            </span>
                        ) : <div />}

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-glow hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
