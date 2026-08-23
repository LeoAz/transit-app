<?php

namespace App\Exports;

use App\Exports\Concerns\FormatsReportSheet;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;

final readonly class ClientSituationExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    use FormatsReportSheet;

    public function __construct(private Collection $rows) {}

    public function collection(): Collection
    {
        return $this->rows;
    }

    public function headings(): array
    {
        return ['Client', 'Nb dossiers', 'Conteneurs commandés', 'Conteneurs chargés', 'Conteneurs restants', "Taux d'avancement (%)"];
    }

    public function map(mixed $row): array
    {
        return [
            $row['customer'],
            $row['folders_count'],
            $row['containers_ordered'],
            $row['containers_loaded'],
            $row['containers_remaining'],
            $row['progress_rate'],
        ];
    }

    public function title(): string
    {
        return 'Situation par client';
    }
}
