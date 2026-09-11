<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBacksoundRequest;
use App\Services\BacksoundService;
use App\Services\CategoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BacksoundController extends Controller
{
    public function __construct(
        protected BacksoundService $backsoundService,
        protected CategoryService $categoryService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Backsounds/Index', [
            'backsounds' => $this->backsoundService->getAll(),
            'categories' => $this->categoryService->getAll(),
        ]);
    }

    public function store(StoreBacksoundRequest $request): RedirectResponse
    {
        $this->backsoundService->create(
            $request->validated(),
            $request->file('audio')
        );

        return redirect()->route('admin.backsounds.index')->with('success', 'File backsound berhasil diunggah.');
    }

    public function toggle(int $id): RedirectResponse
    {
        $this->backsoundService->toggleActive($id);

        return redirect()->route('admin.backsounds.index')->with('success', 'Status aktif backsound diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $this->backsoundService->delete($id);

        return redirect()->route('admin.backsounds.index')->with('success', 'File backsound berhasil dihapus.');
    }
}
