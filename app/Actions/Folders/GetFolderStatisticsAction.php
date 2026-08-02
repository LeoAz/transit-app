<?php

namespace App\Actions\Folders;

use App\Data\DateRange;
use App\Models\Folder;

final readonly class GetFolderStatisticsAction
{
    /**
     * @return array<string, mixed>
     */
    public function handle(DateRange $dateRange): array
    {
        $query = Folder::query()->whereBetween('created_at', [
            $dateRange->startDate,
            $dateRange->endDate,
        ]);

        return [
            'total' => $query->clone()->count(),
            'pending' => $query->clone()->where('status', 'pending')->count(),
            'completed' => $query->clone()->where('status', 'completed')->count(),
        ];
    }
}
