<?php

namespace App\Repositories\Eloquent;

use App\Models\Backsound;
use App\Repositories\Contracts\BacksoundRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class BacksoundRepository implements BacksoundRepositoryInterface
{
    public function all(): Collection
    {
        return Backsound::with('category')->latest()->get();
    }

    public function getActive(): Collection
    {
        return Backsound::where('is_active', true)->with('category')->get();
    }

    public function getByContext(string $context, ?int $categoryId = null): Collection
    {
        $query = Backsound::where('is_active', true)->where('context', $context);

        if ($categoryId) {
            $query->where(function ($q) use ($categoryId) {
                $q->where('category_id', $categoryId)->orWhereNull('category_id');
            });
        }

        return $query->get();
    }

    public function findById(int $id): ?Backsound
    {
        return Backsound::with('category')->find($id);
    }

    public function create(array $data): Backsound
    {
        return Backsound::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $backsound = Backsound::find($id);
        return $backsound ? $backsound->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $backsound = Backsound::find($id);
        return $backsound ? $backsound->delete() : false;
    }
}
