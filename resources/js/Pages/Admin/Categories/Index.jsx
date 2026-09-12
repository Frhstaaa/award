import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Award, Plus, Edit2, Trash2, X, Check, Upload, Sparkles } from 'lucide-react';

export default function CategoriesIndex({ categories = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        order: 0,
        is_active: true,
        icon: null,
    });

    const openCreateModal = () => {
        setEditingCategory(null);
        reset();
        clearErrors();
        setData({
            name: '',
            description: '',
            order: categories.length + 1,
            is_active: true,
            icon: null,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        clearErrors();
        setData({
            name: category.name,
            description: category.description || '',
            order: category.order,
            is_active: Boolean(category.is_active),
            icon: null,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingCategory) {
            // Laravel handles PUT with file upload via POST + _method: 'PUT'
            router.post(route('admin.categories.update', editingCategory.id), {
                _method: 'PUT',
                ...data,
            }, {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id, name) => {
        if (confirm(`Hapus kategori "${name}"? Seluruh data nominasi pada kategori ini juga akan terhapus.`)) {
            router.delete(route('admin.categories.destroy', id));
        }
    };

    return (
        <AdminLayout title="Manajemen Kategori Award">
            <Head title="Kategori Award - Admin" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-display font-bold text-slate-900 dark:text-slate-100">
                        Daftar Kategori Penghargaan
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        Kelola kategori award yang akan ditampilkan dalam showcase
                    </p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-glow hover:from-amber-400 hover:to-amber-500 transition-all self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Kategori</span>
                </button>
            </div>

            {/* Categories Table / List */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm dark:bg-[#0a0f1d] dark:border-amber-500/15 dark:shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                        <thead className="bg-slate-50 text-xs font-semibold text-amber-600 uppercase tracking-wider border-b border-slate-200 dark:bg-[#0f1629] dark:text-amber-400/90 dark:border-amber-500/10">
                            <tr>
                                <th className="px-6 py-4 w-16">Urutan</th>
                                <th className="px-6 py-4">Kategori & Ikon</th>
                                <th className="px-6 py-4">Deskripsi</th>
                                <th className="px-6 py-4 text-center">Nominee</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-slate-400 dark:text-slate-500">
                                        Belum ada kategori. Klik "Tambah Kategori" untuk membuat.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-amber-50/50 dark:hover:bg-slate-900/40 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-amber-600 dark:text-amber-300">
                                            #{category.order}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800/90 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {category.icon_url ? (
                                                        <img src={category.icon_url} alt="" className="w-7 h-7 object-contain" />
                                                    ) : (
                                                        <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800 dark:text-slate-100">
                                                        {category.name}
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-mono">
                                                        {category.slug}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate text-xs text-slate-600 dark:text-slate-400">
                                            {category.description || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 text-xs font-mono">
                                                {category.nominees_count || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {category.is_active ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                                    Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 text-xs font-medium dark:border-slate-700">
                                                    Nonaktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:text-slate-400 dark:hover:text-amber-300 dark:hover:bg-amber-500/10 transition-colors"
                                                title="Edit Kategori"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id, category.name)}
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                                                title="Hapus Kategori"
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

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg rounded-3xl bg-white border border-amber-500/30 dark:bg-[#0c1222] p-6 md:p-8 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                                <span>{editingCategory ? 'Edit Kategori Award' : 'Tambah Kategori Award'}</span>
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Nama Kategori Award *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="misal: Best Innovator of the Year"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                    required
                                />
                                {errors.name && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Deskripsi Penghargaan
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="3"
                                    placeholder="Keterangan singkat kriteria atau makna penghargaan ini..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                />
                                {errors.description && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Urutan Tampil *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.order}
                                        onChange={(e) => setData('order', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
                                        required
                                    />
                                    {errors.order && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.order}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Status
                                    </label>
                                    <label className="flex items-center gap-2 mt-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-100 dark:bg-slate-900"
                                        />
                                        <span className="text-xs text-slate-700 dark:text-slate-300">Aktifkan Kategori</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Ikon / Logo Kategori (Opsional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('icon', e.target.files[0])}
                                    className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-amber-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-amber-300 dark:hover:file:bg-slate-700 cursor-pointer"
                                />
                                {errors.icon && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.icon}</p>}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-glow hover:from-amber-400 hover:to-amber-500 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Kategori'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
