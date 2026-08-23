<?php

namespace App\Actions\Reports;

use App\Actions\Reports\Concerns\ScopesReportsToShipper;
use App\Data\Reports\ReportFilters;
use App\Models\Folder;
use App\Models\Loading;
use App\Models\User;
use Illuminate\Support\Collection;

final readonly class BuildClientSituationReportAction
{
    use ScopesReportsToShipper;

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function handle(ReportFilters $filters, ?User $actingUser = null): Collection
    {
        $query = Folder::query()
            ->with('customer:id,company_name')
            ->whereBetween('created_at', [$filters->period->startDate, $filters->period->endDate])
            ->when($filters->customerId, fn ($q) => $q->where('customer_id', $filters->customerId));

        $this->scopeToShipper($query, $actingUser);

        return $query->get()
            ->groupBy('customer_id')
            ->map(function (Collection $folders) {
                $ordered = $folders->sum('container_count');
                $loaded = (int) Loading::query()
                    ->whereIn('folder_id', $folders->pluck('id'))
                    ->sum('loaded_container_count');

                return [
                    'customer' => $folders->first()->customer?->company_name ?? 'Client inconnu',
                    'customer_id' => $folders->first()->customer_id,
                    'folders_count' => $folders->count(),
                    'containers_ordered' => $ordered,
                    'containers_loaded' => $loaded,
                    'containers_remaining' => max(0, $ordered - $loaded),
                    'progress_rate' => $ordered > 0 ? round(($loaded / $ordered) * 100, 1) : 0.0,
                ];
            })
            ->sortByDesc('folders_count')
            ->values();
    }
}
