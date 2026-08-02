<?php

namespace App\Http\Requests\Folders;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AssignShipperRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'shipper_id' => [
                'required',
                Rule::exists('users', 'id')->where(function ($query) {
                    $query->where('role', UserRole::SHIPPER);
                }),
            ],
            'reason' => ['nullable', 'string', 'max:255'],
        ];
    }
}
