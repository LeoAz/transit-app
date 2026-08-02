<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'folder_id' => Folder::factory(),
            'document_type' => fake()->randomElement(['BL', 'Facture', 'Liste de colisage', 'Certificat']),
            'file_name' => fake()->word().'.pdf',
            'file_path' => 'documents/'.fake()->uuid().'.pdf',
            'format' => 'application/pdf',
            'size' => fake()->numberBetween(1024, 1024 * 1024 * 5),
            'user_id' => User::factory(),
        ];
    }
}
