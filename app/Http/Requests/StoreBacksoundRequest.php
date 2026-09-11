<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBacksoundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:150',
            'audio' => 'required|file|mimes:mp3,wav,ogg,m4a,aac|max:20480', // up to 20MB
            'context' => 'required|in:nominee_display,winner_reveal,general,background_loop,suspense',
            'category_id' => 'nullable|exists:categories,id',
            'is_active' => 'nullable|boolean',
        ];
    }
}
