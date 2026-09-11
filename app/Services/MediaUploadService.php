<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaUploadService
{
    /**
     * Upload an image (photo or icon).
     */
    public function uploadImage(UploadedFile $file, string $directory = 'images'): string
    {
        $filename = Str::random(20) . '.' . $file->getClientOriginalExtension();
        return $file->storeAs("uploads/{$directory}", $filename, 'public');
    }

    /**
     * Upload an audio file.
     */
    public function uploadAudio(UploadedFile $file): string
    {
        $filename = Str::random(20) . '.' . $file->getClientOriginalExtension();
        return $file->storeAs('uploads/audio', $filename, 'public');
    }

    /**
     * Delete a file from public storage.
     */
    public function deleteFile(?string $path): bool
    {
        if (!$path || str_starts_with($path, 'http')) {
            return false;
        }

        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }

        return false;
    }
}
