<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
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
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif,bmp,avif|max:10240',
        ];
    }
}
