<?php

namespace Database\Factories;

use App\Enums\FolderStatus;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuditLog>
 */
class AuditLogFactory extends Factory
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
            'event' => fake()->randomElement(['created', 'updated', 'deleted']),
            'auditable_type' => 'App\\Models\\Folder',
            'auditable_id' => fake()->numberBetween(1, 100),
            'old_values' => json_encode(['status' => FolderStatus::PENDING->value]),
            'new_values' => json_encode(['status' => FolderStatus::IN_PROGRESS->value]),
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }
}
