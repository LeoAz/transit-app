<?php

namespace App\Console\Commands;

use App\Enums\Reports\ReportFrequency;
use App\Jobs\SendScheduledReportEmail;
use App\Models\ReportSchedule;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendScheduledReports extends Command
{
    protected $signature = 'reports:send-scheduled';

    protected $description = "Envoie les rapports programmés dont l'échéance est atteinte";

    public function handle(): void
    {
        $now = Carbon::now();

        ReportSchedule::query()
            ->where('is_active', true)
            ->whereTime('send_time', '=', $now->format('H:i:00'))
            ->get()
            ->filter(fn (ReportSchedule $schedule) => $this->isDueToday($schedule, $now))
            ->filter(fn (ReportSchedule $schedule) => ! $this->alreadySentToday($schedule, $now))
            ->each(function (ReportSchedule $schedule) {
                SendScheduledReportEmail::dispatch($schedule);
            });
    }

    private function isDueToday(ReportSchedule $schedule, Carbon $now): bool
    {
        return match ($schedule->frequency) {
            ReportFrequency::DAILY => true,
            ReportFrequency::WEEKLY => $schedule->day_of_week === $now->dayOfWeekIso,
            ReportFrequency::MONTHLY => $now->day === min((int) $schedule->day_of_month, $now->daysInMonth),
        };
    }

    private function alreadySentToday(ReportSchedule $schedule, Carbon $now): bool
    {
        return $schedule->last_sent_at?->isSameDay($now) ?? false;
    }
}
