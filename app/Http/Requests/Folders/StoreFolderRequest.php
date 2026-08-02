<?php

namespace App\Http\Requests\Folders;

use App\Enums\ContainerType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFolderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date_reception_bl' => ['required', 'date'],
            'bl_number' => ['required', 'string', 'max:255'],
            'customer_id' => ['required', 'exists:customers,id'],
            'container_type' => ['required', Rule::enum(ContainerType::class)],
            'container_count' => ['required', 'integer', 'min:1'],
            'product_id' => ['required', 'exists:products,id'],
            'vessel_name' => ['required', 'string', 'max:255'],
            'eta' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'files' => ['nullable', 'array'],
            'files.*' => ['file', 'max:10240'],
        ];
    }
}
