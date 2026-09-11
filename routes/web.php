<?php

use App\Http\Controllers\Admin\BacksoundController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\NomineeController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\WinnerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\ShowcaseController;
use Illuminate\Support\Facades\Route;

// Halaman Publik Showcase (Slideshow presentasi)
Route::get('/', [ShowcaseController::class, 'index'])->name('showcase');
Route::get('/preview', [ShowcaseController::class, 'index'])->name('showcase.preview');

// Redirect /dashboard to admin dashboard
Route::get('/dashboard', function () {
    return redirect()->route('admin.dashboard');
})->middleware(['auth'])->name('dashboard');

// Admin Protected Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Manajemen Kategori
    Route::resource('categories', CategoryController::class)->except(['create', 'edit', 'show']);

    // Manajemen Karyawan
    Route::resource('employees', EmployeeController::class)->except(['create', 'edit', 'show']);

    // Manajemen Nominasi
    Route::resource('nominees', NomineeController::class)->except(['create', 'edit', 'show']);

    // Penetapan Pemenang
    Route::get('/winners', [WinnerController::class, 'index'])->name('winners.index');
    Route::post('/winners', [WinnerController::class, 'store'])->name('winners.store');
    Route::delete('/winners/{category}', [WinnerController::class, 'destroy'])->name('winners.destroy');

    // Manajemen Backsound
    Route::get('/backsounds', [BacksoundController::class, 'index'])->name('backsounds.index');
    Route::post('/backsounds', [BacksoundController::class, 'store'])->name('backsounds.store');
    Route::post('/backsounds/{id}/toggle', [BacksoundController::class, 'toggle'])->name('backsounds.toggle');
    Route::delete('/backsounds/{id}', [BacksoundController::class, 'destroy'])->name('backsounds.destroy');

    // Pengaturan Acara
    Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
    Route::post('/settings', [SettingController::class, 'update'])->name('settings.update');
});

// Profile Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
