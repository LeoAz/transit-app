<?php

namespace Database\Factories;

use App\Enums\ContainerType;
use App\Models\Folder;
use App\Models\Loading;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Loading>
 */
class LoadingFactory extends Factory
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
            'loading_date' => fake()->dateTimeBetween('-1 week', 'now'),
            'truck_number' => strtoupper(fake()->bothify('??-###-??')),
            'carrier' => fake()->company(),
            'driver' => fake()->name(),
            'loaded_container_count' => fake()->numberBetween(1, 5),
            'container_type' => fake()->randomElement(ContainerType::cases()),
            'container_numbers' => implode(', ', fake()->words(3)),
            'destination' => fake()->city(),
            'notes' => fake()->sentence(),
            'user_id' => User::factory(),
        ];
    }
}
