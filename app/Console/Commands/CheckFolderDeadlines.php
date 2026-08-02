<?php

namespace App\Console\Commands;

use App\Enums\FolderStatus;
use App\Enums\UserRole;
use App\Models\Folder;
use App\Models\Holiday;
use App\Models\User;
use App\Notifications\FolderDeadlineNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class CheckFolderDeadlines extends Command
{
    protected $signature = 'folders:check-deadlines';

    protected $description = 'Vérification et distribution des alertes ciblées par dossier (UserRole) selon la table user_preferences';

    public function handle(): void
    {
        $holidays = Holiday::pluck('date')
            ->map(fn ($d) => Carbon::parse($d)->format('Y-m-d'))
            ->toArray();

        // Groupe des administrateurs et superviseurs
        $supervisorsAndAdmins = User::with('preferences')
            ->whereIn('role', [UserRole::ADMIN, UserRole::SUPERVISOR])
            ->get();

        // Groupe des agents de saisie
        $entryAgents = User::with('preferences')
            ->where('role', UserRole::ENTRY_AGENT)
            ->get();

        $today = now()->startOfDay();

        // -------------------------------------------------------------
        // A. ALERTES ANTICIPATIVES (ETA - Type: 'eta')
        // -------------------------------------------------------------
        $pendingFolders = Folder::with(['shipper.preferences'])
            ->whereNull('ata')
            ->whereNotIn('status', [FolderStatus::CLOSED, FolderStatus::CLOSED_LATE])
            ->get();

        foreach ($pendingFolders as $folder) {
            if (! $folder->eta) {
                continue;
            }

            $etaDate = Carbon::parse($folder->eta)->startOfDay();
            $daysToEta = $today->diffInDays($etaDate, false);

            /** @var User|null $assignedShipper */
            $assignedShipper = $folder->shipper;

            // J-7 : Agent Saisie + Chargeur du dossier
            if ($daysToEta === 7) {
                $recipients = $entryAgents->collect();
                if ($assignedShipper) {
                    $recipients->push($assignedShipper);
                }

                Notification::send($recipients->unique('id'), new FolderDeadlineNotification(
                    $folder,
                    'Arrivée Navire à J-7',
                    "Le navire {$folder->vessel_name} est attendu dans 7 jours (Dossier {$folder->folder_number}).",
                    'info',
                    'eta'
                ));
            }
            // J-3 : Agent Saisie + Chargeur du dossier
            elseif ($daysToEta === 3) {
                $recipients = $entryAgents->collect();
                if ($assignedShipper) {
                    $recipients->push($assignedShipper);
                }

                Notification::send($recipients->unique('id'), new FolderDeadlineNotification(
                    $folder,
                    'Arrivée Navire à J-3',
                    "Le navire {$folder->vessel_name} est attendu dans 3 jours (Dossier {$folder->folder_number}).",
                    'warning',
                    'eta'
                ));
            }
            // J-0 : Chargeur du dossier + Superviseurs & Admins
            elseif ($daysToEta === 0) {
                $recipients = $supervisorsAndAdmins->collect();
                if ($assignedShipper) {
                    $recipients->push($assignedShipper);
                }

                Notification::send($recipients->unique('id'), new FolderDeadlineNotification(
                    $folder,
                    "Arrivée Navire Aujourd'hui",
                    "Le navire {$folder->vessel_name} arrive aujourd'hui (Dossier {$folder->folder_number}).",
                    'critical',
                    'eta'
                ));
            }
        }

        // -------------------------------------------------------------
        // B. ALERTES OPÉRATIONNELLES (ATA - Types: 'ata' & 'overdue')
        // -------------------------------------------------------------
        $arrivedFolders = Folder::with(['shipper.preferences'])
            ->whereNotNull('ata')
            ->whereNotIn('status', [FolderStatus::CLOSED, FolderStatus::CLOSED_LATE])
            ->get();

        foreach ($arrivedFolders as $folder) {
            $workingDaysPassed = $this->calculateWorkingDaysPassed(
                Carbon::parse($folder->ata),
                $today,
                $holidays
            );

            /** @var User|null $assignedShipper */
            $assignedShipper = $folder->shipper;

            // J+2 Ouvrables : Chargeur du dossier uniquement
            if ($workingDaysPassed === 2) {
                if ($assignedShipper) {
                    $assignedShipper->notify(new FolderDeadlineNotification(
                        $folder,
                        'Rappel Chargement (J+2)',
                        "Suivi systématique du dossier {$folder->folder_number} à J+2 ouvrables.",
                        'info',
                        'ata'
                    ));
                }
            }
            // J+3 Ouvrables : Chargeur du dossier + Superviseurs (Escalade)
            elseif ($workingDaysPassed === 3) {
                $recipients = $supervisorsAndAdmins->collect();
                if ($assignedShipper) {
                    $recipients->push($assignedShipper);
                }

                Notification::send($recipients->unique('id'), new FolderDeadlineNotification(
                    $folder,
                    'Escalade Chargement (J+3)',
                    "Escalade : Le dossier {$folder->folder_number} est à J+3 ouvrables.",
                    'warning',
                    'overdue'
                ));
            }
            // J+4 Ouvrables : Critique (Chargeur du dossier + Agent Saisie + Admins/Superviseurs)
            elseif ($workingDaysPassed === 4) {
                $recipients = $supervisorsAndAdmins->merge($entryAgents);
                if ($assignedShipper) {
                    $recipients->push($assignedShipper);
                }

                Notification::send($recipients->unique('id'), new FolderDeadlineNotification(
                    $folder,
                    'Alerte Critique (J+4)',
                    "Dernier jour ouvrable avant dépassement de l'échéance pour le dossier {$folder->folder_number} !",
                    'critical',
                    'overdue'
                ));
            }
            // J+5 Ouvrables dépassé : Dépassement
            elseif ($workingDaysPassed >= 5 && $folder->status !== FolderStatus::OVERDUE) {
                $folder->update(['status' => FolderStatus::OVERDUE]);

                $recipients = $supervisorsAndAdmins->merge($entryAgents);
                if ($assignedShipper) {
                    $recipients->push($assignedShipper);
                }

                Notification::send($recipients->unique('id'), new FolderDeadlineNotification(
                    $folder,
                    'Statut : EN DÉPASSEMENT',
                    "Le délai de 5 jours ouvrables est dépassé pour le dossier {$folder->folder_number}.",
                    'danger',
                    'overdue'
                ));
            }
        }

        $this->info('Scan des échéances terminé avec succès.');
    }

    private function calculateWorkingDaysPassed(Carbon $startDate, Carbon $endDate, array $holidays): int
    {
        $current = $startDate->copy()->addDay()->startOfDay();
        $target = $endDate->copy()->startOfDay();
        $workingDays = 0;

        while ($current->lessThanOrEqualTo($target)) {
            if (! $current->isWeekend() && ! in_array($current->format('Y-m-d'), $holidays)) {
                $workingDays++;
            }
            $current->addDay();
        }

        return $workingDays;
    }
}
