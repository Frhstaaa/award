<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    protected static ?array $runtimeCache = null;

    /**
     * Get all settings as key-value array with in-memory and application caching
     */
    public static function allKeyValues(): array
    {
        if (static::$runtimeCache !== null) {
            return static::$runtimeCache;
        }

        static::$runtimeCache = Cache::remember('app_system_settings', 3600, function () {
            return static::pluck('value', 'key')->toArray();
        });

        return static::$runtimeCache;
    }

    /**
     * Get a setting by key with O(1) memory lookup
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $settings = static::allKeyValues();
        return array_key_exists($key, $settings) ? $settings[$key] : $default;
    }

    /**
     * Set a setting and immediately invalidate the cache
     */
    public static function set(string $key, mixed $value): static
    {
        $setting = static::updateOrCreate(
            ['key' => $key],
            ['value' => is_array($value) ? json_encode($value) : (string) $value]
        );

        static::flushCache();

        return $setting;
    }

    /**
     * Invalidate both runtime memory cache and persistent application cache
     */
    public static function flushCache(): void
    {
        static::$runtimeCache = null;
        Cache::forget('app_system_settings');
    }
}
