<?php

namespace App\Actions\Reports;

use App\Actions\Reports\Concerns\ScopesReportsToShipper;
use App\Data\Reports\ReportFilters;
use App\Enums\FolderStatus;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

final readonly class BuildOngoingFoldersReportAction
{
    use ScopesReportsToShipper;

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function handle(ReportFilters $filters, ?User $actingUser = null): Collection
    {
        $query = Folder::query()
            ->with(['customer:id,company_name', 'shipper:id,name', 'loadings'])
            ->whereIn('status', [FolderStatus::PENDING, FolderStatus::IN_PROGRESS, FolderStatus::OVERDUE])
            ->whereBetween('created_at', [$filters->period->startDate, $filters->period->endDate])
            ->when($filters->customerId, fn ($q) => $q->where('customer_id', $filters->customerId))
            ->when($filters->shipperId, fn ($q) => $q->where('shipper_id', $filters->shipperId))
            ->when($filters->vesselId, fn ($q) => $q->where('vessel_id', $filters->vesselId));

        $this->scopeToShipper($query, $actingUser);

        return $query->latest('created_at')->get()->map(fn (Folder $folder) => [
            'folder_number' => $folder->folder_number,
            'customer' => $folder->customer?->company_name,
            'shipper' => $folder->shipper?->name ?? 'Non affecté',
            'status' => $folder->status->value,
            'status_label' => $folder->status->label(),
            'container_count' => $folder->container_count,
            'loaded' => (int) $folder->loadings->sum('loaded_container_count'),
            'eta' => $folder->eta?->toDateString(),
            'ata' => $folder->ata?->toDateString(),
            'loading_deadline' => $folder->loading_deadline?->toDateString(),
            'days_until_deadline' => $folder->loading_deadline
                ? (int) Carbon::now()->startOfDay()->diffInDays($folder->loading_deadline, false)
                : null,
        ])->values();
    }
}
