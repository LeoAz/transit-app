<?php

namespace App\Actions\Reports;

use App\Data\Reports\ReportFilters;
use App\Enums\FolderStatus;
use App\Enums\UserRole;
use App\Models\Loading;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

final readonly class BuildShipperSituationReportAction
{
    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function handle(ReportFilters $filters, ?User $actingUser = null): Collection
    {
        $inProgressStatuses = [FolderStatus::PENDING->value, FolderStatus::IN_PROGRESS->value, FolderStatus::OVERDUE->value];
        $closedStatuses = [FolderStatus::CLOSED->value, FolderStatus::CLOSED_LATE->value];

        $shippers = User::query()
            ->shippers()
            ->when($filters->shipperId, fn (Builder $q) => $q->where('id', $filters->shipperId))
            ->when($actingUser?->role === UserRole::SHIPPER, fn (Builder $q) => $q->where('id', $actingUser->id))
            ->withCount(['folders as folders_assigned_count' => function (Builder $q) use ($filters) {
                $q->whereBetween('created_at', [$filters->period->startDate, $filters->period->endDate]);
            }])
            ->withCount(['folders as folders_in_progress_count' => function (Builder $q) use ($filters, $inProgressStatuses) {
                $q->whereBetween('created_at', [$filters->period->startDate, $filters->period->endDate])
                    ->whereIn('status', $inProgressStatuses);
            }])
            ->withCount(['folders as folders_closed_count' => function (Builder $q) use ($filters, $closedStatuses) {
                $q->whereBetween('created_at', [$filters->period->startDate, $filters->period->endDate])
                    ->whereIn('status', $closedStatuses);
            }])
            ->orderBy('name')
            ->get();

        return $shippers->map(function (User $shipper) use ($filters) {
            $volumeTreated = (int) Loading::query()
                ->whereBetween('loading_date', [$filters->period->startDate, $filters->period->endDate])
                ->whereHas('folder', fn (Builder $q) => $q->where('shipper_id', $shipper->id))
                ->sum('loaded_container_count');

            return [
                'shipper' => $shipper->name,
                'shipper_id' => $shipper->id,
                'folders_assigned_count' => $shipper->folders_assigned_count,
                'folders_in_progress_count' => $shipper->folders_in_progress_count,
                'folders_closed_count' => $shipper->folders_closed_count,
                'volume_treated' => $volumeTreated,
            ];
        })->values();
    }
}
