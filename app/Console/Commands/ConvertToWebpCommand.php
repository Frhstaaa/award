<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Employee;
use App\Models\Setting;
use App\Services\MediaUploadService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ConvertToWebpCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:convert-to-webp {--quality=82 : WebP image quality (1-100)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Convert existing uploaded images (employees, categories, logo) to WebP format';

    public function __construct(protected MediaUploadService $mediaUploadService)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $quality = (int) $this->option('quality');
        $this->info("Memulai konversi gambar ke format WebP (Quality: {$quality})...");

        $convertedCount = 0;
        $totalBytesSaved = 0;

        // 1. Convert Employee photos
        $employees = Employee::whereNotNull('photo_path')
            ->where('photo_path', 'not like', 'http%')
            ->where('photo_path', 'not like', '%.webp')
            ->get();

        foreach ($employees as $employee) {
            $oldPath = $employee->photo_path;
            if (Storage::disk('public')->exists($oldPath)) {
                $absolutePath = Storage::disk('public')->path($oldPath);
                $oldSize = filesize($absolutePath);

                $webpData = $this->mediaUploadService->convertImageToWebp($absolutePath, $quality);
                if ($webpData) {
                    $newPath = preg_replace('/\.[^.]+$/', '.webp', $oldPath);
                    if ($newPath === $oldPath) {
                        $newPath = 'uploads/employees/' . Str::random(20) . '.webp';
                    }

                    Storage::disk('public')->put($newPath, $webpData);
                    if ($newPath !== $oldPath) {
                        Storage::disk('public')->delete($oldPath);
                    }

                    $newSize = strlen($webpData);
                    $saved = max(0, $oldSize - $newSize);
                    $totalBytesSaved += $saved;

                    $employee->update(['photo_path' => $newPath]);
                    $convertedCount++;
                    $this->line("  [Employee] {$employee->name}: {$oldPath} -> {$newPath} (Hemat: " . round($saved / 1024, 1) . " KB)");
                }
            }
        }

        // 2. Convert Category icons
        $categories = Category::whereNotNull('icon_path')
            ->where('icon_path', 'not like', 'http%')
            ->where('icon_path', 'not like', '%.webp')
            ->where('icon_path', 'not like', '%.svg')
            ->get();

        foreach ($categories as $category) {
            $oldPath = $category->icon_path;
            if (Storage::disk('public')->exists($oldPath)) {
                $absolutePath = Storage::disk('public')->path($oldPath);
                $oldSize = filesize($absolutePath);

                $webpData = $this->mediaUploadService->convertImageToWebp($absolutePath, $quality);
                if ($webpData) {
                    $newPath = preg_replace('/\.[^.]+$/', '.webp', $oldPath);
                    if ($newPath === $oldPath) {
                        $newPath = 'uploads/categories/' . Str::random(20) . '.webp';
                    }

                    Storage::disk('public')->put($newPath, $webpData);
                    if ($newPath !== $oldPath) {
                        Storage::disk('public')->delete($oldPath);
                    }

                    $newSize = strlen($webpData);
                    $saved = max(0, $oldSize - $newSize);
                    $totalBytesSaved += $saved;

                    $category->update(['icon_path' => $newPath]);
                    $convertedCount++;
                    $this->line("  [Category] {$category->name}: {$oldPath} -> {$newPath} (Hemat: " . round($saved / 1024, 1) . " KB)");
                }
            }
        }

        // 3. Convert Setting logo
        $appLogo = Setting::get('app_logo');
        if ($appLogo && str_starts_with($appLogo, '/storage/uploads/logo/') && !str_ends_with($appLogo, '.webp') && !str_ends_with($appLogo, '.svg')) {
            $relativePath = ltrim(str_replace('/storage/', '', $appLogo), '/');
            if (Storage::disk('public')->exists($relativePath)) {
                $absolutePath = Storage::disk('public')->path($relativePath);
                $oldSize = filesize($absolutePath);

                $webpData = $this->mediaUploadService->convertImageToWebp($absolutePath, $quality);
                if ($webpData) {
                    $newRelativePath = preg_replace('/\.[^.]+$/', '.webp', $relativePath);
                    Storage::disk('public')->put($newRelativePath, $webpData);
                    if ($newRelativePath !== $relativePath) {
                        Storage::disk('public')->delete($relativePath);
                    }

                    $newSize = strlen($webpData);
                    $saved = max(0, $oldSize - $newSize);
                    $totalBytesSaved += $saved;

                    Setting::set('app_logo', '/storage/' . $newRelativePath);
                    $convertedCount++;
                    $this->line("  [Setting Logo] {$relativePath} -> {$newRelativePath} (Hemat: " . round($saved / 1024, 1) . " KB)");
                }
            }
        }

        $mbSaved = round($totalBytesSaved / (1024 * 1024), 2);
        $this->info("Selesai! Berhasil mengonversi {$convertedCount} file gambar ke WebP. Total bandwidth geschrumpft / hemat: {$mbSaved} MB.");

        return self::SUCCESS;
    }
}
