import { Head } from '@inertiajs/react';
import * as React from 'react';

import { DataTable } from '@/components/data-table';
import type { Column } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import reports from '@/routes/reports';
import type {
    ArrivalPunctualityCompanyRow,
    ArrivalPunctualityFolderRow,
    ReportPeriodFilters,
} from '@/types/reports';
import type { Vessel } from '@/types/transit';

import { ReportExportButtons } from './components/ReportExportButtons';
import { ReportFilters } from './components/ReportFilters';
import { ReportHeader } from './components/ReportHeader';

interface ArrivalPunctualityReportProps {
    rows: ArrivalPunctualityCompanyRow[];
    filters: ReportPeriodFilters;
    formData: { vessels: Vessel[] };
}

const columns: Column<ArrivalPunctualityFolderRow>[] = [
    { header: 'Compagnie', accessorKey: 'company', sortable: true },
    { header: 'Navire', accessorKey: 'vessel', sortable: true },
    { header: 'N° Dossier', accessorKey: 'folder_number', sortable: true },
    { header: 'ETA', accessorKey: 'eta', sortable: true },
    { header: 'ATA', accessorKey: 'ata', sortable: true },
    { header: 'Écart (jours)', accessorKey: 'gap_days', sortable: true },
    {
        header: "Statut d'arrivée",
        accessorKey: 'punctuality_label',
        sortable: true,
    },
];

function punctualityColor(rate: number): string {
    if (rate >= 85) {
        return 'text-emerald-600 dark:text-emerald-400';
    }

    if (rate >= 75) {
        return 'text-amber-600 dark:text-amber-400';
    }

    return 'text-red-600 dark:text-red-400';
}

export default function ArrivalPunctualityReport({
    rows,
    filters,
    formData,
}: ArrivalPunctualityReportProps) {
    const routeUrl = reports.arrivalPunctuality.url();

    const folderRows = React.useMemo(
        () => rows.flatMap((group) => group.folders),
        [rows],
    );

    return (
        <div className="flex flex-col gap-6 p-6">
            <Head title="Ponctualité des arrivées" />

            <ReportHeader
                title="Ponctualité des arrivées"
                description="Analyse ETA vs ATA par compagnie maritime."
                actions={
                    <ReportExportButtons
                        pdfUrl={reports.arrivalPunctuality.export.pdf.url({
                            query: filters,
                        })}
                        excelUrl={reports.arrivalPunctuality.export.excel.url({
                            query: filters,
                        })}
                    />
                }
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {rows.map((group) => (
                    <Card key={group.company}>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {group.company}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-2xl font-semibold ${punctualityColor(group.punctuality_rate)}`}
                            >
                                {group.punctuality_rate} %
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {group.total} arrivée(s) · {group.on_time} à
                                l'heure · {group.early} en avance · {group.late}{' '}
                                en retard
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <DataTable
                data={folderRows}
                columns={columns}
                searchPlaceholder="Rechercher un dossier..."
                renderFilters={
                    <ReportFilters
                        routeUrl={routeUrl}
                        filters={filters}
                        vessels={formData.vessels}
                    />
                }
            />
        </div>
    );
}

ArrivalPunctualityReport.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard.url() },
        { title: 'Rapports', href: reports.index.url() },
        {
            title: 'Ponctualité des arrivées',
            href: reports.arrivalPunctuality.url(),
        },
    ],
};
