<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,svg,webp|max:2048',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ];
    }
}
