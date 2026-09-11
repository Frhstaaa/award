<?php

namespace App\Repositories\Eloquent;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository implements CategoryRepositoryInterface
{
    public function all(): Collection
    {
        return Category::withCount('nominees')
            ->with(['winner.nominee.employee'])
            ->orderBy('order', 'asc')
            ->get();
    }

    public function getActiveWithRelations(): Collection
    {
        return Category::where('is_active', true)
            ->with([
                'nominees.employee',
                'winner.nominee.employee',
                'backsounds' => function ($query) {
                    $query->where('is_active', true);
                }
            ])
            ->orderBy('order', 'asc')
            ->get();
    }

    public function findById(int $id): ?Category
    {
        return Category::with(['nominees.employee', 'winner.nominee.employee'])->find($id);
    }

    public function findBySlug(string $slug): ?Category
    {
        return Category::with(['nominees.employee', 'winner.nominee.employee'])->where('slug', $slug)->first();
    }

    public function create(array $data): Category
    {
        return Category::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $category = Category::find($id);
        return $category ? $category->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $category = Category::find($id);
        return $category ? $category->delete() : false;
    }
}
