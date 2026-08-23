<?php

namespace Database\Factories;

use App\Enums\Reports\ReportFormat;
use App\Enums\Reports\ReportType;
use App\Models\ReportExecution;
use App\Models\ReportSchedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReportExecution>
 */
class ReportExecutionFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'report_schedule_id' => ReportSchedule::factory(),
            'report_type' => fake()->randomElement(ReportType::cases()),
            'format' => fake()->randomElement(ReportFormat::cases()),
            'period_start' => fake()->dateTimeBetween('-1 month', 'now'),
            'period_end' => fake()->dateTimeBetween('now', '+1 day'),
            'file_path' => 'reports/scheduled/1/'.fake()->uuid().'.pdf',
            'file_name' => fake()->uuid().'.pdf',
            'status' => 'sent',
            'error_message' => null,
            'recipients' => [fake()->safeEmail()],
            'sent_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
