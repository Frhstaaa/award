<?php

namespace App\Repositories\Contracts;

use App\Models\Backsound;
use Illuminate\Database\Eloquent\Collection;

interface BacksoundRepositoryInterface
{
    public function all(): Collection;
    public function getActive(): Collection;
    public function getByContext(string $context, ?int $categoryId = null): Collection;
    public function findById(int $id): ?Backsound;
    public function create(array $data): Backsound;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
