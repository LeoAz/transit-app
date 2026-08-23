import { Head } from '@inertiajs/react';

import { DataTable } from '@/components/data-table';
import type { Column } from '@/components/data-table';
import { dashboard } from '@/routes';
import reports from '@/routes/reports';
import type { ClientSituationRow, ReportPeriodFilters } from '@/types/reports';
import type { Customer } from '@/types/transit';

import { ReportExportButtons } from './components/ReportExportButtons';
import { ReportFilters } from './components/ReportFilters';
import { ReportHeader } from './components/ReportHeader';

interface ClientSituationReportProps {
    rows: ClientSituationRow[];
    filters: ReportPeriodFilters;
    formData: { customers: Customer[] };
}

const columns: Column<ClientSituationRow>[] = [
    { header: 'Client', accessorKey: 'customer', sortable: true },
    { header: 'Nb dossiers', accessorKey: 'folders_count', sortable: true },
    {
        header: 'Conteneurs commandés',
        accessorKey: 'containers_ordered',
        sortable: true,
    },
    {
        header: 'Conteneurs chargés',
        accessorKey: 'containers_loaded',
        sortable: true,
    },
    {
        header: 'Conteneurs restants',
        accessorKey: 'containers_remaining',
        sortable: true,
    },
    {
        header: "Taux d'avancement",
        accessorKey: 'progress_rate',
        sortable: true,
        cell: (row) => `${row.progress_rate} %`,
    },
];

export default function ClientSituationReport({
    rows,
    filters,
    formData,
}: ClientSituationReportProps) {
    const routeUrl = reports.clientSituation.url();

    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Situation par client" />

            <ReportHeader
                title="Situation par client"
                description="Dossiers, conteneurs commandés / chargés / restants et taux d'avancement par client."
                actions={
                    <ReportExportButtons
                        pdfUrl={reports.clientSituation.export.pdf.url({
                            query: filters,
                        })}
                        excelUrl={reports.clientSituation.export.excel.url({
                            query: filters,
                        })}
                    />
                }
            />

            <DataTable
                data={rows}
                columns={columns}
                searchPlaceholder="Rechercher un client..."
                renderFilters={
                    <ReportFilters
                        routeUrl={routeUrl}
                        filters={filters}
                        customers={formData.customers}
                    />
                }
            />
        </div>
    );
}

ClientSituationReport.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard.url() },
        { title: 'Rapports', href: reports.index.url() },
        { title: 'Situation par client', href: reports.clientSituation.url() },
    ],
};
