import { Head, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import RoleSelect from '@/components/comp-230';
import { DataTable } from '@/components/data-table';
import type { Column } from '@/components/data-table';
import { LoadingModal } from '@/components/loadings/loading-modal';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import folders from '@/routes/folders';
import type {
    Folder,
    FolderFormData,
    FolderStatus,
    Loading,
    Vessel,
} from '@/types/transit';
import type { User } from '@/types/user';

import { FolderAlertBanner } from './components/folder-alert-banner';
import { FolderDocumentsSheet } from './components/folder-documents-sheet';
import { FolderHeader } from './components/folder-header';
import { FolderModals } from './components/folder-modals';
import { FolderSidebar } from './components/folder-sidebar';
import { FolderSummaryCard } from './components/folder-summary-card';
import { FolderStatusBadge } from './components/FolderStatusBadge';

interface FolderShowProps {
    folder: Folder;
    formData?: FolderFormData;
    shippers?: User[];
    vessels?: Vessel[];
    allFolders?: Array<{
        id: number;
        folder_number: string;
        bl_number?: string;
        ata?: string;
        eta?: string;
        status: FolderStatus;
        customer?: { company_name: string };
    }>;
    statuses?: Array<{ value: FolderStatus; label: string }>;
    workingDaysPassed?: number;
}

export default function FolderShow({
    folder,
    formData,
    shippers: legacyShippers = [],
    vessels: legacyVessels = [],
    workingDaysPassed = 0,
}: FolderShowProps) {
    const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
    const [isArrivalModalOpen, setIsArrivalModalOpen] = React.useState(false);
    const [isDocumentsSheetOpen, setIsDocumentsSheetOpen] =
        React.useState(false);
    const [isLoadingModalOpen, setIsLoadingModalOpen] = React.useState(false);
    const [selectedLoading, setSelectedLoading] =
        React.useState<Loading | null>(null);

    const shippersList = formData?.shippers ?? legacyShippers;
    const vesselsList = formData?.vessels ?? legacyVessels;

    const handleDeleteLoading = (loadingId: number) => {
        if (
            window.confirm(
                'Voulez-vous vraiment supprimer cet enregistrement de chargement ?',
            )
        ) {
            router.delete(`/folders/${folder.id}/loadings/${loadingId}`, {
                onSuccess: () =>
                    toast.success('Chargement supprimé avec succès.'),
            });
        }
    };

    const totalLoaded =
        folder.loadings?.reduce(
            (sum, item) => sum + item.loaded_container_count,
            0,
        ) || 0;
    const remainingContainers = Math.max(
        0,
        folder.container_count - totalLoaded,
    );

    const formatDate = (date: string | null | undefined) => {
        if (!date) {
            return 'Non définie';
        }

        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const loadingColumns: Column<Loading>[] = [
        {
            header: 'Date',
            accessorKey: 'loading_date',
            sortable: true,
            cell: (item) => formatDate(item.loading_date),
        },
        {
            header: 'Chargé',
            accessorKey: 'loaded_container_count',
            sortable: true,
            cell: (item) =>
                `${item.loaded_container_count} × ${item.container_type}'`,
        },
        {
            header: 'N° Conteneur(s)',
            accessorKey: 'container_numbers',
            sortable: true,
        },
        {
            header: 'Camion / Chauffeur',
            accessorKey: 'truck_number',
            sortable: true,
            cell: (item) => (
                <div>
                    <div className="font-medium">
                        {item.truck_number} / {item.driver || '—'}
                    </div>
                </div>
            ),
        },
        {
            header: 'Destination',
            accessorKey: 'destination',
            sortable: true,
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: (item) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => {
                            setSelectedLoading(item);
                            setIsLoadingModalOpen(true);
                        }}
                    >
                        <Pencil className="size-3.5 text-muted-foreground" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive"
                        onClick={() => handleDeleteLoading(item.id)}
                    >
                        <Trash2 className="size-3.5" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-background pb-6 text-foreground">
            <Head title={`Dossier ${folder.folder_number}`} />

            <FolderHeader
                folder={folder}
                onOpenAssignModal={() => setIsAssignModalOpen(true)}
                onOpenArrivalModal={() => setIsArrivalModalOpen(true)}
                onOpenDocumentsSheet={() => setIsDocumentsSheetOpen(true)}
                formatDate={formatDate}
            />

            <main className="w-full space-y-6 px-4 pt-4">
                <FolderAlertBanner
                    folder={folder}
                    workingDaysPassed={workingDaysPassed}
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-8">
                        <FolderSummaryCard
                            folder={folder}
                            totalLoaded={totalLoaded}
                            remainingContainers={remainingContainers}
                            formatDate={formatDate}
                        />
                    </div>

                    <div className="lg:col-span-4">
                        <FolderSidebar
                            folder={folder}
                            onOpenAssignModal={() => setIsAssignModalOpen(true)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Détail des chargements effectués
                    </span>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                            setSelectedLoading(null);
                            setIsLoadingModalOpen(true);
                        }}
                        className="h-8 gap-1"
                    >
                        <Plus className="size-3.5" /> Nouveau chargement
                    </Button>
                </div>

                <DataTable
                    data={folder.loadings || []}
                    columns={loadingColumns}
                    searchPlaceholder="Rechercher un chargement..."
                    searchKey="container_numbers"
                />
            </main>

            <LoadingModal
                open={isLoadingModalOpen}
                onOpenChange={setIsLoadingModalOpen}
                folder={folder}
                loading={selectedLoading}
            />

            <FolderModals
                folder={folder}
                shippers={shippersList}
                vessels={vesselsList}
                isAssignModalOpen={isAssignModalOpen}
                setIsAssignModalOpen={setIsAssignModalOpen}
                isArrivalModalOpen={isArrivalModalOpen}
                setIsArrivalModalOpen={setIsArrivalModalOpen}
            />

            <FolderDocumentsSheet
                folder={folder}
                isOpen={isDocumentsSheetOpen}
                onOpenChange={setIsDocumentsSheetOpen}
            />
        </div>
    );
}

FolderShow.layout = (
    page: React.ReactNode & {
        props?: {
            folder?: Folder;
            allFolders?: Array<{
                id: number;
                folder_number: string;
                bl_number?: string;
                ata?: string;
                eta?: string;
                status: FolderStatus;
                customer?: { company_name: string };
            }>;
            statuses?: Array<{ value: FolderStatus; label: string }>;
        };
    },
) => {
    const folder = page?.props?.folder;
    const allFolders = page?.props?.allFolders || [];
    const statuses = page?.props?.statuses || [];

    const folderOptions = allFolders.map((f) => {
        const date = f.ata || f.eta;
        const formattedDate = date
            ? new Date(date)
                  .toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                  })
                  .replace(/\//g, '-')
            : 'N/A';
        const statusLabel =
            statuses.find((s) => s.value === f.status)?.label || f.status;
        const label = `${f.folder_number} / ${f.bl_number || 'Sans BL'} / ${formattedDate} / ${f.customer?.company_name || 'Sans Client'} / ${statusLabel}`;

        return {
            value: f.id.toString(),
            label: label,
            searchLabel: label,
            render: (
                <div className="flex items-center gap-2 overflow-hidden">
                    <span className="truncate">
                        {f.folder_number} / {f.bl_number || 'Sans BL'} /{' '}
                        {formattedDate} /{' '}
                        {f.customer?.company_name || 'Sans Client'} /
                    </span>
                    <FolderStatusBadge status={f.status} statuses={statuses} />
                </div>
            ),
        };
    });

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Tableau de bord', href: dashboard.url() },
                { title: 'Dossiers', href: folders.index.url() },
                {
                    title: (
                        <div className="ml-2 flex items-center">
                            <RoleSelect
                                className="min-w-[350px]"
                                options={folderOptions}
                                value={folder?.id?.toString() || ''}
                                onValueChange={(value) => {
                                    if (
                                        value &&
                                        value !== folder?.id?.toString()
                                    ) {
                                        router.visit(
                                            folders.show.url({
                                                folder: Number(value),
                                            }),
                                        );
                                    }
                                }}
                                placeholder={
                                    folder?.folder_number || 'Sélectionner...'
                                }
                            />
                        </div>
                    ),
                    href: '#',
                },
            ]}
        >
            {page}
        </AppLayout>
    );
};
