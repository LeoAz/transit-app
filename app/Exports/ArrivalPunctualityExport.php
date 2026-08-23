<?php

namespace App\Exports;

use App\Exports\Concerns\FormatsReportSheet;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;

final readonly class ArrivalPunctualityExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    use FormatsReportSheet;

    /**
     * @param  Collection<int, array<string, mixed>>  $companyRows
     */
    public function __construct(private Collection $companyRows) {}

    public function collection(): Collection
    {
        return $this->companyRows->flatMap(fn (array $group) => $group['folders']);
    }

    public function headings(): array
    {
        return ['Compagnie', 'Navire', 'N° Dossier', 'ETA', 'ATA', 'Écart (jours)', "Statut d'arrivée"];
    }

    public function map(mixed $row): array
    {
        return [
            $row['company'],
            $row['vessel'],
            $row['folder_number'],
            $row['eta'],
            $row['ata'],
            $row['gap_days'],
            $row['punctuality_label'],
        ];
    }

    public function title(): string
    {
        return 'Ponctualité des arrivées';
    }
}
