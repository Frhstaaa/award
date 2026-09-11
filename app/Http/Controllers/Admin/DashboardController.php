<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Backsound;
use App\Models\Category;
use App\Models\Employee;
use App\Models\Nominee;
use App\Models\Winner;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalCategories = Category::count();
        $activeCategories = Category::where('is_active', true)->count();
        $totalEmployees = Employee::count();
        $totalNominees = Nominee::count();
        $totalBacksounds = Backsound::count();

        $categoriesWithWinner = Category::has('winner')->count();
        $categoriesWithoutWinner = $totalCategories - $categoriesWithWinner;

        $recentWinners = Winner::with(['category', 'nominee.employee'])
            ->latest('announced_at')
            ->take(5)
            ->get();

        $categories = Category::withCount('nominees')
            ->with(['winner.nominee.employee'])
            ->orderBy('order', 'asc')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalCategories' => $totalCategories,
                'activeCategories' => $activeCategories,
                'totalEmployees' => $totalEmployees,
                'totalNominees' => $totalNominees,
                'categoriesWithWinner' => $categoriesWithWinner,
                'categoriesWithoutWinner' => $categoriesWithoutWinner,
                'totalBacksounds' => $totalBacksounds,
            ],
            'recentWinners' => $recentWinners,
            'categories' => $categories,
        ]);
    }
}
