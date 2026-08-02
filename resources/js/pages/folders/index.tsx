import { Head } from '@inertiajs/react';
import * as React from 'react';
import { DataTable } from '@/components/data-table';
import { dashboard } from '@/routes';
import folders from '@/routes/folders';
import type {
    Customer,
    Folder,
    FolderStatus,
    FolderStatistics,
    Product,
    Vessel,
} from '@/types/transit';

import { FolderDialogs } from './components/FolderDialogs';
import { FolderFilters } from './components/FolderFilters';
import { FolderHeader } from './components/FolderHeader';
import { FolderStats } from './components/FolderStats';
import { getFolderColumns } from './components/FolderTableColumns';
import { useFolderActions } from './hooks/useFolderActions';
import { useFolderFilters } from './hooks/useFolderFilters';

export interface FormDataProps {
    customers: Customer[];
    products: Product[];
    vessels?: Vessel[];
    containerTypes?: Array<{ value: number; label: string }>;
    statuses?: Array<{ value: FolderStatus; label: string }>;
}

export interface FoldersIndexProps {
    folders: Folder[];
    stats: FolderStatistics;
    formData: FormDataProps;
    statuses?: Array<{ value: FolderStatus; label: string }>;
    filters?: {
        start_date?: string;
        end_date?: string;
    };
}

export default function FoldersIndex({
    folders: initialFolders = [],
    stats,
    formData,
    statuses: propStatuses,
    filters,
}: FoldersIndexProps) {
    const {
        filteredFolders,
        filters: filterState,
        actions: filterActions,
    } = useFolderFilters(initialFolders);
    const folderActions = useFolderActions();

    const statuses: Array<{ value: FolderStatus; label: string }> =
        propStatuses ??
        formData?.statuses ?? [
            { value: 'pending', label: 'En attente' },
            { value: 'in_progress', label: 'En cours' },
            { value: 'overdue', label: 'En retard' },
            { value: 'closed', label: 'Clôturé' },
            { value: 'closed_late', label: 'Clôturé en retard' },
        ];

    const columns = React.useMemo(
        () =>
            getFolderColumns({
                statuses,
                onEdit: folderActions.openEdit,
                onDelete: folderActions.openDelete,
            }),
        [statuses, folderActions.openEdit, folderActions.openDelete],
    );

    return (
        <div className="flex flex-col gap-8 p-6">
            <Head title="Gestion des Dossiers" />

            <FolderStats stats={stats} filters={filters} />

            <div className="flex h-full flex-1 flex-col gap-4">
                <FolderHeader onCreate={folderActions.openCreate} />

                <DataTable
                    data={filteredFolders}
                    columns={columns}
                    searchPlaceholder="Rechercher..."
                    renderFilters={
                        <FolderFilters
                            customers={formData?.customers ?? []}
                            statuses={statuses}
                            statusFilter={filterState.statusFilter}
                            customerFilter={filterState.customerFilter}
                            dateRange={filterState.dateRange}
                            onStatusChange={filterActions.setStatusFilter}
                            onCustomerChange={filterActions.setCustomerFilter}
                            onDateChange={filterActions.setDateRange}
                            onReset={filterActions.resetFilters}
                        />
                    }
                />
            </div>

            <FolderDialogs
                isModalOpen={folderActions.isModalOpen}
                setIsModalOpen={folderActions.setIsModalOpen}
                isConfirmOpen={folderActions.isConfirmOpen}
                setIsConfirmOpen={folderActions.setIsConfirmOpen}
                selectedFolder={folderActions.selectedFolder}
                processing={folderActions.processing}
                onDelete={folderActions.deleteFolder}
                formData={formData}
            />
        </div>
    );
}

FoldersIndex.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard.url() },
        { title: 'Dossiers', href: folders.index.url() },
    ],
};
