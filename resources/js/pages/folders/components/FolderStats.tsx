import { router } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Clock, FolderIcon } from 'lucide-react';
import * as React from 'react';
import type { DateRange as CalendarDateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import folders from '@/routes/folders';
import type { FolderStatistics } from '@/types/transit';

interface FolderStatsProps {
    stats: FolderStatistics;
    filters?: {
        start_date?: string;
        end_date?: string;
    };
}

export function FolderStats({ stats, filters }: FolderStatsProps) {
    const statsDateRange = React.useMemo<CalendarDateRange | undefined>(() => {
        if (!filters?.start_date || !filters?.end_date) {
            return undefined;
        }

        return {
            from: new Date(filters.start_date),
            to: new Date(filters.end_date),
        };
    }, [filters?.start_date, filters?.end_date]);

    const handleStatsDateChange = (
        range: CalendarDateRange | undefined,
    ): void => {
        if (range?.from && range?.to) {
            router.get(
                folders.index.url(),
                {
                    start_date: range.from.toISOString().split('T')[0],
                    end_date: range.to.toISOString().split('T')[0],
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['stats', 'filters'],
                },
            );
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                    Statistiques de l'année
                </h2>
                <div className="flex items-center gap-2">
                    <DatePickerWithRange
                        date={statsDateRange}
                        onDateChange={handleStatsDateChange}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FolderIcon className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            Total
                        </p>
                        <p className="text-xl font-bold">{stats?.total ?? 0}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
                        <Clock className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            En attente
                        </p>
                        <p className="text-xl font-bold">
                            {stats?.pending ?? 0}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                        <div className="size-2 rounded-full bg-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            En cours
                        </p>
                        <p className="text-xl font-bold text-blue-600">
                            {stats?.in_progress ?? 0}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                        <AlertCircle className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            Retard
                        </p>
                        <p className="text-xl font-bold text-destructive">
                            {stats?.overdue ?? 0}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-all">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600">
                        <CheckCircle2 className="size-5" />
                    </div>
                    <div>
                        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                            Clôturés
                        </p>
                        <p className="text-xl font-bold text-green-600">
                            {stats?.closed ?? 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
