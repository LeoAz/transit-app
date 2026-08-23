<?php

namespace App\Exports;

use App\Exports\Sheets\DailyAlertsSheetExport;
use App\Exports\Sheets\DailyLoadingsSheetExport;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Export;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

final readonly class DailyReportExport implements Export, WithMultipleSheets
{
    /**
     * @param  Collection<int, array<string, mixed>>  $loadings
     * @param  Collection<int, array<string, mixed>>  $alerts
     */
    public function __construct(
        private Collection $loadings,
        private Collection $alerts,
    ) {}

    public function sheets(): array
    {
        return [
            new DailyLoadingsSheetExport($this->loadings),
            new DailyAlertsSheetExport($this->alerts),
        ];
    }
}
