import { AlertCircle, AlertTriangle, BellRing, Clock } from 'lucide-react';
import * as React from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Folder } from '@/types';

interface FolderAlertBannerProps {
    folder: Folder;
    workingDaysPassed?: number;
}

export function FolderAlertBanner({
    folder,
    workingDaysPassed = 0,
}: FolderAlertBannerProps) {
    if (
        !folder.ata ||
        folder.status === 'closed' ||
        folder.status === 'closed_late'
    ) {
        return null;
    }

    // J+5 dépassé ou statut en dépassement
    if (folder.status === 'overdue' || workingDaysPassed > 5) {
        return (
            <Alert
                variant="destructive"
                className="border-red-600 bg-red-500/10 text-red-600 dark:text-red-400"
            >
                <AlertCircle className="size-5 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-xs font-bold tracking-wider uppercase">
                    Dépassement — Échéance dépassée (J+5 dépassé)
                </AlertTitle>
                <AlertDescription className="mt-1 text-xs">
                    Le délai de 5 jours ouvrables est dépassé. Dossier au statut{' '}
                    <span className="font-bold">EN DÉPASSEMENT</span>.
                </AlertDescription>
            </Alert>
        );
    }

    // J+4 : Critique
    if (workingDaysPassed === 4) {
        return (
            <Alert className="border-amber-600 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="size-5 text-amber-600" />
                <AlertTitle className="text-xs font-bold tracking-wider uppercase">
                    Alerte Critique — Veille de l'échéance (J+4 ouvrable)
                </AlertTitle>
                <AlertDescription className="mt-1 text-xs">
                    Dernier jour ouvrable avant dépassement de la limite de
                    chargement.
                </AlertDescription>
            </Alert>
        );
    }

    // J+3 : Escalade
    if (workingDaysPassed === 3) {
        return (
            <Alert className="border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400">
                <BellRing className="size-5 text-orange-600" />
                <AlertTitle className="text-xs font-bold tracking-wider uppercase">
                    Escalade — Rappel Superviseur (J+3 ouvrables)
                </AlertTitle>
                <AlertDescription className="mt-1 text-xs">
                    Rappel envoyé au chargeur et notification transmise au
                    superviseur.
                </AlertDescription>
            </Alert>
        );
    }

    // J+2 : Rappel chargeur
    if (workingDaysPassed === 2) {
        return (
            <Alert className="border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400">
                <Clock className="size-5 text-blue-600" />
                <AlertTitle className="text-xs font-bold tracking-wider uppercase">
                    Rappel — Suivi Chargement (J+2 ouvrables)
                </AlertTitle>
                <AlertDescription className="mt-1 text-xs">
                    Rappel systématique transmis au chargeur affecté.
                </AlertDescription>
            </Alert>
        );
    }

    return null;
}
