<?php

namespace App\Exports\Sheets;

use App\Exports\Concerns\FormatsReportSheet;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;

final readonly class DailyLoadingsSheetExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    use FormatsReportSheet;

    public function __construct(private Collection $rows) {}

    public function collection(): Collection
    {
        return $this->rows;
    }

    public function headings(): array
    {
        return ['N° Dossier', 'Client', 'Chargeur', 'N° Camion', 'Conteneurs chargés', 'Destination'];
    }

    public function map(mixed $row): array
    {
        return [
            $row['folder_number'],
            $row['customer'],
            $row['shipper'],
            $row['truck_number'],
            $row['loaded_container_count'],
            $row['destination'],
        ];
    }

    public function title(): string
    {
        return 'Chargements du jour';
    }
}
