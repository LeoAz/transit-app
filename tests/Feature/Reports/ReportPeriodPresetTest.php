<?php

namespace Tests\Feature\Reports;

use App\Data\Reports\ReportPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

test('report period presets resolve to expected boundaries', function () {
    Carbon::setTestNow('2026-08-12 15:00:00'); // Wednesday

    $day = ReportPeriod::fromRequest(Request::create('/', 'GET', ['period' => 'day']));
    expect($day->startDate->toDateString())->toBe('2026-08-12');
    expect($day->endDate->toDateString())->toBe('2026-08-12');

    $week = ReportPeriod::fromRequest(Request::create('/', 'GET', ['period' => 'week']));
    expect($week->startDate->toDateString())->toBe('2026-08-10'); // Monday
    expect($week->endDate->toDateString())->toBe('2026-08-16'); // Sunday

    $month = ReportPeriod::fromRequest(Request::create('/', 'GET', ['period' => 'month']));
    expect($month->startDate->toDateString())->toBe('2026-08-01');
    expect($month->endDate->toDateString())->toBe('2026-08-31');

    $year = ReportPeriod::fromRequest(Request::create('/', 'GET', ['period' => 'year']));
    expect($year->startDate->toDateString())->toBe('2026-01-01');
    expect($year->endDate->toDateString())->toBe('2026-12-31');

    $custom = ReportPeriod::fromRequest(Request::create('/', 'GET', [
        'period' => 'custom',
        'start_date' => '2026-03-01',
        'end_date' => '2026-03-15',
    ]));
    expect($custom->startDate->toDateString())->toBe('2026-03-01');
    expect($custom->endDate->toDateString())->toBe('2026-03-15');

    Carbon::setTestNow();
});
