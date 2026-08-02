<?php

namespace App\Actions;

use App\Enums\FolderStatus;
use App\Models\Folder;
use App\Models\Holiday;
use Carbon\Carbon;

class ValidateShipArrival
{
    public function execute(Folder $folder, string $ataDate, ?string $notes = null): void
    {
        $ata = Carbon::parse($ataDate)->startOfDay();
        $eta = Carbon::parse($folder->eta)->startOfDay();

        // 1. Calcul des 5 jours ouvrables à partir de l'ATA (J0 = jour d'ATA)
        $loadingDeadline = $this->calculateWorkingDaysDeadline($ata, 5);

        // 2. Calcul du statut du dossier et passage automatique à "En cours"
        $status = FolderStatus::IN_PROGRESS;

        // Si l'ATA saisie est déjà au-delà de la date limite théorique
        if (now()->startOfDay()->greaterThan($loadingDeadline)) {
            $status = FolderStatus::OVERDUE;
        }

        $folder->update([
            'ata' => $ata->format('Y-m-d'),
            'loading_deadline' => $loadingDeadline->format('Y-m-d'),
            'status' => $status,
            'notes' => $notes ? trim($folder->notes."\n[ATA] ".$notes) : $folder->notes,
        ]);
    }

    private function calculateWorkingDaysDeadline(Carbon $startDate, int $workingDays): Carbon
    {
        $holidays = Holiday::pluck('date')->map(fn ($d) => Carbon::parse($d)->format('Y-m-d'))->toArray();
        $currentDate = $startDate->copy();
        $addedDays = 0;

        while ($addedDays < $workingDays) {
            $currentDate->addDay();

            // Vérifie si ce n'est ni un week-end ni un jour férié
            if (! $currentDate->isWeekend() && ! in_array($currentDate->format('Y-m-d'), $holidays)) {
                $addedDays++;
            }
        }

        return $currentDate;
    }
}
