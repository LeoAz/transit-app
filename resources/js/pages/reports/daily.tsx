import { Head } from '@inertiajs/react';

import { DataTable } from '@/components/data-table';
import type { Column } from '@/components/data-table';
import { dashboard } from '@/routes';
import reports from '@/routes/reports';
import type {
    DailyReportAlert,
    DailyReportLoading,
    ReportPeriodFilters,
} from '@/types/reports';

import { ReportExportButtons } from './components/ReportExportButtons';
import { ReportFilters } from './components/ReportFilters';
import { ReportHeader } from './components/ReportHeader';

interface DailyReportProps {
    loadings: DailyReportLoading[];
    alerts: DailyReportAlert[];
    filters: ReportPeriodFilters;
}

const loadingColumns: Column<DailyReportLoading>[] = [
    { header: 'N° Dossier', accessorKey: 'folder_number', sortable: true },
    { header: 'Client', accessorKey: 'customer', sortable: true },
    { header: 'Chargeur', accessorKey: 'shipper', sortable: true },
    { header: 'N° Camion', accessorKey: 'truck_number', sortable: true },
    {
        header: 'Conteneurs chargés',
        accessorKey: 'loaded_container_count',
        sortable: true,
    },
    { header: 'Destination', accessorKey: 'destination', sortable: true },
];

const alertColumns: Column<DailyReportAlert>[] = [
    { header: 'N° Dossier', accessorKey: 'folder_number', sortable: true },
    { header: 'Client', accessorKey: 'customer', sortable: true },
    { header: 'Statut', accessorKey: 'status_label', sortable: true },
    {
        header: 'Date limite',
        accessorKey: 'loading_deadline',
        sortable: true,
    },
];

export default function DailyReport({
    loadings,
    alerts,
    filters,
}: DailyReportProps) {
    const routeUrl = reports.daily.url();

    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Rapport journalier" />

            <ReportHeader
                title="Rapport journalier"
                description="Chargements du jour et alertes actives."
                actions={
                    <ReportExportButtons
                        pdfUrl={reports.daily.export.pdf.url({
                            query: filters,
                        })}
                        excelUrl={reports.daily.export.excel.url({
                            query: filters,
                        })}
                    />
                }
            />

            <ReportFilters routeUrl={routeUrl} filters={filters} lockToDay />

            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-medium">Chargements du jour</h2>
                <DataTable
                    data={loadings}
                    columns={loadingColumns}
                    searchPlaceholder="Rechercher un chargement..."
                />
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-medium">Alertes actives</h2>
                <DataTable
                    data={alerts}
                    columns={alertColumns}
                    searchPlaceholder="Rechercher une alerte..."
                />
            </div>
        </div>
    );
}

DailyReport.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard.url() },
        { title: 'Rapports', href: reports.index.url() },
        { title: 'Rapport journalier', href: reports.daily.url() },
    ],
};
