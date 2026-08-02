import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface DashboardFiltersProps {
    filters: {
        from?: string;
        to?: string;
        customer_id?: string;
        shipper_id?: string;
        status?: string;
    };
}

export default function DashboardFilters({ filters }: DashboardFiltersProps) {
    const handleFilterChange = (key: string, value: string | undefined) => {
        const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };

        router.get('/dashboard', newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        const newFilters = {
            ...filters,
            from: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
            to: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
        };

        router.get('/dashboard', newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const dateRange: DateRange | undefined = filters.from ? {
        from: new Date(filters.from),
        to: filters.to ? new Date(filters.to) : undefined
    } : undefined;

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
                <DatePickerWithRange
                    date={dateRange}
                    onDateChange={handleDateRangeChange}
                />

                <Select
                    value={filters.status || 'all'}
                    onValueChange={(v) => handleFilterChange('status', v)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">Non commencé</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="overdue">En dépassement</SelectItem>
                        <SelectItem value="closed">Clôturé</SelectItem>
                        <SelectItem value="closed_late">Clôturé en retard</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.get('/dashboard', {})}
                    className="text-muted-foreground"
                >
                    Réinitialiser
                </Button>
            </div>
        </div>
    );
}
