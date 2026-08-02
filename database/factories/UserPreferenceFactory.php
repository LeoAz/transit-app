<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserPreference>
 */
class UserPreferenceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'email_notifications_eta' => fake()->boolean(),
            'email_notifications_ata' => fake()->boolean(),
            'email_notifications_overdue' => fake()->boolean(),
            'app_notifications_eta' => fake()->boolean(),
            'app_notifications_ata' => fake()->boolean(),
            'app_notifications_overdue' => fake()->boolean(),
            'daily_report_frequency' => fake()->randomElement(['daily', 'weekly', 'never']),
        ];
    }
}
