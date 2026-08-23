import { Head } from '@inertiajs/react';

import { DataTable } from '@/components/data-table';
import type { Column } from '@/components/data-table';
import { dashboard } from '@/routes';
import reports from '@/routes/reports';
import type { ReportPeriodFilters, ShipperSituationRow } from '@/types/reports';

import { ReportExportButtons } from './components/ReportExportButtons';
import { ReportFilters } from './components/ReportFilters';
import { ReportHeader } from './components/ReportHeader';

interface ShipperSituationReportProps {
    rows: ShipperSituationRow[];
    filters: ReportPeriodFilters;
    formData: { shippers: Array<{ id: number; name: string }> };
}

const columns: Column<ShipperSituationRow>[] = [
    { header: 'Chargeur', accessorKey: 'shipper', sortable: true },
    {
        header: 'Dossiers affectés',
        accessorKey: 'folders_assigned_count',
        sortable: true,
    },
    {
        header: 'En cours',
        accessorKey: 'folders_in_progress_count',
        sortable: true,
    },
    {
        header: 'Clôturés',
        accessorKey: 'folders_closed_count',
        sortable: true,
    },
    { header: 'Volume traité', accessorKey: 'volume_treated', sortable: true },
];

export default function ShipperSituationReport({
    rows,
    filters,
    formData,
}: ShipperSituationReportProps) {
    const routeUrl = reports.shipperSituation.url();

    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Situation par chargeur" />

            <ReportHeader
                title="Situation par chargeur"
                description="Dossiers affectés, en cours, clôturés et volume traité par chargeur."
                actions={
                    <ReportExportButtons
                        pdfUrl={reports.shipperSituation.export.pdf.url({
                            query: filters,
                        })}
                        excelUrl={reports.shipperSituation.export.excel.url({
                            query: filters,
                        })}
                    />
                }
            />

            <DataTable
                data={rows}
                columns={columns}
                searchPlaceholder="Rechercher un chargeur..."
                renderFilters={
                    <ReportFilters
                        routeUrl={routeUrl}
                        filters={filters}
                        shippers={formData.shippers}
                    />
                }
            />
        </div>
    );
}

ShipperSituationReport.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard.url() },
        { title: 'Rapports', href: reports.index.url() },
        {
            title: 'Situation par chargeur',
            href: reports.shipperSituation.url(),
        },
    ],
};
