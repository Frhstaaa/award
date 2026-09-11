<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Services\CategoryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $this->categoryService->getAll(),
        ]);
    }

    public function store(StoreCategoryRequest $request): RedirectResponse
    {
        $this->categoryService->create(
            $request->validated(),
            $request->file('icon')
        );

        return redirect()->route('admin.categories.index')->with('success', 'Kategori penghargaan berhasil dibuat.');
    }

    public function update(UpdateCategoryRequest $request, int $id): RedirectResponse
    {
        $this->categoryService->update(
            $id,
            $request->validated(),
            $request->file('icon')
        );

        return redirect()->route('admin.categories.index')->with('success', 'Kategori penghargaan berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->categoryService->delete($id);

        return redirect()->route('admin.categories.index')->with('success', 'Kategori penghargaan berhasil dihapus.');
    }
}
