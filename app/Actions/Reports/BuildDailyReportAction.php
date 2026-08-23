<?php

namespace App\Actions\Reports;

use App\Actions\Reports\Concerns\ScopesReportsToShipper;
use App\Data\Reports\ReportFilters;
use App\Enums\FolderStatus;
use App\Models\Folder;
use App\Models\Loading;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

final readonly class BuildDailyReportAction
{
    use ScopesReportsToShipper;

    /**
     * @return array{loadings: Collection<int, array<string, mixed>>, alerts: Collection<int, array<string, mixed>>}
     */
    public function handle(ReportFilters $filters, ?User $actingUser = null): array
    {
        $day = $filters->period->startDate->toDateString();

        $loadingsQuery = Loading::query()
            ->with(['folder.customer', 'folder.shipper', 'user'])
            ->whereDate('loading_date', $day);
        $this->scopeLoadingsToShipper($loadingsQuery, $actingUser);

        $loadings = $loadingsQuery->get()->map(fn (Loading $loading) => [
            'folder_number' => $loading->folder?->folder_number,
            'customer' => $loading->folder?->customer?->company_name,
            'shipper' => $loading->folder?->shipper?->name ?? 'Non affecté',
            'truck_number' => $loading->truck_number,
            'loaded_container_count' => $loading->loaded_container_count,
            'destination' => $loading->destination,
        ])->values();

        $closedStatuses = [FolderStatus::CLOSED->value, FolderStatus::CLOSED_LATE->value];
        $alertsQuery = Folder::query()
            ->with('customer:id,company_name')
            ->where(function (Builder $q) use ($closedStatuses) {
                $q->where('status', FolderStatus::OVERDUE->value)
                    ->orWhere(function (Builder $q2) use ($closedStatuses) {
                        $q2->whereNotIn('status', $closedStatuses)
                            ->whereNotNull('loading_deadline')
                            ->whereDate('loading_deadline', '<=', Carbon::now()->addDays(4));
                    });
            });
        $this->scopeToShipper($alertsQuery, $actingUser);

        $alerts = $alertsQuery->get()->map(fn (Folder $folder) => [
            'folder_number' => $folder->folder_number,
            'customer' => $folder->customer?->company_name,
            'status' => $folder->status->value,
            'status_label' => $folder->status->label(),
            'loading_deadline' => $folder->loading_deadline?->toDateString(),
        ])->values();

        return ['loadings' => $loadings, 'alerts' => $alerts];
    }
}
