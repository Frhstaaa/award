<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'position',
        'department',
        'photo_path',
    ];

    protected $appends = [
        'photo_url',
    ];

    public function getPhotoUrlAttribute(): ?string
    {
        if (!$this->photo_path) {
            return null;
        }

        if (str_starts_with($this->photo_path, 'http')) {
            return $this->photo_path;
        }

        return Storage::url($this->photo_path);
    }

    public function nominees(): HasMany
    {
        return $this->hasMany(Nominee::class);
    }
}
