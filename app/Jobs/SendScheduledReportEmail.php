<?php

namespace App\Jobs;

use App\Actions\Reports\Scheduling\GenerateScheduledReportFileAction;
use App\Data\Reports\ReportPeriod;
use App\Mail\ScheduledReportMail;
use App\Models\ReportExecution;
use App\Models\ReportSchedule;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Throwable;

final class SendScheduledReportEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public ReportSchedule $schedule) {}

    public function handle(GenerateScheduledReportFileAction $generate): void
    {
        $period = ReportPeriod::forPreset($this->schedule->frequency->periodPreset());
        $recipients = array_values(array_unique(array_filter(array_merge(
            [$this->schedule->user->email],
            $this->schedule->additional_recipients ?? [],
        ))));

        try {
            $file = $generate->handle($this->schedule);
            $path = "reports/scheduled/{$this->schedule->id}/{$file['filename']}";
            Storage::disk('public')->put($path, $file['contents']);

            ReportExecution::create([
                'user_id' => $this->schedule->user_id,
                'report_schedule_id' => $this->schedule->id,
                'report_type' => $this->schedule->report_type,
                'format' => $this->schedule->format,
                'period_start' => $period->startDate->toDateString(),
                'period_end' => $period->endDate->toDateString(),
                'file_path' => $path,
                'file_name' => $file['filename'],
                'status' => 'sent',
                'recipients' => $recipients,
                'sent_at' => now(),
            ]);

            Mail::to($recipients)->send(new ScheduledReportMail(
                $this->schedule,
                $path,
                $file['filename'],
                $file['mimeType'],
            ));

            $this->schedule->update(['last_sent_at' => now()]);
        } catch (Throwable $e) {
            ReportExecution::create([
                'user_id' => $this->schedule->user_id,
                'report_schedule_id' => $this->schedule->id,
                'report_type' => $this->schedule->report_type,
                'format' => $this->schedule->format,
                'period_start' => $period->startDate->toDateString(),
                'period_end' => $period->endDate->toDateString(),
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'recipients' => $recipients,
            ]);

            throw $e;
        }
    }
}
