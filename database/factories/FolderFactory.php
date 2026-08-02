<?php

namespace Database\Factories;

use App\Enums\ContainerType;
use App\Enums\FolderStatus;
use App\Models\Customer;
use App\Models\Folder;
use App\Models\Product;
use App\Models\User;
use App\Models\Vessel;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Folder>
 */
class FolderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $vessel = Vessel::inRandomOrder()->first();

        return [
            'folder_number' => fake()->unique()->bothify('FLD-2026-####'),
            'bl_received_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'bl_number' => fake()->unique()->bothify('BL-########'),
            'customer_id' => Customer::factory(),
            'container_type' => fake()->randomElement(ContainerType::cases()),
            'container_count' => fake()->numberBetween(1, 10),
            'product_id' => Product::factory(),
            'vessel_name' => $vessel ? $vessel->name : fake()->words(2, true),
            'eta' => fake()->dateTimeBetween('now', '+1 month'),
            'ata' => fake()->optional()->dateTimeBetween('-1 week', 'now'),
            'notes' => fake()->sentence(),
            'shipper_id' => User::factory(),
            'status' => fake()->randomElement(FolderStatus::cases()),
            'loading_deadline' => fake()->dateTimeBetween('+1 week', '+2 weeks'),
        ];
    }
}
