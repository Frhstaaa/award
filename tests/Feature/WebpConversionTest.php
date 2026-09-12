<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Employee;
use App\Models\Setting;
use App\Models\User;
use App\Services\MediaUploadService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class WebpConversionTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected MediaUploadService $mediaUploadService;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $this->mediaUploadService = new MediaUploadService();
    }

    public function test_employee_photo_upload_is_automatically_converted_to_webp(): void
    {
        // Create a fake JPG image
        $jpegFile = UploadedFile::fake()->image('profile.jpg', 640, 480);

        $response = $this->actingAs($this->admin)->post(route('admin.employees.store'), [
            'name' => 'John Doe WebP',
            'position' => 'Senior Developer',
            'department' => 'Technology',
            'photo' => $jpegFile,
        ]);

        $response->assertRedirect(route('admin.employees.index'));

        $employee = Employee::where('name', 'John Doe WebP')->first();
        $this->assertNotNull($employee);
        $this->assertNotNull($employee->photo_path);

        // Assert file extension is .webp in DB
        $this->assertStringEndsWith('.webp', $employee->photo_path);
        $this->assertStringStartsWith('uploads/employees/', $employee->photo_path);

        // Assert file exists in public storage
        Storage::disk('public')->assertExists($employee->photo_path);

        // Assert photo_url accessor produces webp url
        $this->assertStringEndsWith('.webp', $employee->photo_url);

        // Verify the stored file is a valid WebP file
        $content = Storage::disk('public')->get($employee->photo_path);
        $this->assertSame('WEBP', substr($content, 8, 4));
    }

    public function test_category_icon_upload_png_is_automatically_converted_to_webp(): void
    {
        // Create a fake PNG image
        $pngFile = UploadedFile::fake()->image('category_badge.png', 400, 400);

        $response = $this->actingAs($this->admin)->post(route('admin.categories.store'), [
            'name' => 'Best Innovator WebP',
            'description' => 'Penghargaan inovasi',
            'icon' => $pngFile,
            'order' => 1,
            'is_active' => true,
        ]);

        $response->assertRedirect(route('admin.categories.index'));

        $category = Category::where('name', 'Best Innovator WebP')->first();
        $this->assertNotNull($category);
        $this->assertNotNull($category->icon_path);

        // Assert file extension is .webp
        $this->assertStringEndsWith('.webp', $category->icon_path);
        $this->assertStringStartsWith('uploads/categories/', $category->icon_path);
        Storage::disk('public')->assertExists($category->icon_path);

        // Verify valid WebP header
        $content = Storage::disk('public')->get($category->icon_path);
        $this->assertSame('WEBP', substr($content, 8, 4));
    }

    public function test_updating_employee_photo_converts_to_webp_and_removes_old_file(): void
    {
        $file1 = UploadedFile::fake()->image('first.jpg', 300, 300);
        $this->actingAs($this->admin)->post(route('admin.employees.store'), [
            'name' => 'Jane Update Test',
            'position' => 'Designer',
            'department' => 'Creative',
            'photo' => $file1,
        ]);

        $employee = Employee::where('name', 'Jane Update Test')->first();
        $oldPath = $employee->photo_path;
        Storage::disk('public')->assertExists($oldPath);

        // Update with a new PNG photo
        $file2 = UploadedFile::fake()->image('second.png', 300, 300);
        $this->actingAs($this->admin)->put(route('admin.employees.update', $employee->id), [
            'name' => 'Jane Update Test Edited',
            'position' => 'Lead Designer',
            'department' => 'Creative',
            'photo' => $file2,
        ]);

        $employee->refresh();
        $newPath = $employee->photo_path;

        $this->assertNotEquals($oldPath, $newPath);
        $this->assertStringEndsWith('.webp', $newPath);

        // Old file deleted, new file exists
        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($newPath);
    }

    public function test_setting_logo_upload_converts_to_webp(): void
    {
        $logoFile = UploadedFile::fake()->image('hospital_logo.png', 800, 200);

        $response = $this->actingAs($this->admin)->post(route('admin.settings.update'), [
            'event_title' => 'RSU Awards 2026',
            'event_subtitle' => 'Malam Penganugerahan',
            'slide_duration' => 8,
            'suspense_duration' => 4,
            'reveal_duration' => 10,
            'auto_loop' => 1,
            'app_logo' => $logoFile,
        ]);

        $response->assertRedirect(route('admin.settings.index'));

        $savedLogo = Setting::get('app_logo');
        $this->assertNotNull($savedLogo);
        $this->assertStringStartsWith('/storage/uploads/logo/', $savedLogo);
        $this->assertStringEndsWith('.webp', $savedLogo);

        $relPath = ltrim(str_replace('/storage/', '', $savedLogo), '/');
        Storage::disk('public')->assertExists($relPath);

        $content = Storage::disk('public')->get($relPath);
        $this->assertSame('WEBP', substr($content, 8, 4));
    }

    public function test_media_upload_service_large_image_resizing(): void
    {
        // Create large image: 2400 x 1200
        $largeImage = UploadedFile::fake()->image('giant.jpg', 2400, 1200);

        $savedPath = $this->mediaUploadService->uploadImage($largeImage, 'test', 80, 1920, 1920);

        $this->assertStringEndsWith('.webp', $savedPath);
        Storage::disk('public')->assertExists($savedPath);

        $content = Storage::disk('public')->get($savedPath);
        $gd = imagecreatefromstring($content);
        $this->assertNotFalse($gd);

        // Should be proportionally scaled down to max width 1920
        $this->assertSame(1920, imagesx($gd));
        $this->assertSame(960, imagesy($gd));
        imagedestroy($gd);
    }

    public function test_media_upload_service_preserves_svg_vector(): void
    {
        $svgContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>';
        $svgFile = UploadedFile::fake()->createWithContent('icon.svg', $svgContent);

        $savedPath = $this->mediaUploadService->uploadImage($svgFile, 'categories');

        $this->assertStringEndsWith('.svg', $savedPath);
        Storage::disk('public')->assertExists($savedPath);
    }

    public function test_artisan_command_converts_existing_legacy_images(): void
    {
        // Store an uncompressed PNG directly as if it was uploaded in the past
        $pngContent = UploadedFile::fake()->image('legacy_photo.png', 200, 200)->getContent();
        $legacyPath = 'uploads/employees/legacy_123.png';
        Storage::disk('public')->put($legacyPath, $pngContent);

        $employee = Employee::create([
            'name' => 'Legacy Employee',
            'position' => 'Staff',
            'department' => 'HR',
            'photo_path' => $legacyPath,
        ]);

        $this->artisan('images:convert-to-webp')
            ->assertSuccessful();

        $employee->refresh();
        $this->assertStringEndsWith('.webp', $employee->photo_path);
        Storage::disk('public')->assertExists($employee->photo_path);
        Storage::disk('public')->assertMissing($legacyPath);
    }
}
