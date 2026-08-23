<?php

namespace App\Exports;

use App\Exports\Concerns\FormatsReportSheet;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;

final readonly class ShipperSituationExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    use FormatsReportSheet;

    public function __construct(private Collection $rows) {}

    public function collection(): Collection
    {
        return $this->rows;
    }

    public function headings(): array
    {
        return ['Chargeur', 'Dossiers affectés', 'En cours', 'Clôturés', 'Volume traité'];
    }

    public function map(mixed $row): array
    {
        return [
            $row['shipper'],
            $row['folders_assigned_count'],
            $row['folders_in_progress_count'],
            $row['folders_closed_count'],
            $row['volume_treated'],
        ];
    }

    public function title(): string
    {
        return 'Situation par chargeur';
    }
}
