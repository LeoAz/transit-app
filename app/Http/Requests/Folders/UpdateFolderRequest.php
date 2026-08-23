<?php

namespace App\Http\Requests\Folders;

use App\Enums\ContainerType;
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
            'container_type' => ['required', Rule::enum(ContainerType::class)],
            'container_count' => ['required', 'integer', 'min:1'],
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'vessel_id' => ['nullable', 'exists:vessels,id'],
            'vessel_name' => ['required_without:vessel_id', 'nullable', 'string', 'max:255'],
            'eta' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'files' => ['nullable', 'array'],
            'files.*' => ['file', 'max:10240'],
        ];
    }
}
