<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Winner extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'nominee_id',
        'announced_at',
    ];

    protected $casts = [
        'announced_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function nominee(): BelongsTo
    {
        return $this->belongsTo(Nominee::class);
    }
}
