<?php

namespace App\Exports\Sheets;

use App\Exports\Concerns\FormatsReportSheet;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;

final readonly class DailyAlertsSheetExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    use FormatsReportSheet;

    public function __construct(private Collection $rows) {}

    public function collection(): Collection
    {
        return $this->rows;
    }

    public function headings(): array
    {
        return ['N° Dossier', 'Client', 'Statut', 'Date limite'];
    }

    public function map(mixed $row): array
    {
        return [
            $row['folder_number'],
            $row['customer'],
            $row['status_label'],
            $row['loading_deadline'],
        ];
    }

    public function title(): string
    {
        return 'Alertes actives';
    }
}
