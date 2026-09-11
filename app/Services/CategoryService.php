<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class CategoryService
{
    public function __construct(
        protected CategoryRepositoryInterface $categoryRepository,
        protected MediaUploadService $mediaUploadService
    ) {}

    public function getAll(): Collection
    {
        return $this->categoryRepository->all();
    }

    public function getActiveForShowcase(): Collection
    {
        return $this->categoryRepository->getActiveWithRelations();
    }

    public function getById(int $id): ?Category
    {
        return $this->categoryRepository->findById($id);
    }

    public function create(array $data, ?UploadedFile $icon = null): Category
    {
        $data['slug'] = Str::slug($data['name']);
        
        // Ensure slug uniqueness
        $originalSlug = $data['slug'];
        $count = 1;
        while ($this->categoryRepository->findBySlug($data['slug'])) {
            $data['slug'] = "{$originalSlug}-{$count}";
            $count++;
        }

        if ($icon) {
            $data['icon_path'] = $this->mediaUploadService->uploadImage($icon, 'categories');
        }

        return $this->categoryRepository->create($data);
    }

    public function update(int $id, array $data, ?UploadedFile $icon = null): bool
    {
        $category = $this->categoryRepository->findById($id);
        if (!$category) {
            return false;
        }

        if (isset($data['name']) && $data['name'] !== $category->name) {
            $slug = Str::slug($data['name']);
            $existing = $this->categoryRepository->findBySlug($slug);
            if ($existing && $existing->id !== $id) {
                $slug = "{$slug}-{$id}";
            }
            $data['slug'] = $slug;
        }

        if ($icon) {
            $this->mediaUploadService->deleteFile($category->icon_path);
            $data['icon_path'] = $this->mediaUploadService->uploadImage($icon, 'categories');
        }

        return $this->categoryRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        $category = $this->categoryRepository->findById($id);
        if ($category) {
            $this->mediaUploadService->deleteFile($category->icon_path);
            return $this->categoryRepository->delete($id);
        }
        return false;
    }
}
