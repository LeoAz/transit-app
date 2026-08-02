<?php

namespace App\Actions;

use App\Enums\FolderStatus;
use App\Models\Folder;

class RecalculateFolderStatus
{
    /**
     * Recalculate and update the folder status based on loaded containers and deadlines.
     */
    public function execute(Folder $folder): void
    {
        $folder->load('loadings');

        $totalLoaded = $folder->loadings->sum('loaded_container_count');
        $isOverdue = $folder->loading_deadline && now()->startOfDay()->greaterThan($folder->loading_deadline);

        if ($totalLoaded >= $folder->container_count) {
            $folder->status = $isOverdue ? FolderStatus::CLOSED_LATE : FolderStatus::CLOSED;
        } elseif ($totalLoaded > 0) {
            $folder->status = $isOverdue ? FolderStatus::OVERDUE : FolderStatus::IN_PROGRESS;
        } elseif ($isOverdue) {
            $folder->status = FolderStatus::OVERDUE;
        } elseif ($folder->ata) {
            $folder->status = FolderStatus::IN_PROGRESS;
        } else {
            $folder->status = FolderStatus::PENDING;
        }

        $folder->save();
    }
}
