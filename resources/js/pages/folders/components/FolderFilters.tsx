import { X } from 'lucide-react';
import * as React from 'react';
import type { DateRange as CalendarDateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Customer, FolderStatus } from '@/types/transit';

interface FolderFiltersProps {
    customers: Customer[];
    statuses: Array<{ value: FolderStatus; label: string }>;
    statusFilter: string;
    customerFilter: string;
    dateRange: CalendarDateRange | undefined;
    onStatusChange: (status: string) => void;
    onCustomerChange: (customer: string) => void;
    onDateChange: (range: CalendarDateRange | undefined) => void;
    onReset: () => void;
}

export function FolderFilters({
    customers,
    statuses,
    statusFilter,
    customerFilter,
    dateRange,
    onStatusChange,
    onCustomerChange,
    onDateChange,
    onReset,
}: FolderFiltersProps) {
    const isFiltered =
        statusFilter !== 'all' ||
        customerFilter !== 'all' ||
        dateRange !== undefined;

    return (
        <>
            <div className="flex items-center gap-2">
                <DatePickerWithRange
                    date={dateRange}
                    onDateChange={onDateChange}
                />
                {dateRange && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDateChange(undefined)}
                        className="h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="h-9 w-[150px] bg-background">
                    <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {statuses.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                            {s.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={customerFilter} onValueChange={onCustomerChange}>
                <SelectTrigger className="h-9 w-[180px] bg-background">
                    <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les clients</SelectItem>
                    {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                            {c.company_name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {isFiltered && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReset}
                    className="h-9 px-2 text-muted-foreground hover:text-foreground"
                >
                    Effacer
                </Button>
            )}
        </>
    );
}
