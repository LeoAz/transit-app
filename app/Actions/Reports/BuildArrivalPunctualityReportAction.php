<?php

namespace App\Actions\Reports;

use App\Actions\Reports\Concerns\ScopesReportsToShipper;
use App\Data\Reports\ReportFilters;
use App\Enums\ArrivalPunctuality;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Support\Collection;

final readonly class BuildArrivalPunctualityReportAction
{
    use ScopesReportsToShipper;

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function handle(ReportFilters $filters, ?User $actingUser = null): Collection
    {
        $query = Folder::query()
            ->with('vessel:id,name,company')
            ->whereNotNull('ata')
            ->whereBetween('ata', [$filters->period->startDate, $filters->period->endDate])
            ->when($filters->vesselId, fn ($q) => $q->where('vessel_id', $filters->vesselId));

        $this->scopeToShipper($query, $actingUser);

        $folderRows = $query->get()->map(function (Folder $folder) {
            $punctuality = ArrivalPunctuality::fromDates($folder->eta, $folder->ata);

            return [
                'company' => $folder->vessel?->company ?? 'Compagnie inconnue',
                'vessel' => $folder->vessel?->name ?? $folder->vessel_name,
                'folder_number' => $folder->folder_number,
                'eta' => $folder->eta->toDateString(),
                'ata' => $folder->ata->toDateString(),
                'gap_days' => (int) $folder->ata->diffInDays($folder->eta, false),
                'punctuality' => $punctuality->value,
                'punctuality_label' => $punctuality->label(),
            ];
        });

        return $folderRows->groupBy('company')->map(function (Collection $rows, string $company) {
            $onTime = $rows->where('punctuality', ArrivalPunctuality::ON_TIME->value)->count();
            $early = $rows->where('punctuality', ArrivalPunctuality::EARLY->value)->count();
            $late = $rows->where('punctuality', ArrivalPunctuality::LATE->value)->count();
            $total = $rows->count();

            return [
                'company' => $company,
                'total' => $total,
                'on_time' => $onTime,
                'early' => $early,
                'late' => $late,
                'punctuality_rate' => $total > 0 ? round((($onTime + $early) / $total) * 100, 1) : 0.0,
                'folders' => $rows->values(),
            ];
        })->sortByDesc('total')->values();
    }
}
