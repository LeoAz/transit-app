<?php

namespace App\Listeners\Folders;

use App\Events\Folders\FolderAssigned;
use App\Models\User;
use App\Notifications\FolderAssignedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendFolderAssignedNotification implements ShouldQueue
{
    public function handle(FolderAssigned $event): void
    {
        /** @var User|null $shipper */
        $shipper = $event->folder->shipper;

        if ($shipper instanceof User) {
            $reason = $event->folder->assignmentHistories()->latest()->value('reason');
            $shipper->notify(
                new FolderAssignedNotification($event->folder, $reason)
            );
        }
    }
}
