<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon_path',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    protected $appends = [
        'icon_url',
    ];

    public function getIconUrlAttribute(): ?string
    {
        if (!$this->icon_path) {
            return null;
        }

        if (str_starts_with($this->icon_path, 'http')) {
            return $this->icon_path;
        }

        return Storage::url($this->icon_path);
    }

    public function nominees(): HasMany
    {
        return $this->hasMany(Nominee::class)->orderBy('order', 'asc');
    }

    public function winner(): HasOne
    {
        return $this->hasOne(Winner::class);
    }

    public function backsounds(): HasMany
    {
        return $this->hasMany(Backsound::class);
    }
}
