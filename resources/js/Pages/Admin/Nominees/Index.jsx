import React, { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    UserCheck, 
    Plus, 
    Trash2, 
    X, 
    Award, 
    User, 
    Briefcase, 
    Building, 
    Star, 
    Search, 
    Filter, 
    Check, 
    Edit2, 
    Users, 
    CheckSquare, 
    Square, 
    Sparkles, 
    AlertCircle 
} from 'lucide-react';

export default function NomineesIndex({ nominees = [], categories = [], employees = [] }) {
    // Modal states
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingNominee, setEditingNominee] = useState(null);

    // Filters for table
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
    const [tableSearchQuery, setTableSearchQuery] = useState('');

    // Filters for Employee multi-selector in modal
    const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
    const [employeeDeptFilter, setEmployeeDeptFilter] = useState('all');

    // Batch Assign Form
    const { 
        data: assignData, 
        setData: setAssignData, 
        post: postAssign, 
        processing: assignProcessing, 
        errors: assignErrors, 
        reset: resetAssign, 
        clearErrors: clearAssignErrors 
    } = useForm({
        category_id: categories.length > 0 ? categories[0].id : '',
        employee_ids: [],
        description: '',
    });

    // Edit Single Nominee Form
    const { 
        data: editData, 
        setData: setEditData, 
        put: putEdit, 
        processing: editProcessing, 
        errors: editErrors, 
        reset: resetEdit, 
        clearErrors: clearEditErrors 
    } = useForm({
        category_id: '',
        employee_id: '',
        description: '',
        order: 1,
    });

    // All unique departments from employees
    const departments = useMemo(() => {
        const set = new Set();
        employees.forEach(emp => {
            if (emp.department) set.add(emp.department);
        });
        return Array.from(set).sort();
    }, [employees]);

    // Already nominated employees in the currently selected category in modal
    const alreadyNominatedInSelectedCategory = useMemo(() => {
        const catId = String(assignData.category_id);
        const map = new Map();
        nominees.forEach(n => {
            if (String(n.category_id) === catId) {
                map.set(Number(n.employee_id), n);
            }
        });
        return map;
    }, [assignData.category_id, nominees]);

    // Count nominations per employee across all categories
    const employeeTotalNominationsMap = useMemo(() => {
        const map = new Map();
        nominees.forEach(n => {
            const count = map.get(Number(n.employee_id)) || 0;
            map.set(Number(n.employee_id), count + 1);
        });
        return map;
    }, [nominees]);

    // Filtered employees list for the modal multi-select picker
    const modalFilteredEmployees = useMemo(() => {
        const q = employeeSearchQuery.toLowerCase().trim();
        return employees.filter(emp => {
            // Department filter
            if (employeeDeptFilter !== 'all' && emp.department !== employeeDeptFilter) {
                return false;
            }
            // Search query
            if (!q) return true;
            const nameMatch = emp.name?.toLowerCase().includes(q);
            const posMatch = emp.position?.toLowerCase().includes(q);
            const deptMatch = emp.department?.toLowerCase().includes(q);
            return nameMatch || posMatch || deptMatch;
        });
    }, [employees, employeeSearchQuery, employeeDeptFilter]);

    // Visible employees that are eligible (not yet nominated in the selected category)
    const visibleEligibleEmployees = useMemo(() => {
        return modalFilteredEmployees.filter(emp => !alreadyNominatedInSelectedCategory.has(emp.id));
    }, [modalFilteredEmployees, alreadyNominatedInSelectedCategory]);

    // Open Assign Modal
    const openAssignModal = () => {
        resetAssign();
        clearAssignErrors();
        setEmployeeSearchQuery('');
        setEmployeeDeptFilter('all');
        setAssignData({
            category_id: categories.length > 0 ? categories[0].id : '',
            employee_ids: [],
            description: '',
        });
        setIsAssignModalOpen(true);
    };

    const closeAssignModal = () => {
        setIsAssignModalOpen(false);
        resetAssign();
    };

    // Toggle single employee selection
    const toggleEmployeeSelection = (employeeId) => {
        if (alreadyNominatedInSelectedCategory.has(employeeId)) return;

        setAssignData(prev => {
            const currentIds = prev.employee_ids || [];
            if (currentIds.includes(employeeId)) {
                return { ...prev, employee_ids: currentIds.filter(id => id !== employeeId) };
            } else {
                return { ...prev, employee_ids: [...currentIds, employeeId] };
            }
        });
    };

    // Select all visible & eligible employees
    const handleSelectAllVisible = () => {
        const visibleIds = visibleEligibleEmployees.map(e => e.id);
        setAssignData(prev => {
            const set = new Set([...(prev.employee_ids || []), ...visibleIds]);
            return { ...prev, employee_ids: Array.from(set) };
        });
    };

    // Clear all selections
    const handleClearAllSelected = () => {
        setAssignData(prev => ({ ...prev, employee_ids: [] }));
    };

    // Remove single employee chip
    const handleRemoveSelectedChip = (idToRemove) => {
        setAssignData(prev => ({
            ...prev,
            employee_ids: (prev.employee_ids || []).filter(id => id !== idToRemove)
        }));
    };

    // Submit Assign Form
    const handleAssignSubmit = (e) => {
        e.preventDefault();
        if (assignData.employee_ids.length === 0) return;

        postAssign(route('admin.nominees.store'), {
            onSuccess: () => closeAssignModal(),
        });
    };

    // Open Edit Modal
    const openEditModal = (nominee) => {
        clearEditErrors();
        setEditingNominee(nominee);
        setEditData({
            category_id: nominee.category_id,
            employee_id: nominee.employee_id,
            description: nominee.description || '',
            order: nominee.order || 1,
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingNominee(null);
        resetEdit();
    };

    // Submit Edit Form
    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingNominee) return;

        putEdit(route('admin.nominees.update', editingNominee.id), {
            onSuccess: () => closeEditModal(),
        });
    };

    // Delete single nominee
    const handleDelete = (id, nomineeName, categoryName) => {
        if (confirm(`Hapus ${nomineeName} dari nominasi kategori ${categoryName}?`)) {
            router.delete(route('admin.nominees.destroy', id));
        }
    };

    // Filter table rows
    const filteredNominees = useMemo(() => {
        const q = tableSearchQuery.toLowerCase().trim();
        return nominees.filter(n => {
            // Category filter
            if (selectedCategoryFilter !== 'all' && String(n.category_id) !== String(selectedCategoryFilter)) {
                return false;
            }
            // Search query
            if (!q) return true;
            const empName = n.employee?.name?.toLowerCase() || '';
            const empPos = n.employee?.position?.toLowerCase() || '';
            const empDept = n.employee?.department?.toLowerCase() || '';
            const catName = n.category?.name?.toLowerCase() || '';
            const desc = n.description?.toLowerCase() || '';
            return empName.includes(q) || empPos.includes(q) || empDept.includes(q) || catName.includes(q) || desc.includes(q);
        });
    }, [nominees, selectedCategoryFilter, tableSearchQuery]);

    // Statistics
    const totalNominations = nominees.length;
    const uniqueNominatedEmployeesCount = new Set(nominees.map(n => n.employee_id)).size;
    const categoriesWithNomineesCount = new Set(nominees.map(n => n.category_id)).size;
    const winnersCount = nominees.filter(n => n.winner).length;

    return (
        <AdminLayout title="Manajemen Nominasi Award">
            <Head title="Nominasi Award - Admin" />

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-amber-500/15 flex items-center gap-3.5 shadow-lg">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xl font-bold font-display text-slate-100">{totalNominations}</div>
                        <div className="text-[11px] text-slate-400">Total Nominasi Dibuat</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-amber-500/15 flex items-center gap-3.5 shadow-lg">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                        <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xl font-bold font-display text-slate-100">{uniqueNominatedEmployeesCount}</div>
                        <div className="text-[11px] text-slate-400">Karyawan Ternominasi</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-amber-500/15 flex items-center gap-3.5 shadow-lg">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400">
                        <Award className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-xl font-bold font-display text-slate-100">{categoriesWithNomineesCount} / {categories.length}</div>
                        <div className="text-[11px] text-slate-400">Kategori Terisi</div>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-amber-500/15 flex items-center gap-3.5 shadow-lg">
                    <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-300">
                        <Star className="w-5 h-5 fill-amber-300" />
                    </div>
                    <div>
                        <div className="text-xl font-bold font-display text-slate-100">{winnersCount}</div>
                        <div className="text-[11px] text-slate-400">Pemenang Ditetapkan</div>
                    </div>
                </div>
            </div>

            {/* Header & Main Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
                        <span>Daftar Nominasi Karyawan</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25 text-xs font-mono font-medium">
                            {filteredNominees.length}
                        </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Menugaskan karyawan ke dalam kategori penghargaan (mendukung multi-select beberapa karyawan sekaligus)
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            value={tableSearchQuery}
                            onChange={(e) => setTableSearchQuery(e.target.value)}
                            placeholder="Cari nominee, kategori..."
                            className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 w-44 sm:w-56"
                        />
                    </div>

                    {/* Category Filter Dropdown */}
                    <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    >
                        <option value="all">Semua Kategori ({categories.length})</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Button Open Multi-Select Modal */}
                    <button
                        onClick={openAssignModal}
                        disabled={categories.length === 0 || employees.length === 0}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-glow hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 transition-all whitespace-nowrap active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        <span>+ Assign Nominee</span>
                    </button>
                </div>
            </div>

            {/* Nominees Table */}
            <div className="rounded-2xl bg-[#0a0f1d] border border-amber-500/15 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-[#0f1629] text-xs font-semibold text-amber-400/90 uppercase tracking-wider border-b border-amber-500/10">
                            <tr>
                                <th className="px-6 py-4">Nominee / Karyawan</th>
                                <th className="px-6 py-4">Kategori Award</th>
                                <th className="px-6 py-4">Alasan / Achievement</th>
                                <th className="px-6 py-4 text-center">Urutan Tampil</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                            {filteredNominees.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-14 text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Users className="w-8 h-8 text-slate-600" />
                                            <p className="text-sm">Tidak ada data nominasi yang sesuai.</p>
                                            <button
                                                onClick={openAssignModal}
                                                className="mt-1 text-xs text-amber-400 hover:text-amber-300 underline"
                                            >
                                                Klik di sini untuk menugaskan karyawan ke nominasi
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredNominees.map((nominee) => {
                                    const emp = nominee.employee || {};
                                    const cat = nominee.category || {};
                                    const isWinner = Boolean(nominee.winner);
                                    const totalOtherNom = (employeeTotalNominationsMap.get(emp.id) || 1) - 1;

                                    return (
                                        <tr key={nominee.id} className="hover:bg-slate-900/40 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                                                        {emp.photo_url ? (
                                                            <img src={emp.photo_url} alt="" className="w-full h-full object-cover object-top" />
                                                        ) : (
                                                            <User className="w-5 h-5 text-slate-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-100 flex items-center gap-2">
                                                            <span>{emp.name}</span>
                                                            {totalOtherNom > 0 && (
                                                                <span 
                                                                    title={`Karyawan ini juga dinominasikan pada ${totalOtherNom} kategori lainnya`}
                                                                    className="px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-mono"
                                                                >
                                                                    +{totalOtherNom} Kategori Lain
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <span>{emp.position}</span>
                                                            <span>•</span>
                                                            <span>{emp.department}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                                                    <Award className="w-3.5 h-3.5 text-amber-400" />
                                                    <span>{cat.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-sm">
                                                {nominee.description ? (
                                                    <span className="text-xs text-slate-300 italic line-clamp-2" title={nominee.description}>
                                                        "{nominee.description}"
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-600 italic">- Tidak ada deskripsi -</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center font-mono font-bold text-amber-300 text-xs">
                                                #{nominee.order}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {isWinner ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        Pemenang
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs border border-slate-700">
                                                        Kandidat
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => openEditModal(nominee)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                                                        title="Edit Catatan / Urutan"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(nominee.id, emp.name, cat.name)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                                        title="Hapus Nominasi"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* MODAL 1: BATCH ASSIGN MULTI-SELECT EMPLOYEES                              */}
            {/* ========================================================================= */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                    <div className="relative w-full max-w-3xl rounded-3xl bg-[#0c1222] border border-amber-500/30 p-5 sm:p-7 shadow-2xl my-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                            <div>
                                <h3 className="text-lg font-display font-bold text-slate-100 flex items-center gap-2">
                                    <UserCheck className="w-5 h-5 text-amber-400" />
                                    <span>Assign Karyawan ke Nominasi Award</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Pilih kategori penghargaan, lalu centang beberapa karyawan sekaligus untuk didaftarkan dalam 1 kali simpan.
                                </p>
                            </div>
                            <button 
                                onClick={closeAssignModal} 
                                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAssignSubmit} className="space-y-4">
                            {/* Step 1: Select Category */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    1. Pilih Kategori Penghargaan *
                                </label>
                                <select
                                    value={assignData.category_id}
                                    onChange={(e) => {
                                        const newCatId = e.target.value;
                                        setAssignData(prev => ({
                                            ...prev,
                                            category_id: newCatId,
                                            // Keep only employee IDs that are not already nominated in the newly selected category
                                            employee_ids: prev.employee_ids.filter(empId => {
                                                const isAlreadyInNew = nominees.some(
                                                    n => String(n.category_id) === String(newCatId) && Number(n.employee_id) === Number(empId)
                                                );
                                                return !isAlreadyInNew;
                                            })
                                        }));
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-medium"
                                    required
                                >
                                    {categories.map((cat) => {
                                        const countInCat = nominees.filter(n => n.category_id === cat.id).length;
                                        return (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name} ({countInCat} Nominee terdaftar saat ini)
                                            </option>
                                        );
                                    })}
                                </select>
                                {assignErrors.category_id && <p className="text-xs text-rose-400 mt-1">{assignErrors.category_id}</p>}
                            </div>

                            {/* Step 2: Multi-Select Employee Section */}
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                                        <span>2. Pilih Karyawan (Bisa Lebih dari 1) *</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                                            assignData.employee_ids.length > 0 
                                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                                                : 'bg-slate-800 text-slate-400'
                                        }`}>
                                            {assignData.employee_ids.length} Karyawan Dipilih
                                        </span>
                                    </label>

                                    {/* Quick Selection Actions */}
                                    <div className="flex items-center gap-2 text-xs">
                                        <button
                                            type="button"
                                            onClick={handleSelectAllVisible}
                                            disabled={visibleEligibleEmployees.length === 0}
                                            className="text-amber-400 hover:text-amber-300 disabled:text-slate-600 disabled:no-underline underline font-medium"
                                        >
                                            Pilih Semua ({visibleEligibleEmployees.length})
                                        </button>
                                        <span className="text-slate-600">•</span>
                                        <button
                                            type="button"
                                            onClick={handleClearAllSelected}
                                            disabled={assignData.employee_ids.length === 0}
                                            className="text-slate-400 hover:text-slate-300 disabled:text-slate-600 disabled:no-underline underline"
                                        >
                                            Kosongkan
                                        </button>
                                    </div>
                                </div>

                                {/* Filter & Search Toolbar inside Modal */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-2.5">
                                    {/* Search input */}
                                    <div className="relative flex-1">
                                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        <input
                                            type="text"
                                            value={employeeSearchQuery}
                                            onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                                            placeholder="Cari nama, jabatan, departemen karyawan..."
                                            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                        />
                                        {employeeSearchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => setEmployeeSearchQuery('')}
                                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    {/* Department quick filter */}
                                    <select
                                        value={employeeDeptFilter}
                                        onChange={(e) => setEmployeeDeptFilter(e.target.value)}
                                        className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                    >
                                        <option value="all">Semua Unit ({employees.length})</option>
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>
                                                {dept}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Selected Employees Chips Bar (Visual Confirmation) */}
                                {assignData.employee_ids.length > 0 && (
                                    <div className="mb-2.5 p-2 rounded-xl bg-amber-500/5 border border-amber-500/20 max-h-20 overflow-y-auto">
                                        <div className="text-[10px] uppercase font-bold text-amber-400/90 mb-1 flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            <span>Karyawan yang akan didaftarkan ({assignData.employee_ids.length}):</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {assignData.employee_ids.map(id => {
                                                const emp = employees.find(e => e.id === id);
                                                if (!emp) return null;
                                                return (
                                                    <span 
                                                        key={id}
                                                        className="inline-flex items-center gap-1 pl-2 pr-1.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-200 text-[11px] font-medium"
                                                    >
                                                        <span>{emp.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveSelectedChip(id)}
                                                            className="hover:text-rose-300 text-slate-400 p-0.5"
                                                            title="Hapus dari pilihan"
                                                        >
                                                            ✕
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Interactive Scrollable Employee Cards List */}
                                <div className="rounded-xl border border-slate-800 bg-[#090d19] max-h-64 sm:max-h-72 overflow-y-auto p-2 space-y-1.5 divide-y divide-slate-800/40">
                                    {modalFilteredEmployees.length === 0 ? (
                                        <div className="py-8 text-center text-xs text-slate-500">
                                            Tidak ditemukan karyawan yang sesuai dengan kata kunci "{employeeSearchQuery}".
                                        </div>
                                    ) : (
                                        modalFilteredEmployees.map((emp) => {
                                            const isAlreadyNominated = alreadyNominatedInSelectedCategory.has(emp.id);
                                            const isSelected = assignData.employee_ids.includes(emp.id);
                                            const totalOtherNominations = employeeTotalNominationsMap.get(emp.id) || 0;

                                            return (
                                                <div
                                                    key={emp.id}
                                                    onClick={() => !isAlreadyNominated && toggleEmployeeSelection(emp.id)}
                                                    className={`pt-1.5 first:pt-0 flex items-center justify-between gap-3 p-2 rounded-xl transition-all ${
                                                        isAlreadyNominated
                                                            ? 'opacity-50 cursor-not-allowed bg-slate-900/20'
                                                            : isSelected
                                                            ? 'bg-amber-500/15 border border-amber-500/40 shadow-sm cursor-pointer'
                                                            : 'hover:bg-slate-800/60 border border-transparent cursor-pointer'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        {/* Checkbox Icon */}
                                                        <div className="flex-shrink-0 text-amber-400">
                                                            {isAlreadyNominated ? (
                                                                <Check className="w-4 h-4 text-emerald-400" />
                                                            ) : isSelected ? (
                                                                <CheckSquare className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                                                            ) : (
                                                                <Square className="w-4 h-4 text-slate-600" />
                                                            )}
                                                        </div>

                                                        {/* Photo */}
                                                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                            {emp.photo_url ? (
                                                                <img src={emp.photo_url} alt="" className="w-full h-full object-cover object-top" />
                                                            ) : (
                                                                <User className="w-4 h-4 text-slate-500" />
                                                            )}
                                                        </div>

                                                        {/* Details */}
                                                        <div className="min-w-0">
                                                            <div className="text-xs font-semibold text-slate-100 truncate flex items-center gap-1.5">
                                                                <span className={isSelected ? 'text-amber-300 font-bold' : ''}>{emp.name}</span>
                                                                {totalOtherNominations > 0 && (
                                                                    <span className="text-[10px] text-slate-400 font-normal">
                                                                        ({totalOtherNominations} nominasi lain)
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-[11px] text-slate-400 truncate">
                                                                {emp.position} • <span className="text-slate-300">{emp.department}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Status Badge */}
                                                    <div className="flex-shrink-0">
                                                        {isAlreadyNominated ? (
                                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-medium">
                                                                ✓ Sudah Terdaftar
                                                            </span>
                                                        ) : isSelected ? (
                                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold uppercase tracking-wider">
                                                                Dipilih
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 group-hover:text-slate-200">
                                                                + Pilih
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <p className="text-[11px] text-amber-300/80 mt-1.5 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                    <span>Tip: 1 karyawan dapat masuk ke lebih dari 1 kategori penghargaan berbeda tanpa batasan.</span>
                                </p>
                                {assignErrors.employee_ids && (
                                    <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>{assignErrors.employee_ids}</span>
                                    </p>
                                )}
                            </div>

                            {/* Step 3: Optional Citation / Description */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    3. Alasan Nominasi / Catatan Prestasi (Opsional)
                                </label>
                                <textarea
                                    value={assignData.description}
                                    onChange={(e) => setAssignData('description', e.target.value)}
                                    rows="2"
                                    placeholder="Alasan atau prestasi yang membuat karyawan-karyawan ini dinominasikan (opsional, dapat disesuaikan per individu nanti)..."
                                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                />
                                {assignErrors.description && <p className="text-xs text-rose-400 mt-1">{assignErrors.description}</p>}
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                                <div className="text-xs text-slate-400 font-medium">
                                    {assignData.employee_ids.length > 0 ? (
                                        <span className="text-amber-300 font-semibold">
                                            Siap mendaftarkan {assignData.employee_ids.length} karyawan
                                        </span>
                                    ) : (
                                        <span className="text-slate-500">Pilih minimal 1 karyawan</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={closeAssignModal}
                                        className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={assignProcessing || assignData.employee_ids.length === 0}
                                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-glow hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        {assignProcessing 
                                            ? 'Menyimpan...' 
                                            : `Simpan & Daftarkan (${assignData.employee_ids.length} Karyawan)`}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MODAL 2: EDIT INDIVIDUAL NOMINEE                                          */}
            {/* ========================================================================= */}
            {isEditModalOpen && editingNominee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg rounded-3xl bg-[#0c1222] border border-amber-500/30 p-6 shadow-2xl">
                        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                            <div>
                                <h3 className="text-lg font-display font-bold text-slate-100 flex items-center gap-2">
                                    <Edit2 className="w-5 h-5 text-amber-400" />
                                    <span>Edit Data Nominasi</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Ubah catatan prestasi atau nomor urutan tampil dalam slide.
                                </p>
                            </div>
                            <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {/* Candidate Info Box */}
                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                    {editingNominee.employee?.photo_url ? (
                                        <img src={editingNominee.employee.photo_url} alt="" className="w-full h-full object-cover object-top" />
                                    ) : (
                                        <User className="w-5 h-5 text-slate-500" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-semibold text-slate-100 text-sm truncate">
                                        {editingNominee.employee?.name}
                                    </div>
                                    <div className="text-xs text-slate-400 truncate">
                                        {editingNominee.employee?.position} • {editingNominee.employee?.department}
                                    </div>
                                    <div className="text-xs text-amber-400/90 font-medium mt-0.5">
                                        Kategori: {editingNominee.category?.name}
                                    </div>
                                </div>
                            </div>

                            {/* Order */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Urutan Tampil dalam Slide *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={editData.order}
                                    onChange={(e) => setEditData('order', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono"
                                    required
                                />
                                {editErrors.order && <p className="text-xs text-rose-400 mt-1">{editErrors.order}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Alasan Nominasi / Kutipan Prestasi
                                </label>
                                <textarea
                                    value={editData.description}
                                    onChange={(e) => setEditData('description', e.target.value)}
                                    rows="3"
                                    placeholder="Prestasi atau pencapaian yang membuat karyawan ini dinominasikan..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                                />
                                {editErrors.description && <p className="text-xs text-rose-400 mt-1">{editErrors.description}</p>}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold text-xs tracking-wider uppercase shadow-gold-glow hover:from-amber-400 hover:to-amber-500 disabled:opacity-50"
                                >
                                    {editProcessing ? 'Menyimpan...' : 'Perbarui Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
