<?php

namespace App\Repositories\Eloquent;

use App\Models\Nominee;
use App\Repositories\Contracts\NomineeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class NomineeRepository implements NomineeRepositoryInterface
{
    public function all(): Collection
    {
        return Nominee::with(['category', 'employee', 'winner'])
            ->orderBy('category_id')
            ->orderBy('order')
            ->get();
    }

    public function getByCategory(int $categoryId): Collection
    {
        return Nominee::where('category_id', $categoryId)
            ->with(['employee', 'winner'])
            ->orderBy('order', 'asc')
            ->get();
    }

    public function findById(int $id): ?Nominee
    {
        return Nominee::with(['category', 'employee', 'winner'])->find($id);
    }

    public function create(array $data): Nominee
    {
        return Nominee::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $nominee = Nominee::find($id);
        return $nominee ? $nominee->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $nominee = Nominee::find($id);
        return $nominee ? $nominee->delete() : false;
    }

    public function exists(int $categoryId, int $employeeId): bool
    {
        return Nominee::where('category_id', $categoryId)
            ->where('employee_id', $employeeId)
            ->exists();
    }
}
