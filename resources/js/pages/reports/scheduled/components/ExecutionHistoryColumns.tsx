import { DownloadIcon } from 'lucide-react';

import type { Column } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import reports from '@/routes/reports';
import type { ReportExecution, ReportOption } from '@/types/reports';

function labelFor(options: ReportOption[], value: string): string {
    return options.find((o) => o.value === value)?.label ?? value;
}

interface GetExecutionColumnsOptions {
    reportTypes: ReportOption[];
    formats: ReportOption[];
}

export function getExecutionColumns({
    reportTypes,
    formats,
}: GetExecutionColumnsOptions): Column<ReportExecution>[] {
    return [
        {
            header: 'Rapport',
            accessorKey: 'report_type',
            cell: (row) => labelFor(reportTypes, row.report_type),
        },
        {
            header: 'Format',
            accessorKey: 'format',
            cell: (row) => labelFor(formats, row.format),
        },
        {
            header: 'Période couverte',
            accessorKey: 'period_start',
            cell: (row) => `${row.period_start} — ${row.period_end}`,
        },
        {
            header: "Date d'envoi",
            accessorKey: 'sent_at',
            cell: (row) => row.sent_at ?? '—',
        },
        {
            header: 'Statut',
            accessorKey: 'status',
            cell: (row) => (
                <Badge
                    variant={row.status === 'sent' ? 'default' : 'destructive'}
                >
                    {row.status === 'sent' ? 'Envoyé' : 'Échec'}
                </Badge>
            ),
        },
        {
            header: 'Fichier',
            accessorKey: 'id',
            cell: (row) =>
                row.status === 'sent' && row.file_path ? (
                    <Button asChild variant="outline" size="sm">
                        <a
                            href={reports.scheduled.executions.download.url({
                                reportExecution: row.id,
                            })}
                        >
                            <DownloadIcon className="mr-2 size-4" />
                            Télécharger
                        </a>
                    </Button>
                ) : (
                    <span className="text-xs text-muted-foreground">
                        Indisponible
                    </span>
                ),
        },
    ];
}
