<?php

namespace App\Repositories\Eloquent;

use App\Models\Employee;
use App\Repositories\Contracts\EmployeeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EmployeeRepository implements EmployeeRepositoryInterface
{
    public function all(): Collection
    {
        return Employee::withCount('nominees')->orderBy('name', 'asc')->get();
    }

    public function findById(int $id): ?Employee
    {
        return Employee::with('nominees.category')->find($id);
    }

    public function create(array $data): Employee
    {
        return Employee::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $employee = Employee::find($id);
        return $employee ? $employee->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $employee = Employee::find($id);
        return $employee ? $employee->delete() : false;
    }
}
