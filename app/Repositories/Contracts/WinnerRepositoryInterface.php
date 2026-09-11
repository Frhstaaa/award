<?php

namespace App\Repositories\Contracts;

use App\Models\Winner;
use Illuminate\Database\Eloquent\Collection;

interface WinnerRepositoryInterface
{
    public function all(): Collection;
    public function findByCategoryId(int $categoryId): ?Winner;
    public function setWinner(int $categoryId, int $nomineeId, ?string $announcedAt = null): Winner;
    public function removeWinner(int $categoryId): bool;
}
