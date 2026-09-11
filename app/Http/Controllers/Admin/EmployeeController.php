<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Services\EmployeeService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function __construct(
        protected EmployeeService $employeeService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Employees/Index', [
            'employees' => $this->employeeService->getAll(),
        ]);
    }

    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $this->employeeService->create(
            $request->validated(),
            $request->file('photo')
        );

        return redirect()->route('admin.employees.index')->with('success', 'Data karyawan berhasil ditambahkan.');
    }

    public function update(UpdateEmployeeRequest $request, int $id): RedirectResponse
    {
        $this->employeeService->update(
            $id,
            $request->validated(),
            $request->file('photo')
        );

        return redirect()->route('admin.employees.index')->with('success', 'Data karyawan berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->employeeService->delete($id);

        return redirect()->route('admin.employees.index')->with('success', 'Data karyawan berhasil dihapus.');
    }
}
