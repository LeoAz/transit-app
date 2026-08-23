import { Head } from '@inertiajs/react';

import { DataTable } from '@/components/data-table';
import type { Column } from '@/components/data-table';
import { dashboard } from '@/routes';
import reports from '@/routes/reports';
import type { ClosedFolderRow, ReportPeriodFilters } from '@/types/reports';
import type { Customer } from '@/types/transit';

import { ReportExportButtons } from './components/ReportExportButtons';
import { ReportFilters } from './components/ReportFilters';
import { ReportHeader } from './components/ReportHeader';

interface ClosedFoldersReportProps {
    rows: ClosedFolderRow[];
    filters: ReportPeriodFilters;
    formData: {
        customers: Customer[];
        shippers: Array<{ id: number; name: string }>;
    };
}

const columns: Column<ClosedFolderRow>[] = [
    { header: 'N° Dossier', accessorKey: 'folder_number', sortable: true },
    { header: 'Client', accessorKey: 'customer', sortable: true },
    { header: 'Statut', accessorKey: 'status_label', sortable: true },
    { header: 'ATA', accessorKey: 'ata', sortable: true },
    { header: 'Date de clôture', accessorKey: 'closed_at', sortable: true },
    {
        header: 'Délai (j. ouvrables)',
        accessorKey: 'delay_working_days',
        sortable: true,
    },
    {
        header: 'En retard',
        accessorKey: 'is_late',
        cell: (row) => (row.is_late ? 'Oui' : 'Non'),
    },
];

export default function ClosedFoldersReport({
    rows,
    filters,
    formData,
}: ClosedFoldersReportProps) {
    const routeUrl = reports.closedFolders.url();

    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Dossiers clôturés" />

            <ReportHeader
                title="Dossiers clôturés"
                description="Historique et statistiques de délais des dossiers clôturés."
                actions={
                    <ReportExportButtons
                        pdfUrl={reports.closedFolders.export.pdf.url({
                            query: filters,
                        })}
                        excelUrl={reports.closedFolders.export.excel.url({
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
                    />
                }
            />
        </div>
    );
}

ClosedFoldersReport.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard.url() },
        { title: 'Rapports', href: reports.index.url() },
        { title: 'Dossiers clôturés', href: reports.closedFolders.url() },
    ],
};
