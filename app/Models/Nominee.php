<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Nominee extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'employee_id',
        'description',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function winner(): HasOne
    {
        return $this->hasOne(Winner::class);
    }
}
