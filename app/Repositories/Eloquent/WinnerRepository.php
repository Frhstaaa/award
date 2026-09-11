<?php

namespace App\Repositories\Eloquent;

use App\Models\Winner;
use App\Repositories\Contracts\WinnerRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class WinnerRepository implements WinnerRepositoryInterface
{
    public function all(): Collection
    {
        return Winner::with(['category', 'nominee.employee'])->get();
    }

    public function findByCategoryId(int $categoryId): ?Winner
    {
        return Winner::with(['category', 'nominee.employee'])
            ->where('category_id', $categoryId)
            ->first();
    }

    public function setWinner(int $categoryId, int $nomineeId, ?string $announcedAt = null): Winner
    {
        return Winner::updateOrCreate(
            ['category_id' => $categoryId],
            [
                'nominee_id' => $nomineeId,
                'announced_at' => $announcedAt ?? now(),
            ]
        );
    }

    public function removeWinner(int $categoryId): bool
    {
        $winner = Winner::where('category_id', $categoryId)->first();
        return $winner ? $winner->delete() : false;
    }
}
