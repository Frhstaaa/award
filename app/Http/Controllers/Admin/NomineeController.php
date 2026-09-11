<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreNomineeRequest;
use App\Services\CategoryService;
use App\Services\EmployeeService;
use App\Services\NomineeService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NomineeController extends Controller
{
    public function __construct(
        protected NomineeService $nomineeService,
        protected CategoryService $categoryService,
        protected EmployeeService $employeeService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Nominees/Index', [
            'nominees' => $this->nomineeService->getAll(),
            'categories' => $this->categoryService->getAll(),
            'employees' => $this->employeeService->getAll(),
        ]);
    }

    public function store(StoreNomineeRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if (!empty($validated['employee_ids'])) {
            $count = $this->nomineeService->createBatch(
                (int) $validated['category_id'],
                $validated['employee_ids'],
                $validated['description'] ?? null
            );

            if ($count === 0) {
                return redirect()->route('admin.nominees.index')
                    ->with('warning', 'Semua karyawan yang dipilih sudah terdaftar di kategori ini.');
            }

            return redirect()->route('admin.nominees.index')
                ->with('success', "Berhasil mendaftarkan {$count} karyawan ke dalam nominasi.");
        }

        $this->nomineeService->create($validated);

        return redirect()->route('admin.nominees.index')->with('success', 'Karyawan berhasil didaftarkan sebagai nominasi.');
    }

    public function update(StoreNomineeRequest $request, int $id): RedirectResponse
    {
        $this->nomineeService->update($id, $request->validated());

        return redirect()->route('admin.nominees.index')->with('success', 'Data nominasi berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->nomineeService->delete($id);

        return redirect()->route('admin.nominees.index')->with('success', 'Nominasi berhasil dihapus.');
    }
}
