<?php

namespace App\Services;

use App\Models\Holiday;
use Illuminate\Support\Carbon;

class WorkingDaysCalculator
{
    private Carbon $startDate;

    public static function make(): self
    {
        return new self;
    }

    public function from(Carbon|string $date): self
    {
        $this->startDate = Carbon::parse($date);

        return $this;
    }

    public function addWorkingDays(int $workingDays): Carbon
    {
        $date = $this->startDate->copy();
        $addedDays = 0;

        $holidays = Holiday::pluck('date')
            ->map(fn ($d) => Carbon::parse($d)->format('Y-m-d'))
            ->toArray();

        while ($addedDays < $workingDays) {
            $date->addDay();

            if ($date->isWeekend() || in_array($date->format('Y-m-d'), $holidays, true)) {
                continue;
            }

            $addedDays++;
        }

        return $date;
    }
}
