<?php

namespace Tests\Feature\Reports;

use App\Enums\Reports\ReportFormat;
use App\Enums\Reports\ReportFrequency;
use App\Enums\Reports\ReportType;
use App\Enums\UserRole;
use App\Models\ReportExecution;
use App\Models\ReportSchedule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('a user can create a report schedule', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);

    $response = $this->actingAs($user)->post('/reports/scheduled', [
        'report_type' => ReportType::CLIENT_SITUATION->value,
        'format' => ReportFormat::PDF->value,
        'frequency' => ReportFrequency::DAILY->value,
        'send_time' => '06:00',
        'additional_recipients' => ['collegue@example.com'],
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('report_schedules', [
        'user_id' => $user->id,
        'report_type' => ReportType::CLIENT_SITUATION->value,
        'format' => ReportFormat::PDF->value,
        'frequency' => ReportFrequency::DAILY->value,
    ]);
});

test('day_of_week is required for a weekly schedule', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);

    $response = $this->actingAs($user)->post('/reports/scheduled', [
        'report_type' => ReportType::CLIENT_SITUATION->value,
        'format' => ReportFormat::PDF->value,
        'frequency' => ReportFrequency::WEEKLY->value,
        'send_time' => '06:00',
    ]);

    $response->assertSessionHasErrors('day_of_week');
});

test('day_of_month is required for a monthly schedule', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);

    $response = $this->actingAs($user)->post('/reports/scheduled', [
        'report_type' => ReportType::CLIENT_SITUATION->value,
        'format' => ReportFormat::PDF->value,
        'frequency' => ReportFrequency::MONTHLY->value,
        'send_time' => '06:00',
    ]);

    $response->assertSessionHasErrors('day_of_month');
});

test('a user can update and delete their own schedule', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    $schedule = ReportSchedule::factory()->create(['user_id' => $user->id]);

    $updateResponse = $this->actingAs($user)->put("/reports/scheduled/{$schedule->id}", [
        'report_type' => ReportType::DAILY->value,
        'format' => ReportFormat::EXCEL->value,
        'frequency' => ReportFrequency::WEEKLY->value,
        'day_of_week' => 3,
        'send_time' => '08:00',
        'is_active' => false,
    ]);

    $updateResponse->assertSessionHasNoErrors();
    $this->assertDatabaseHas('report_schedules', [
        'id' => $schedule->id,
        'report_type' => ReportType::DAILY->value,
        'is_active' => false,
    ]);

    $deleteResponse = $this->actingAs($user)->delete("/reports/scheduled/{$schedule->id}");
    $deleteResponse->assertSessionHasNoErrors();
    $this->assertDatabaseMissing('report_schedules', ['id' => $schedule->id]);
});

test('a user cannot update, delete or download another users resources', function () {
    $owner = User::factory()->create(['role' => UserRole::ADMIN]);
    $intruder = User::factory()->create(['role' => UserRole::ADMIN]);
    $schedule = ReportSchedule::factory()->create(['user_id' => $owner->id]);
    $execution = ReportExecution::factory()->create(['user_id' => $owner->id, 'report_schedule_id' => $schedule->id]);

    $this->actingAs($intruder)->put("/reports/scheduled/{$schedule->id}", [
        'report_type' => ReportType::DAILY->value,
        'format' => ReportFormat::PDF->value,
        'frequency' => ReportFrequency::DAILY->value,
        'send_time' => '06:00',
        'is_active' => true,
    ])->assertForbidden();

    $this->actingAs($intruder)->delete("/reports/scheduled/{$schedule->id}")->assertForbidden();

    $this->actingAs($intruder)
        ->get("/reports/scheduled/executions/{$execution->id}/download")
        ->assertForbidden();
});
