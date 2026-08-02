<?php

namespace App\Actions\Folders;

use App\Enums\UserRole;
use App\Models\Folder;
use App\Models\User;
use App\Notifications\FolderDeadlineNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class AssignFolderAction
{
    public static function run(Folder $folder, int $shipperId, ?string $reason = null): void
    {
        DB::transaction(function () use ($folder, $shipperId, $reason) {
            $previousShipperId = $folder->shipper_id;

            $folder->update(['shipper_id' => $shipperId]);

            $folder->assignmentHistories()->create([
                'previous_shipper_id' => $previousShipperId,
                'new_shipper_id' => $shipperId,
                'changed_at' => now(),
                'reason' => $reason ?? 'Affectation initiale',
                'user_id' => auth()->id(),
            ]);
        });

        // Envoi asynchrone des notifications aux chargeurs
        $shippers = User::with('preferences')->where('role', UserRole::SHIPPER)->get();
        if ($shippers->isNotEmpty()) {
            Notification::send($shippers, new FolderDeadlineNotification(
                $folder,
                'Affectation de Dossier',
                "Le dossier {$folder->folder_number} a été affecté à un chargeur. Motif : ".($reason ?? 'Initialisation'),
                'info',
                'assignment'
            ));
        }
    }
}
