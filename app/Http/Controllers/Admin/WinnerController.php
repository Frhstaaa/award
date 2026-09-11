<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SetWinnerRequest;
use App\Services\CategoryService;
use App\Services\WinnerService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WinnerController extends Controller
{
    public function __construct(
        protected WinnerService $winnerService,
        protected CategoryService $categoryService
    ) {}

    public function index(): Response
    {
        $categories = $this->categoryService->getAll();
        $categories->load(['nominees.employee', 'winner.nominee.employee']);

        return Inertia::render('Admin/Winners/Index', [
            'categories' => $categories,
            'winners' => $this->winnerService->getAll(),
        ]);
    }

    public function store(SetWinnerRequest $request): RedirectResponse
    {
        $this->winnerService->setWinner(
            $request->validated('category_id'),
            $request->validated('nominee_id')
        );

        return redirect()->route('admin.winners.index')->with('success', 'Pemenang kategori berhasil ditetapkan!');
    }

    public function destroy(int $categoryId): RedirectResponse
    {
        $this->winnerService->removeWinner($categoryId);

        return redirect()->route('admin.winners.index')->with('success', 'Status pemenang kategori berhasil di-reset.');
    }
}
