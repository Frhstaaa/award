import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Users, Plus, Edit2, Trash2, X, User, Briefcase, Building } from 'lucide-react';

export default function EmployeesIndex({ employees = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        position: '',
        department: '',
        photo: null,
    });

    const openCreateModal = () => {
        setEditingEmployee(null);
        reset();
        clearErrors();
        setData({
            name: '',
            position: '',
            department: '',
            photo: null,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (employee) => {
        setEditingEmployee(employee);
        clearErrors();
        setData({
            name: employee.name,
            position: employee.position,
            department: employee.department,
            photo: null,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingEmployee(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingEmployee) {
            router.post(route('admin.employees.update', editingEmployee.id), {
                _method: 'PUT',
                ...data,
            }, {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.employees.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id, name) => {
        if (confirm(`Hapus data karyawan "${name}"? Nominasi terkait juga akan terhapus.`)) {
            router.delete(route('admin.employees.destroy', id));
        }
    };

    const filteredEmployees = employees.filter(emp => 
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.position.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout title="Master Data Karyawan">
            <Head title="Data Karyawan - Admin" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-display font-bold text-slate-900 dark:text-slate-100">
                        Daftar Master Karyawan
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                        Kelola data karyawan yang akan dijadikan nominasi award
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Cari karyawan / jabatan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:placeholder-slate-500 shadow-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    />

                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-glow hover:from-amber-400 hover:to-amber-500 transition-all whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Karyawan</span>
                    </button>
                </div>
            </div>

            {/* Employees Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredEmployees.length === 0 ? (
                    <div className="col-span-full py-16 text-center text-slate-500 bg-white border border-slate-200 dark:bg-[#0a0f1d] rounded-2xl dark:border-slate-800">
                        Tidak ada data karyawan yang cocok.
                    </div>
                ) : (
                    filteredEmployees.map((emp) => (
                        <div
                            key={emp.id}
                            className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400/60 shadow-sm dark:bg-[#0a0f1d] dark:border-amber-500/15 dark:hover:border-amber-500/30 dark:shadow-lg transition-all flex items-start gap-4 group"
                        >
                            {/* Photo */}
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-amber-500/30 dark:bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                                {emp.photo_url ? (
                                    <img 
                                        src={emp.photo_url} 
                                        alt={emp.name} 
                                        className="w-full h-full object-cover object-top" 
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-100 truncate text-sm">
                                    {emp.name}
                                </h4>
                                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 mt-1 truncate">
                                    <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="truncate">{emp.position}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                                    <Building className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="truncate">{emp.department}</span>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                                        {emp.nominees_count || 0} Nominasi
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => openEditModal(emp)}
                                            className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:text-slate-400 dark:hover:text-amber-300 dark:hover:bg-amber-500/10 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(emp.id, emp.name)}
                                            className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Create / Edit Employee */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg rounded-3xl bg-white border border-amber-500/30 dark:bg-[#0c1222] p-6 md:p-8 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                <Users className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                                <span>{editingEmployee ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}</span>
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Nama Lengkap Karyawan *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="misal: Budi Santoso, S.Kom."
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                    required
                                />
                                {errors.name && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Jabatan / Posisi *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.position}
                                        onChange={(e) => setData('position', e.target.value)}
                                        placeholder="misal: Software Engineer"
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                        required
                                    />
                                    {errors.position && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.position}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                        Departemen / Divisi *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.department}
                                        onChange={(e) => setData('department', e.target.value)}
                                        placeholder="misal: Technology"
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                        required
                                    />
                                    {errors.department && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.department}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                    Foto Profil Karyawan (Opsional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('photo', e.target.files[0])}
                                    className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-amber-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-amber-300 dark:hover:file:bg-slate-700 cursor-pointer"
                                />
                                {errors.photo && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1">{errors.photo}</p>}
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
                                    {processing ? 'Menyimpan...' : 'Simpan Karyawan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
