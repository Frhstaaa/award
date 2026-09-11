<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\MediaUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function __construct(
        protected MediaUploadService $mediaUploadService
    ) {}

    public function index(): Response
    {
        $settings = [
            'event_title' => Setting::get('event_title', 'RSU Livasya Awards 2026'),
            'event_subtitle' => Setting::get('event_subtitle', 'Malam Penganugerahan & Apresiasi Insan Berprestasi'),
            'slide_duration' => (int) Setting::get('slide_duration', 8),
            'suspense_duration' => (int) Setting::get('suspense_duration', 4),
            'reveal_duration' => (int) Setting::get('reveal_duration', 10),
            'auto_loop' => filter_var(Setting::get('auto_loop', true), FILTER_VALIDATE_BOOLEAN),
            'app_logo' => Setting::get('app_logo', '/images/logo-rsu-livasya.png'),
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'event_title' => 'required|string|max:150',
            'event_subtitle' => 'nullable|string|max:255',
            'slide_duration' => 'required|integer|min:3|max:60',
            'suspense_duration' => 'required|integer|min:2|max:30',
            'reveal_duration' => 'required|integer|min:5|max:60',
            'auto_loop' => 'required|boolean',
            'app_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:3072',
            'remove_logo' => 'nullable|boolean',
        ]);

        if ($request->boolean('remove_logo')) {
            $oldPath = Setting::get('app_logo');
            if ($oldPath && str_starts_with($oldPath, '/storage/uploads/logo/')) {
                $this->mediaUploadService->deleteFile(ltrim(str_replace('/storage/', '', $oldPath), '/'));
            }
            Setting::set('app_logo', '/images/logo-rsu-livasya.png');
        } elseif ($request->hasFile('app_logo')) {
            $oldPath = Setting::get('app_logo');
            if ($oldPath && str_starts_with($oldPath, '/storage/uploads/logo/')) {
                $this->mediaUploadService->deleteFile(ltrim(str_replace('/storage/', '', $oldPath), '/'));
            }
            $storedPath = $this->mediaUploadService->uploadImage($request->file('app_logo'), 'logo');
            Setting::set('app_logo', '/storage/' . ltrim($storedPath, '/'));
        }

        Setting::set('event_title', $data['event_title']);
        Setting::set('event_subtitle', $data['event_subtitle'] ?? '');
        Setting::set('slide_duration', $data['slide_duration']);
        Setting::set('suspense_duration', $data['suspense_duration']);
        Setting::set('reveal_duration', $data['reveal_duration']);
        Setting::set('auto_loop', $data['auto_loop']);

        return redirect()->route('admin.settings.index')->with('success', 'Pengaturan acara dan logo berhasil disimpan.');
    }
}
