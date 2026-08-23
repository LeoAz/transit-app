<?php

namespace App\Actions\Reports;

use App\Actions\Reports\Concerns\ScopesReportsToShipper;
use App\Data\Reports\ReportFilters;
use App\Enums\FolderStatus;
use App\Models\Folder;
use App\Models\User;
use App\Services\WorkingDaysCalculator;
use Illuminate\Support\Collection;

final readonly class BuildClosedFoldersReportAction
{
    use ScopesReportsToShipper;

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function handle(ReportFilters $filters, ?User $actingUser = null): Collection
    {
        $query = Folder::query()
            ->with('customer:id,company_name')
            ->whereIn('status', [FolderStatus::CLOSED, FolderStatus::CLOSED_LATE])
            ->whereBetween('updated_at', [$filters->period->startDate, $filters->period->endDate])
            ->when($filters->customerId, fn ($q) => $q->where('customer_id', $filters->customerId))
            ->when($filters->shipperId, fn ($q) => $q->where('shipper_id', $filters->shipperId));

        $this->scopeToShipper($query, $actingUser);

        return $query->latest('updated_at')->get()->map(fn (Folder $folder) => [
            'folder_number' => $folder->folder_number,
            'customer' => $folder->customer?->company_name,
            'status' => $folder->status->value,
            'status_label' => $folder->status->label(),
            'ata' => $folder->ata?->toDateString(),
            'closed_at' => $folder->updated_at?->toDateString(),
            'delay_working_days' => $folder->ata
                ? WorkingDaysCalculator::make()->from($folder->ata)->countWorkingDaysBetween($folder->updated_at)
                : null,
            'is_late' => $folder->status === FolderStatus::CLOSED_LATE,
        ])->values();
    }
}
