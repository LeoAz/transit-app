<?php

namespace App\Http\Requests\Folders;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFolderRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à effectuer cette requête.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation pour la mise à jour d'un dossier.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Récupère l'instance du dossier depuis la route Eloquent Model Binding
        $folderId = $this->route('folder')?->id;

        return [
            'bl_received_at' => ['required', 'date'],
            'bl_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('folders', 'bl_number')->ignore($folderId),
            ],
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'shipping_company_id' => ['required', 'integer', 'exists:shipping_companies,id'],
            'documents' => ['nullable', 'array'],
            'documents.*' => ['file', 'mimes:pdf,png,jpg,jpeg', 'max:10240'],
        ];
    }
}
