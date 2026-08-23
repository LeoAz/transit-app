<?php

namespace Tests\Feature\Reports;

use App\Enums\Reports\ReportFrequency;
use App\Jobs\SendScheduledReportEmail;
use App\Models\ReportSchedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Bus;

uses(RefreshDatabase::class);

test('a due daily schedule is dispatched', function () {
    Carbon::setTestNow('2026-08-12 06:00:00'); // Wednesday
    Bus::fake();

    $due = ReportSchedule::factory()->create([
        'frequency' => ReportFrequency::DAILY,
        'send_time' => '06:00:00',
        'is_active' => true,
    ]);

    $this->artisan('reports:send-scheduled');

    Bus::assertDispatched(SendScheduledReportEmail::class, fn ($job) => $job->schedule->id === $due->id);

    Carbon::setTestNow();
});

test('a weekly schedule is not dispatched on the wrong day', function () {
    Carbon::setTestNow('2026-08-12 06:00:00'); // Wednesday = ISO day 3
    Bus::fake();

    ReportSchedule::factory()->create([
        'frequency' => ReportFrequency::WEEKLY,
        'day_of_week' => 1, // Monday
        'send_time' => '06:00:00',
        'is_active' => true,
    ]);

    $this->artisan('reports:send-scheduled');

    Bus::assertNotDispatched(SendScheduledReportEmail::class);

    Carbon::setTestNow();
});

test('a schedule already sent today is not dispatched again', function () {
    Carbon::setTestNow('2026-08-12 06:00:00');
    Bus::fake();

    ReportSchedule::factory()->create([
        'frequency' => ReportFrequency::DAILY,
        'send_time' => '06:00:00',
        'is_active' => true,
        'last_sent_at' => Carbon::now()->subHour(),
    ]);

    $this->artisan('reports:send-scheduled');

    Bus::assertNotDispatched(SendScheduledReportEmail::class);

    Carbon::setTestNow();
});

test('an inactive schedule is not dispatched', function () {
    Carbon::setTestNow('2026-08-12 06:00:00');
    Bus::fake();

    ReportSchedule::factory()->create([
        'frequency' => ReportFrequency::DAILY,
        'send_time' => '06:00:00',
        'is_active' => false,
    ]);

    $this->artisan('reports:send-scheduled');

    Bus::assertNotDispatched(SendScheduledReportEmail::class);

    Carbon::setTestNow();
});

test('a monthly schedule falls back to the last day of a shorter month', function () {
    Carbon::setTestNow('2026-02-28 06:00:00'); // last day of Feb 2026 (not a leap year)
    Bus::fake();

    $due = ReportSchedule::factory()->create([
        'frequency' => ReportFrequency::MONTHLY,
        'day_of_month' => 31,
        'send_time' => '06:00:00',
        'is_active' => true,
    ]);

    $this->artisan('reports:send-scheduled');

    Bus::assertDispatched(SendScheduledReportEmail::class, fn ($job) => $job->schedule->id === $due->id);

    Carbon::setTestNow();
});
