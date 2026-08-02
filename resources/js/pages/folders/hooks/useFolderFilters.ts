import * as React from 'react';
import type { DateRange as CalendarDateRange } from 'react-day-picker';
import type { Folder } from '@/types/transit';

export function useFolderFilters(initialFolders: Folder[] = []) {
    const [statusFilter, setStatusFilter] = React.useState<string>('all');
    const [customerFilter, setCustomerFilter] = React.useState<string>('all');
    const [dateRange, setDateRange] = React.useState<
        CalendarDateRange | undefined
    >(undefined);

    const filteredFolders = React.useMemo(() => {
        return initialFolders.filter((folder: Folder) => {
            if (statusFilter !== 'all' && folder.status !== statusFilter) {
                return false;
            }

            if (
                customerFilter !== 'all' &&
                folder.customer_id?.toString() !== customerFilter
            ) {
                return false;
            }

            if (dateRange?.from) {
                const blDate = folder.bl_received_at
                    ? new Date(folder.bl_received_at)
                    : null;

                if (!blDate) {
                    return false;
                }

                const compareDate = new Date(
                    blDate.getFullYear(),
                    blDate.getMonth(),
                    blDate.getDate(),
                );
                const fromDate = new Date(
                    dateRange.from.getFullYear(),
                    dateRange.from.getMonth(),
                    dateRange.from.getDate(),
                );

                if (compareDate < fromDate) {
                    return false;
                }

                if (dateRange.to) {
                    const toDate = new Date(
                        dateRange.to.getFullYear(),
                        dateRange.to.getMonth(),
                        dateRange.to.getDate(),
                    );

                    if (compareDate > toDate) {
                        return false;
                    }
                }
            }

            return true;
        });
    }, [initialFolders, statusFilter, customerFilter, dateRange]);

    const resetFilters = React.useCallback(() => {
        setStatusFilter('all');
        setCustomerFilter('all');
        setDateRange(undefined);
    }, []);

    return {
        filteredFolders,
        filters: {
            statusFilter,
            customerFilter,
            dateRange,
        },
        actions: {
            setStatusFilter,
            setCustomerFilter,
            setDateRange,
            resetFilters,
        },
    };
}
