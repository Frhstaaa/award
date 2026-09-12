<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaUploadService
{
    /**
     * Upload an image (photo or icon) and automatically convert to WebP.
     */
    public function uploadImage(
        UploadedFile $file,
        string $directory = 'images',
        int $quality = 82,
        int $maxWidth = 1920,
        int $maxHeight = 1920
    ): string {
        $extension = strtolower($file->getClientOriginalExtension());
        $mimeType = strtolower($file->getMimeType() ?? '');

        // If SVG vector file, keep it as SVG without rasterization
        if ($extension === 'svg' || str_contains($mimeType, 'svg')) {
            $filename = Str::random(20) . '.svg';
            return $file->storeAs("uploads/{$directory}", $filename, 'public');
        }

        // Convert raster images to WebP format
        $webpData = $this->convertImageToWebp($file, $quality, $maxWidth, $maxHeight);

        if ($webpData !== null) {
            $filename = Str::random(20) . '.webp';
            $path = "uploads/{$directory}/{$filename}";
            Storage::disk('public')->put($path, $webpData);
            return $path;
        }

        // Fallback if GD conversion fails
        $filename = Str::random(20) . '.' . ($extension ?: 'webp');
        return $file->storeAs("uploads/{$directory}", $filename, 'public');
    }

    /**
     * Convert an image file (or binary content) into WebP binary data.
     */
    public function convertImageToWebp(
        UploadedFile|string $fileOrPath,
        int $quality = 82,
        int $maxWidth = 1920,
        int $maxHeight = 1920
    ): ?string {
        $realPath = null;
        $contents = null;

        if ($fileOrPath instanceof UploadedFile) {
            $realPath = $fileOrPath->getRealPath();
            $contents = @file_get_contents($realPath);
        } elseif (is_file($fileOrPath)) {
            $realPath = $fileOrPath;
            $contents = @file_get_contents($fileOrPath);
        } else {
            $contents = $fileOrPath;
        }

        if (!$contents) {
            return null;
        }

        // Create GD image resource from string content
        $image = @imagecreatefromstring($contents);
        if (!$image) {
            return null;
        }

        // Fix EXIF orientation for photos taken by mobile devices if realPath exists
        if ($realPath && is_file($realPath)) {
            $this->fixExifOrientation($image, $realPath);
        }

        // Ensure true color representation and maintain alpha transparency
        if (!imageistruecolor($image)) {
            imagepalettetotruecolor($image);
        }
        imagealphablending($image, false);
        imagesavealpha($image, true);

        // Proportional downscaling if image exceeds max dimensions
        $this->resizeIfNeeded($image, $maxWidth, $maxHeight);

        // Encode to WebP via output buffering
        ob_start();
        $success = imagewebp($image, null, $quality);
        $webpData = ob_get_clean();
        imagedestroy($image);

        return ($success && $webpData !== false) ? $webpData : null;
    }

    /**
     * Correct image orientation based on EXIF data.
     */
    protected function fixExifOrientation(&$image, string $realPath): void
    {
        if (!function_exists('exif_read_data')) {
            return;
        }

        try {
            $exif = @exif_read_data($realPath);
            if (!empty($exif['Orientation'])) {
                $transparent = imagecolorallocatealpha($image, 0, 0, 0, 127);
                switch ((int) $exif['Orientation']) {
                    case 2:
                        imageflip($image, IMG_FLIP_HORIZONTAL);
                        break;
                    case 3:
                        $rotated = imagerotate($image, 180, $transparent);
                        if ($rotated !== false) {
                            imagedestroy($image);
                            $image = $rotated;
                        }
                        break;
                    case 4:
                        imageflip($image, IMG_FLIP_VERTICAL);
                        break;
                    case 5:
                        imageflip($image, IMG_FLIP_HORIZONTAL);
                        $rotated = imagerotate($image, 90, $transparent);
                        if ($rotated !== false) {
                            imagedestroy($image);
                            $image = $rotated;
                        }
                        break;
                    case 6:
                        $rotated = imagerotate($image, -90, $transparent);
                        if ($rotated !== false) {
                            imagedestroy($image);
                            $image = $rotated;
                        }
                        break;
                    case 7:
                        imageflip($image, IMG_FLIP_HORIZONTAL);
                        $rotated = imagerotate($image, -90, $transparent);
                        if ($rotated !== false) {
                            imagedestroy($image);
                            $image = $rotated;
                        }
                        break;
                    case 8:
                        $rotated = imagerotate($image, 90, $transparent);
                        if ($rotated !== false) {
                            imagedestroy($image);
                            $image = $rotated;
                        }
                        break;
                }
            }
        } catch (\Throwable) {
            // Silently continue if exif cannot be parsed
        }
    }

    /**
     * Scale down image proportionally if it exceeds maximum dimensions.
     */
    protected function resizeIfNeeded(&$image, int $maxWidth, int $maxHeight): void
    {
        $origWidth = imagesx($image);
        $origHeight = imagesy($image);

        if ($origWidth <= $maxWidth && $origHeight <= $maxHeight) {
            return;
        }

        $ratio = min($maxWidth / $origWidth, $maxHeight / $origHeight);
        $newWidth = max(1, (int) round($origWidth * $ratio));
        $newHeight = max(1, (int) round($origHeight * $ratio));

        $resized = imagecreatetruecolor($newWidth, $newHeight);
        imagealphablending($resized, false);
        imagesavealpha($resized, true);

        // Pre-fill transparent background
        $transparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);
        imagefilledrectangle($resized, 0, 0, $newWidth, $newHeight, $transparent);

        imagecopyresampled(
            $resized,
            $image,
            0, 0, 0, 0,
            $newWidth,
            $newHeight,
            $origWidth,
            $origHeight
        );

        imagedestroy($image);
        $image = $resized;
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
