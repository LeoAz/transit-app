<?php

namespace App\Exports;

use App\Exports\Concerns\FormatsReportSheet;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;

final readonly class OngoingFoldersExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    use FormatsReportSheet;

    public function __construct(private Collection $rows) {}

    public function collection(): Collection
    {
        return $this->rows;
    }

    public function headings(): array
    {
        return ['N° Dossier', 'Client', 'Chargeur', 'Statut', 'Conteneurs commandés', 'Conteneurs chargés', 'ETA', 'ATA', 'Date limite', 'Jours restants'];
    }

    public function map(mixed $row): array
    {
        return [
            $row['folder_number'],
            $row['customer'],
            $row['shipper'],
            $row['status_label'],
            $row['container_count'],
            $row['loaded'],
            $row['eta'],
            $row['ata'],
            $row['loading_deadline'],
            $row['days_until_deadline'],
        ];
    }

    public function title(): string
    {
        return 'Dossiers en cours';
    }
}
