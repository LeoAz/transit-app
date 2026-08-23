import { PencilIcon, Trash2Icon } from 'lucide-react';

import type { Column } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ReportOption, ReportSchedule } from '@/types/reports';

const DAY_LABELS: Record<number, string> = {
    1: 'lundi',
    2: 'mardi',
    3: 'mercredi',
    4: 'jeudi',
    5: 'vendredi',
    6: 'samedi',
    7: 'dimanche',
};

function labelFor(options: ReportOption[], value: string): string {
    return options.find((o) => o.value === value)?.label ?? value;
}

export function formatFrequency(
    schedule: ReportSchedule,
    frequencies: ReportOption[],
): string {
    const base = labelFor(frequencies, schedule.frequency);
    const time = schedule.send_time.slice(0, 5);

    if (schedule.frequency === 'weekly' && schedule.day_of_week) {
        return `${base} · ${DAY_LABELS[schedule.day_of_week]} · ${time}`;
    }

    if (schedule.frequency === 'monthly' && schedule.day_of_month) {
        return `${base} · le ${schedule.day_of_month} · ${time}`;
    }

    return `${base} · ${time}`;
}

interface GetScheduleColumnsOptions {
    reportTypes: ReportOption[];
    formats: ReportOption[];
    frequencies: ReportOption[];
    onEdit: (schedule: ReportSchedule) => void;
    onDelete: (schedule: ReportSchedule) => void;
}

export function getScheduleColumns({
    reportTypes,
    formats,
    frequencies,
    onEdit,
    onDelete,
}: GetScheduleColumnsOptions): Column<ReportSchedule>[] {
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
            header: 'Périodicité',
            accessorKey: 'frequency',
            cell: (row) => formatFrequency(row, frequencies),
        },
        {
            header: 'Destinataires',
            accessorKey: 'additional_recipients',
            cell: (row) => 1 + (row.additional_recipients?.length ?? 0),
        },
        {
            header: 'Statut',
            accessorKey: 'is_active',
            cell: (row) => (
                <Badge variant={row.is_active ? 'default' : 'secondary'}>
                    {row.is_active ? 'Active' : 'En pause'}
                </Badge>
            ),
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: (row) => (
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(row)}
                    >
                        <PencilIcon className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(row)}
                    >
                        <Trash2Icon className="size-4 text-destructive" />
                    </Button>
                </div>
            ),
        },
    ];
}
