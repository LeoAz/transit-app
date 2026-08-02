<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLoadingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'loading_date' => ['required', 'date'],
            'loaded_container_count' => ['required', 'integer', 'min:1'],
            'container_type' => ['required', 'integer', 'in:20,40,45'],
            'container_numbers' => ['required', 'string'],
            'truck_number' => ['required', 'string', 'max:255'],
            'carrier' => ['nullable', 'string', 'max:255'],
            'driver' => ['nullable', 'string', 'max:255'],
            'destination' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
