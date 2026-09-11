<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:150',
            'position' => 'required|string|max:150',
            'department' => 'required|string|max:150',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
        ];
    }
}
