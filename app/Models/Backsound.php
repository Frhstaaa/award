<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Backsound extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'file_path',
        'context',
        'category_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'file_url',
    ];

    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file_path) {
            return null;
        }

        if (str_starts_with($this->file_path, 'http')) {
            return $this->file_path;
        }

        return '/storage/' . ltrim($this->file_path, '/');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
