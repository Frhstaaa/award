<?php

namespace App\Providers;

use App\Repositories\Contracts\BacksoundRepositoryInterface;
use App\Repositories\Contracts\CategoryRepositoryInterface;
use App\Repositories\Contracts\EmployeeRepositoryInterface;
use App\Repositories\Contracts\NomineeRepositoryInterface;
use App\Repositories\Contracts\WinnerRepositoryInterface;
use App\Repositories\Eloquent\BacksoundRepository;
use App\Repositories\Eloquent\CategoryRepository;
use App\Repositories\Eloquent\EmployeeRepository;
use App\Repositories\Eloquent\NomineeRepository;
use App\Repositories\Eloquent\WinnerRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);
        $this->app->bind(EmployeeRepositoryInterface::class, EmployeeRepository::class);
        $this->app->bind(NomineeRepositoryInterface::class, NomineeRepository::class);
        $this->app->bind(WinnerRepositoryInterface::class, WinnerRepository::class);
        $this->app->bind(BacksoundRepositoryInterface::class, BacksoundRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
