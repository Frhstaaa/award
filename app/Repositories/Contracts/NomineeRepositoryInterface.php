<?php

namespace App\Repositories\Contracts;

use App\Models\Nominee;
use Illuminate\Database\Eloquent\Collection;

interface NomineeRepositoryInterface
{
    public function all(): Collection;
    public function getByCategory(int $categoryId): Collection;
    public function findById(int $id): ?Nominee;
    public function create(array $data): Nominee;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function exists(int $categoryId, int $employeeId): bool;
}
