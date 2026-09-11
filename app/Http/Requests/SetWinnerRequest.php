<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SetWinnerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'nominee_id' => 'required|exists:nominees,id',
        ];
    }
}
