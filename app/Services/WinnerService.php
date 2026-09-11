<?php

namespace App\Services;

use App\Models\Winner;
use App\Repositories\Contracts\NomineeRepositoryInterface;
use App\Repositories\Contracts\WinnerRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class WinnerService
{
    public function __construct(
        protected WinnerRepositoryInterface $winnerRepository,
        protected NomineeRepositoryInterface $nomineeRepository
    ) {}

    public function getAll(): Collection
    {
        return $this->winnerRepository->all();
    }

    public function getByCategoryId(int $categoryId): ?Winner
    {
        return $this->winnerRepository->findByCategoryId($categoryId);
    }

    public function setWinner(int $categoryId, int $nomineeId): Winner
    {
        $nominee = $this->nomineeRepository->findById($nomineeId);
        if (!$nominee || $nominee->category_id !== $categoryId) {
            throw ValidationException::withMessages([
                'nominee_id' => 'Nominee tidak valid atau tidak termasuk dalam kategori ini.'
            ]);
        }

        return $this->winnerRepository->setWinner($categoryId, $nomineeId, now()->toDateTimeString());
    }

    public function removeWinner(int $categoryId): bool
    {
        return $this->winnerRepository->removeWinner($categoryId);
    }
}
