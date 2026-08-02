<?php

namespace Database\Factories;

use App\Models\AssignmentHistory;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AssignmentHistory>
 */
class AssignmentHistoryFactory extends Factory
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
            'previous_shipper_id' => User::factory(),
            'new_shipper_id' => User::factory(),
            'changed_at' => now(),
            'reason' => fake()->sentence(),
            'user_id' => User::factory(),
        ];
    }
}
