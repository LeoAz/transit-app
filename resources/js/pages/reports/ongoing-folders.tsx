import { Head } from '@inertiajs/react';

import { DataTable } from '@/components/data-table';
import type { Column } from '@/components/data-table';
import { dashboard } from '@/routes';
import reports from '@/routes/reports';
import type { OngoingFolderRow, ReportPeriodFilters } from '@/types/reports';
import type { Customer, Vessel } from '@/types/transit';

import { ReportExportButtons } from './components/ReportExportButtons';
import { ReportFilters } from './components/ReportFilters';
import { ReportHeader } from './components/ReportHeader';

interface OngoingFoldersReportProps {
    rows: OngoingFolderRow[];
    filters: ReportPeriodFilters;
    formData: {
        customers: Customer[];
        shippers: Array<{ id: number; name: string }>;
        vessels: Vessel[];
    };
}

const columns: Column<OngoingFolderRow>[] = [
    { header: 'N° Dossier', accessorKey: 'folder_number', sortable: true },
    { header: 'Client', accessorKey: 'customer', sortable: true },
    { header: 'Chargeur', accessorKey: 'shipper', sortable: true },
    { header: 'Statut', accessorKey: 'status_label', sortable: true },
    {
        header: 'Cdrs commandés',
        accessorKey: 'container_count',
        sortable: true,
    },
    { header: 'Cdrs chargés', accessorKey: 'loaded', sortable: true },
    { header: 'ETA', accessorKey: 'eta', sortable: true },
    { header: 'ATA', accessorKey: 'ata', sortable: true },
    {
        header: 'Date limite',
        accessorKey: 'loading_deadline',
        sortable: true,
    },
    {
        header: 'Jours restants',
        accessorKey: 'days_until_deadline',
        sortable: true,
    },
];

export default function OngoingFoldersReport({
    rows,
    filters,
    formData,
}: OngoingFoldersReportProps) {
    const routeUrl = reports.ongoingFolders.url();

    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Dossiers en cours" />

            <ReportHeader
                title="Dossiers en cours"
                description="Vue synthétique des dossiers non clôturés."
                actions={
                    <ReportExportButtons
                        pdfUrl={reports.ongoingFolders.export.pdf.url({
                            query: filters,
                        })}
                        excelUrl={reports.ongoingFolders.export.excel.url({
                            query: filters,
                        })}
                    />
                }
            />

            <DataTable
                data={rows}
                columns={columns}
                searchPlaceholder="Rechercher un dossier..."
                renderFilters={
                    <ReportFilters
                        routeUrl={routeUrl}
                        filters={filters}
                        customers={formData.customers}
                        shippers={formData.shippers}
                        vessels={formData.vessels}
                    />
                }
            />
        </div>
    );
}

OngoingFoldersReport.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard.url() },
        { title: 'Rapports', href: reports.index.url() },
        { title: 'Dossiers en cours', href: reports.ongoingFolders.url() },
    ],
};
