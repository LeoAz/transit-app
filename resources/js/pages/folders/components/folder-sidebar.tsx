import { History } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Folder } from '@/types';

interface FolderSidebarProps {
    folder: Folder;
    onOpenAssignModal: () => void;
}

export function FolderSidebar({
    folder,
    onOpenAssignModal,
}: FolderSidebarProps) {
    return (
        <div className="mt-5 space-y-6 lg:col-span-4">
            {/* Agent en charge */}
            <div className="space-y-4 rounded-xl border bg-card p-5">
                <span className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Agent en charge
                </span>

                {folder.shipper ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full border bg-muted text-sm font-bold text-foreground">
                                {folder.shipper.name[0]}
                            </div>
                            <div>
                                <p className="text-sm leading-none font-bold">
                                    {folder.shipper.name}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2 border-t pt-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Email
                                </span>
                                <span className="max-w-[170px] truncate font-medium text-foreground">
                                    {folder.shipper.email}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed py-6 text-center">
                        <p className="mb-3 text-sm text-muted-foreground">
                            Aucun agent n'est affecté à ce dossier.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onOpenAssignModal}
                            className="h-8 text-sm"
                        >
                            Assigner un agent
                        </Button>
                    </div>
                )}
            </div>

            {/* Historique des Affectations (Taille fixe avec Scroll) */}
            <div className="space-y-4 rounded-xl border bg-card p-5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Historique des affectations
                    </span>
                    <History className="size-4 text-muted-foreground" />
                </div>

                {/* Hauteur fixe définie à h-[320px] avec défilement interne */}
                <div className="h-[250px] overflow-y-auto pr-2">
                    <div className="relative space-y-5 pl-4 before:absolute before:top-2 before:bottom-2 before:left-1.5 before:w-px before:bg-border">
                        {folder.assignment_histories?.map((history) => (
                            <div
                                key={history.id}
                                className="relative space-y-1 text-sm"
                            >
                                <div className="absolute top-1.5 -left-[15px] size-2 rounded-full bg-foreground ring-4 ring-background" />

                                <time className="block font-mono text-xs text-muted-foreground tabular-nums">
                                    {new Date(
                                        history.changed_at,
                                    ).toLocaleString('fr-FR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </time>

                                <p className="font-medium text-foreground">
                                    Affecté à {history.new_shipper?.name}
                                </p>

                                {history.user?.name && (
                                    <p className="text-xs text-muted-foreground">
                                        Par :{' '}
                                        <span className="font-medium text-foreground">
                                            {history.user.name}
                                        </span>
                                    </p>
                                )}

                                {history.reason && (
                                    <p className="pt-0.5 text-xs text-muted-foreground italic">
                                        "{history.reason}"
                                    </p>
                                )}
                            </div>
                        ))}

                        {(!folder.assignment_histories ||
                            folder.assignment_histories.length === 0) && (
                            <p className="text-sm text-muted-foreground italic">
                                Aucun historique enregistré.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
