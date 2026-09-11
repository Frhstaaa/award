import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Trophy, Award, CheckCircle2, RotateCcw, Star, User, ChevronRight, X } from 'lucide-react';

export default function WinnersIndex({ categories = [], winners = [] }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        category_id: '',
        nominee_id: '',
    });

    const openSetWinnerModal = (category) => {
        setSelectedCategory(category);
        clearErrors();
        const nominees = category.nominees || [];
        setData({
            category_id: category.id,
            nominee_id: nominees.length > 0 ? nominees[0].id : '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.winners.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const handleResetWinner = (categoryId, categoryName) => {
        if (confirm(`Reset status pemenang untuk kategori "${categoryName}"? Kategori akan kembali belum memiliki pemenang.`)) {
            router.delete(route('admin.winners.destroy', categoryId));
        }
    };

    return (
        <AdminLayout title="Penetapan Pemenang Award">
            <Head title="Penetapan Pemenang - Admin" />

            <div className="mb-6">
                <h3 className="text-xl font-display font-bold text-slate-100">
                    Penetapan Juara & Pemenang
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                    Tentukan 1 pemenang resmi per kategori untuk diungkap dalam animasi tirai showcase
                </p>
            </div>

            {/* Categories & Winner Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => {
                    const winner = category.winner;
                    const winnerNominee = winner?.nominee;
                    const winnerEmp = winnerNominee?.employee;
                    const nominees = category.nominees || [];

                    return (
                        <div
                            key={category.id}
                            className={`p-6 rounded-3xl border transition-all shadow-xl ${
                                winner
                                    ? 'bg-gradient-to-br from-[#0c1429] via-[#091024] to-[#121a36] border-amber-500/40 shadow-gold-glow/20'
                                    : 'bg-[#0a0f1d] border-slate-800'
                            }`}
                        >
                            {/* Category Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold font-mono">
                                        #{category.order}
                                    </div>
                                    <div>
                                        <h4 className="font-display font-bold text-slate-100 text-base">
                                            {category.name}
                                        </h4>
                                        <p className="text-[11px] text-slate-400 font-mono">
                                            {nominees.length} Kandidat Terdaftar
                                        </p>
                                    </div>
                                </div>

                                {winner ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold font-display uppercase tracking-wider">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        Pemenang Siap
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-medium">
                                        Pending
                                    </span>
                                )}
                            </div>

                            {/* Winner Details or Empty State */}
                            {winner && winnerEmp ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-amber-500/25">
                                        <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-gold-glow flex-shrink-0">
                                            <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-900">
                                                {winnerEmp.photo_url ? (
                                                    <img src={winnerEmp.photo_url} alt="" className="w-full h-full object-cover object-top" />
                                                ) : (
                                                    <User className="w-8 h-8 text-slate-600 m-auto" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="text-[10px] text-amber-400 uppercase font-mono tracking-widest">
                                                Pemenang Terpilih
                                            </div>
                                            <h5 className="font-display font-bold text-slate-100 text-base gold-shimmer truncate">
                                                {winnerEmp.name}
                                            </h5>
                                            <p className="text-xs text-slate-300 truncate">
                                                {winnerEmp.position} • {winnerEmp.department}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <button
                                            onClick={() => openSetWinnerModal(category)}
                                            className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
                                        >
                                            Ubah Pemenang
                                        </button>

                                        <button
                                            onClick={() => handleResetWinner(category.id, category.name)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            <span>Reset Pemenang</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-60" />
                                    <p className="text-xs text-slate-400 mb-4">
                                        {nominees.length > 0
                                            ? 'Pilih satu nominee sebagai pemenang untuk kategori ini.'
                                            : 'Kategori ini belum memiliki kandidat nominee.'}
                                    </p>

                                    {nominees.length > 0 ? (
                                        <button
                                            onClick={() => openSetWinnerModal(category)}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs uppercase tracking-wider shadow-gold-glow hover:from-amber-400 hover:to-amber-500 transition-all"
                                        >
                                            <Trophy className="w-3.5 h-3.5" />
                                            <span>Tetapkan Pemenang</span>
                                        </button>
                                    ) : (
                                        <span className="text-xs text-amber-400/80">
                                            Assign nominee terlebih dahulu di menu Nominasi
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal Set Winner */}
            {isModalOpen && selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg rounded-3xl bg-[#0c1222] border border-amber-500/30 p-6 md:p-8 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
                            <h3 className="text-lg font-display font-bold text-slate-100 flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-400" />
                                <span>Pilih Pemenang: {selectedCategory.name}</span>
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                    Pilih Salah Satu Nominee Sebagai Pemenang *
                                </label>
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                    {(selectedCategory.nominees || []).map((nom) => {
                                        const emp = nom.employee || {};
                                        const isSelected = String(data.nominee_id) === String(nom.id);

                                        return (
                                            <label
                                                key={nom.id}
                                                className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'bg-amber-500/20 border-amber-400/60 shadow-gold-glow/20'
                                                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="nominee_selection"
                                                    value={nom.id}
                                                    checked={isSelected}
                                                    onChange={() => setData('nominee_id', nom.id)}
                                                    className="w-4 h-4 text-amber-500 border-slate-700 focus:ring-amber-400 bg-slate-900"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-slate-100 text-sm truncate">
                                                        {emp.name}
                                                    </div>
                                                    <div className="text-xs text-slate-400 truncate">
                                                        {emp.position} • {emp.department}
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                                {errors.nominee_id && <p className="text-xs text-rose-400 mt-2">{errors.nominee_id}</p>}
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
                                    disabled={processing || !data.nominee_id}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-glow hover:from-amber-400 hover:to-amber-500 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Konfirmasi Pemenang'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
