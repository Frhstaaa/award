import React, { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Music, Plus, Play, Square, Trash2, X, Volume2, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function BacksoundsIndex({ backsounds = [], categories = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playingId, setPlayingId] = useState(null);
    const audioRef = useRef(new Audio());

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        context: 'general',
        category_id: '',
        audio: null,
    });

    const openModal = () => {
        reset();
        clearErrors();
        setData({
            title: '',
            context: 'general',
            category_id: '',
            audio: null,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const handlePlayPreview = (track) => {
        if (playingId === track.id) {
            audioRef.current.pause();
            setPlayingId(null);
        } else {
            audioRef.current.pause();
            audioRef.current.src = track.file_url;
            audioRef.current.play().catch(e => console.warn('Preview audio error:', e));
            setPlayingId(track.id);
            audioRef.current.onended = () => setPlayingId(null);
        }
    };

    const handleToggleActive = (id) => {
        router.post(route('admin.backsounds.toggle', id), {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id, title) => {
        if (confirm(`Hapus file audio "${title}"?`)) {
            if (playingId === id) {
                audioRef.current.pause();
                setPlayingId(null);
            }
            router.delete(route('admin.backsounds.destroy', id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.backsounds.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const getContextBadge = (context) => {
        switch (context) {
            case 'winner_reveal':
                return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold">Pengumuman Pemenang (Fanfare)</span>;
            case 'suspense':
                return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-semibold">Detik-Detik Pemenang (Suspense)</span>;
            case 'nominee_display':
                return <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">Slide Nominasi (Loop)</span>;
            case 'background_loop':
                return <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold">Ambient Loop</span>;
            default:
                return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">Umum / Intro</span>;
        }
    };

    return (
        <AdminLayout title="Manajemen Backsound & Musik">
            <Head title="Backsound & Audio - Admin" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-display font-bold text-slate-100">
                        Pustaka Audio Acara
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Kelola file backsound untuk slide pengantar, nominasi, dan reveal pemenang
                    </p>
                </div>

                <button
                    onClick={openModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-glow hover:from-amber-400 hover:to-amber-500 transition-all self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Upload Audio</span>
                </button>
            </div>

            {/* Backsounds Table */}
            <div className="rounded-2xl bg-[#0a0f1d] border border-amber-500/15 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-[#0f1629] text-xs font-semibold text-amber-400/90 uppercase tracking-wider border-b border-amber-500/10">
                            <tr>
                                <th className="px-6 py-4 w-12 text-center">Play</th>
                                <th className="px-6 py-4">Judul Lagu / Track</th>
                                <th className="px-6 py-4">Konteks Penggunaan</th>
                                <th className="px-6 py-4">Kategori Khusus</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                            {backsounds.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-slate-500">
                                        Belum ada audio yang diunggah. Klik "Upload Audio" untuk menambahkan file musik.
                                    </td>
                                </tr>
                            ) : (
                                backsounds.map((track) => (
                                    <tr key={track.id} className="hover:bg-slate-900/40 transition-colors">
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handlePlayPreview(track)}
                                                className={`p-2.5 rounded-full transition-all ${
                                                    playingId === track.id
                                                        ? 'bg-amber-500 text-black shadow-gold-glow'
                                                        : 'bg-slate-800 text-slate-300 hover:text-amber-300 hover:bg-slate-700'
                                                }`}
                                                title={playingId === track.id ? 'Berhenti' : 'Putar Preview'}
                                            >
                                                {playingId === track.id ? (
                                                    <Square className="w-3.5 h-3.5 fill-current" />
                                                ) : (
                                                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-100">
                                            <div className="flex items-center gap-2">
                                                <Music className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                                <span>{track.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getContextBadge(track.context)}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-400">
                                            {track.category ? track.category.name : 'Semua Kategori (Global)'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleActive(track.id)}
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                                                    track.is_active
                                                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                                        : 'bg-slate-800 text-slate-500 border-slate-700'
                                                }`}
                                            >
                                                {track.is_active ? 'Aktif' : 'Nonaktif'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(track.id, track.title)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                                title="Hapus Audio"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Upload Audio */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg rounded-3xl bg-[#0c1222] border border-amber-500/30 p-6 md:p-8 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                            <h3 className="text-lg font-display font-bold text-slate-100 flex items-center gap-2">
                                <Music className="w-5 h-5 text-amber-400" />
                                <span>Upload File Backsound</span>
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Judul / Nama Track *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="misal: Grand Orchestral Fanfare"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                    required
                                />
                                {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                        Konteks Pemutaran *
                                    </label>
                                    <select
                                        value={data.context}
                                        onChange={(e) => setData('context', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                        required
                                    >
                                        <option value="general">Umum / Intro</option>
                                        <option value="nominee_display">Slide Nominasi</option>
                                        <option value="suspense">Detik-Detik Pemenang (Suspense / "And The Winner Is...")</option>
                                        <option value="winner_reveal">Reveal Pemenang (Fanfare)</option>
                                        <option value="background_loop">Ambient Loop</option>
                                    </select>
                                    {errors.context && <p className="text-xs text-rose-400 mt-1">{errors.context}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                        Kategori Spesifik (Opsional)
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                    >
                                        <option value="">Semua Kategori (Global)</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-xs text-rose-400 mt-1">{errors.category_id}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    File Audio (MP3 / WAV / OGG) *
                                </label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => setData('audio', e.target.files[0])}
                                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-300 hover:file:bg-slate-700 cursor-pointer"
                                    required
                                />
                                {errors.audio && <p className="text-xs text-rose-400 mt-1">{errors.audio}</p>}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-glow hover:from-amber-400 hover:to-amber-500 disabled:opacity-50"
                                >
                                    {processing ? 'Mengunggah...' : 'Upload & Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
