import { Link } from '@inertiajs/react';
import { ArrowLeft, CalendarCheck, FileText, UserPlus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import folders from '@/routes/folders';
import type { Folder } from '@/types/transit';

interface FolderHeaderProps {
    folder: Folder;
    onOpenAssignModal: () => void;
    onOpenArrivalModal: () => void;
    onOpenDocumentsSheet: () => void; // 👈 Nouveau handler
    formatDate: (date: string | null | undefined) => string;
}

export function FolderHeader({
    folder,
    onOpenAssignModal,
    onOpenArrivalModal,
    onOpenDocumentsSheet,
    formatDate,
}: FolderHeaderProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge
                        variant="outline"
                        className="text-xs font-normal text-muted-foreground"
                    >
                        En attente
                    </Badge>
                );
            case 'in_progress':
                return (
                    <Badge
                        variant="secondary"
                        className="bg-blue-500/10 text-xs font-medium text-blue-600 dark:text-blue-400"
                    >
                        En cours
                    </Badge>
                );
            case 'overdue':
                return (
                    <Badge
                        variant="destructive"
                        className="text-xs font-medium"
                    >
                        En dépassement
                    </Badge>
                );
            case 'closed':
                return (
                    <Badge className="border-0 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Clôturé
                    </Badge>
                );
            case 'closed_late':
                return (
                    <Badge className="border-0 bg-amber-500/10 text-xs font-medium text-amber-600 dark:text-amber-400">
                        Clôturé en retard
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline" className="text-sm">
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <header className="sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur">
            <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-9 w-9"
                    >
                        <Link href={folders.index.url()}>
                            <ArrowLeft className="size-4" />
                        </Link>
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-lg font-bold tracking-tight">
                                {folder.folder_number}
                            </h1>
                            {getStatusBadge(folder.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            BL :{' '}
                            <span className="font-mono font-medium text-foreground">
                                {folder.bl_number}
                            </span>{' '}
                            • Créé le {formatDate(folder.created_at)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Bouton Gestion des documents */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenDocumentsSheet}
                        className="h-9 gap-1.5 text-sm"
                    >
                        <FileText className="size-4" />
                        Documents
                        {folder.documents && folder.documents.length > 0 && (
                            <Badge
                                variant="secondary"
                                className="ml-1 h-5 px-1.5 text-xs"
                            >
                                {folder.documents.length}
                            </Badge>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onOpenAssignModal}
                        className="h-9 gap-1.5 text-sm"
                    >
                        <UserPlus className="size-4" />
                        {folder.shipper_id ? 'Réaffecter' : 'Affecter agent'}
                    </Button>

                    {folder.status === 'pending' && (
                        <Button
                            size="sm"
                            onClick={onOpenArrivalModal}
                            className="h-9 gap-1.5 text-sm"
                        >
                            <CalendarCheck className="size-4" />
                            Valider arrivée
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
