<?php

namespace Database\Factories;

use App\Enums\Reports\ReportFormat;
use App\Enums\Reports\ReportFrequency;
use App\Enums\Reports\ReportType;
use App\Models\ReportSchedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReportSchedule>
 */
class ReportScheduleFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'report_type' => fake()->randomElement(ReportType::cases()),
            'format' => fake()->randomElement(ReportFormat::cases()),
            'frequency' => ReportFrequency::DAILY,
            'day_of_week' => null,
            'day_of_month' => null,
            'send_time' => '06:00:00',
            'additional_recipients' => [],
            'is_active' => true,
            'last_sent_at' => null,
        ];
    }
}
