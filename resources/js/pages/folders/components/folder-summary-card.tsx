import { Container } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Folder } from '@/types/transit';

interface FolderSummaryCardProps {
    folder: Folder;
    totalLoaded: number;
    remainingContainers: number;
    formatDate: (date: string | null | undefined) => string;
}

export function FolderSummaryCard({
    folder,
    totalLoaded,
    remainingContainers,
    formatDate,
}: FolderSummaryCardProps) {
    // Calcul de l'écart ATA - ETA et génération des éléments d'arrivée
    const getArrivalMetrics = () => {
        if (!folder.eta || !folder.ata) return null;

        const etaDate = new Date(folder.eta);
        const ataDate = new Date(folder.ata);
        const diffTime = ataDate.getTime() - etaDate.getTime();
        const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

        let statusBadge = (
            <Badge className="border-emerald-500/20 bg-emerald-500/10 font-medium text-emerald-600">
                ■ À l'heure
            </Badge>
        );

        if (diffDays < 0) {
            statusBadge = (
                <Badge className="border-blue-500/20 bg-blue-500/10 font-medium text-blue-600">
                    ■ En avance
                </Badge>
            );
        } else if (diffDays > 0) {
            statusBadge = (
                <Badge className="border-red-500/20 bg-red-500/10 font-medium text-red-600">
                    ■ En retard
                </Badge>
            );
        }

        const formattedDiff = diffDays > 0 ? `+${diffDays}` : `${diffDays}`;

        return { diffDays, statusBadge, formattedDiff };
    };

    const metrics = getArrivalMetrics();

    // Construction de l'affichage du navire : Nom / Compagnie / Pavillon
    const vesselDisplayName = [
        folder.vessel?.name || folder.vessel_name,
        folder.vessel?.company,
        folder.vessel?.flag,
    ]
        .filter(Boolean)
        .join(' / ');

    return (
        <div className="space-y-6 rounded-xl bg-card text-foreground">
            {/* Header Navire avec le badge et l'écart alignés au même niveau */}
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <span className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Navire Transporteur
                    </span>
                    <h3 className="mt-0.5 text-xl font-bold tracking-tight">
                        {vesselDisplayName || '—'}
                    </h3>
                </div>

                {metrics ? (
                    <div className="flex items-center gap-2">
                        {metrics.statusBadge}
                        <span className="rounded-md border bg-muted/50 px-2 py-0.5 font-mono text-xs text-muted-foreground">
                            Écart : {metrics.formattedDiff} j
                        </span>
                    </div>
                ) : (
                    <Badge variant="secondary" className="px-3 py-1 text-xs">
                        PAS DE DONNÉES
                    </Badge>
                )}
            </div>

            {/* Charge & Délais */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                <div className="flex flex-col justify-between rounded-lg border bg-muted/30 p-4 sm:col-span-5">
                    <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Charge Totale
                    </span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black tracking-tight text-foreground tabular-nums">
                            {totalLoaded} / {folder.container_count}
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">
                            conteneurs {folder.container_type}'
                        </span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium">
                        <Container className="size-5 text-primary" />
                        {remainingContainers > 0 ? (
                            <span className="font-semibold text-amber-600">
                                Reste : {remainingContainers} conteneur(s)
                            </span>
                        ) : (
                            <span className="font-bold text-emerald-600">
                                Chargement complet
                            </span>
                        )}
                    </div>
                </div>

                {/* Grille ETA vs ATA vs Limite */}
                <div className="grid grid-cols-1 gap-3 rounded-lg border bg-muted/10 p-4 sm:col-span-7 sm:grid-cols-3">
                    <div className="flex flex-col justify-center">
                        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            ETA Prévue
                        </span>
                        <span className="text-sm font-medium tabular-nums">
                            {formatDate(folder.eta)}
                        </span>
                    </div>

                    <div className="flex flex-col justify-center">
                        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            ATA Réelle
                        </span>
                        <span
                            className={cn(
                                'text-sm font-medium tabular-nums',
                                folder.ata
                                    ? 'font-bold text-emerald-600 dark:text-emerald-400'
                                    : 'text-muted-foreground italic',
                            )}
                        >
                            {formatDate(folder.ata)}
                        </span>
                    </div>

                    <div className="flex flex-col justify-center">
                        <span className="mb-1 block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Limite Chargement
                        </span>
                        <span
                            className={cn(
                                'text-sm font-medium tabular-nums',
                                folder.status === 'overdue'
                                    ? 'font-bold text-destructive'
                                    : 'text-amber-600 dark:text-amber-400',
                            )}
                        >
                            {formatDate(folder.loading_deadline)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Client & Produit */}
            <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                <div className="space-y-2">
                    <span className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Client
                    </span>
                    <p className="text-base leading-none font-bold">
                        {folder.customer?.company_name || '—'}
                    </p>
                    <div className="space-y-1.5 pt-1 text-sm text-muted-foreground">
                        {folder.customer?.phone && (
                            <p>
                                📞{' '}
                                <span className="font-mono text-foreground">
                                    {folder.customer.phone}
                                </span>
                            </p>
                        )}
                        {folder.customer?.email && (
                            <p>
                                ✉️{' '}
                                <span className="text-foreground">
                                    {folder.customer.email}
                                </span>
                            </p>
                        )}
                        {folder.customer?.address && (
                            <p>
                                📍{' '}
                                <span className="text-foreground">
                                    {folder.customer.address}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Marchandise
                    </span>
                    <div className="flex items-center gap-2">
                        <p className="text-base leading-none font-bold">
                            {folder.product?.label || '—'}
                        </p>
                        {folder.product?.category && (
                            <Badge
                                variant="outline"
                                className="h-5 py-0 text-sm font-normal"
                            >
                                {folder.product.category}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Observations */}
            {folder.notes && (
                <div className="space-y-2 border-t pt-4">
                    <span className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Observations
                    </span>
                    <div className="rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed text-foreground/90">
                        <p className="whitespace-pre-wrap">{folder.notes}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
