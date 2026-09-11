<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNomineeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'employee_id' => 'nullable|required_without:employee_ids|exists:employees,id',
            'employee_ids' => 'nullable|required_without:employee_id|array|min:1',
            'employee_ids.*' => 'exists:employees,id',
            'description' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
        ];
    }
}
