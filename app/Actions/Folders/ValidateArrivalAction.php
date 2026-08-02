<?php

namespace App\Actions\Folders;

use App\Enums\FolderStatus;
use App\Enums\UserRole;
use App\Models\Folder;
use App\Models\User;
use App\Notifications\FolderDeadlineNotification;
use App\Services\WorkingDaysCalculator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;

class ValidateArrivalAction
{
    public static function run(Folder $folder, string $ata, ?string $vesselName = null, ?string $notes = null): void
    {
        $ataDate = Carbon::parse($ata);
        $deadline = WorkingDaysCalculator::make()->from($ataDate)->addWorkingDays(5);

        $folder->update([
            'ata' => $ataDate,
            'vessel_name' => $vesselName ?? $folder->vessel_name,
            'loading_deadline' => $deadline,
            'status' => FolderStatus::IN_PROGRESS,
            'notes' => trim($folder->notes."\nValidation ATA: ".$notes),
        ]);

        $shippers = User::with('preferences')->where('role', UserRole::SHIPPER)->get();
        if ($shippers->isNotEmpty()) {
            Notification::send($shippers, new FolderDeadlineNotification(
                $folder,
                'Arrivée Navire Confirmée (ATA)',
                "L'arrivée du navire {$folder->vessel_name} a été validée pour le dossier {$folder->folder_number}. Le compte à rebours de 5 jours ouvrables est lancé.",
                'info',
                'ata'
            ));
        }
    }
}
