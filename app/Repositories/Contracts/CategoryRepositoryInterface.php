<?php

namespace App\Repositories\Contracts;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface
{
    public function all(): Collection;
    public function getActiveWithRelations(): Collection;
    public function findById(int $id): ?Category;
    public function findBySlug(string $slug): ?Category;
    public function create(array $data): Category;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
