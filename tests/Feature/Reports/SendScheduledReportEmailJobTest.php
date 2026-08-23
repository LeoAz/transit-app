<?php

namespace Tests\Feature\Reports;

use App\Actions\Reports\Scheduling\GenerateScheduledReportFileAction;
use App\Enums\Reports\ReportFormat;
use App\Enums\Reports\ReportFrequency;
use App\Enums\Reports\ReportType;
use App\Jobs\SendScheduledReportEmail;
use App\Mail\ScheduledReportMail;
use App\Models\Folder;
use App\Models\ReportSchedule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('the job generates the file, records the execution and sends the mail', function (ReportFormat $format) {
    Storage::fake('public');
    Mail::fake();

    $user = User::factory()->create();
    Folder::factory()->count(2)->create();

    $schedule = ReportSchedule::factory()->create([
        'user_id' => $user->id,
        'report_type' => ReportType::CLIENT_SITUATION,
        'format' => $format,
        'frequency' => ReportFrequency::DAILY,
        'additional_recipients' => ['collegue@example.com'],
    ]);

    (new SendScheduledReportEmail($schedule))->handle(app(GenerateScheduledReportFileAction::class));

    $execution = $schedule->fresh()->executions()->first();
    expect($execution)->not->toBeNull();
    expect($execution->status)->toBe('sent');
    expect($execution->recipients)->toContain($user->email, 'collegue@example.com');
    Storage::disk('public')->assertExists($execution->file_path);

    Mail::assertSent(ScheduledReportMail::class, function (ScheduledReportMail $mail) use ($user) {
        return $mail->hasTo($user->email) && $mail->hasTo('collegue@example.com');
    });

    expect($schedule->fresh()->last_sent_at)->not->toBeNull();
})->with([
    'pdf' => [ReportFormat::PDF],
    'excel' => [ReportFormat::EXCEL],
]);

test('the daily report type is handled through the scheduling action', function () {
    Storage::fake('public');
    Mail::fake();

    $user = User::factory()->create();

    $schedule = ReportSchedule::factory()->create([
        'user_id' => $user->id,
        'report_type' => ReportType::DAILY,
        'format' => ReportFormat::EXCEL,
        'frequency' => ReportFrequency::DAILY,
        'additional_recipients' => [],
    ]);

    (new SendScheduledReportEmail($schedule))->handle(app(GenerateScheduledReportFileAction::class));

    $execution = $schedule->fresh()->executions()->first();
    expect($execution->status)->toBe('sent');
    Storage::disk('public')->assertExists($execution->file_path);
});
