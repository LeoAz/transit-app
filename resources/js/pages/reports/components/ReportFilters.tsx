import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { ShipIcon, UsersIcon } from 'lucide-react';
import type { DateRange as DayPickerRange } from 'react-day-picker';

import IconSelect from '@/components/comp-233';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import type { ReportPeriodFilters } from '@/types/reports';
import type { Customer, Vessel } from '@/types/transit';

interface ShipperOption {
    id: number;
    name: string;
}

interface ReportFiltersProps {
    routeUrl: string;
    filters: ReportPeriodFilters;
    customers?: Customer[];
    shippers?: ShipperOption[];
    vessels?: Vessel[];
    lockToDay?: boolean;
}

export function ReportFilters({
    routeUrl,
    filters,
    customers,
    shippers,
    vessels,
    lockToDay = false,
}: ReportFiltersProps) {
    const applyFilters = (next: Partial<ReportPeriodFilters>) => {
        router.get(
            routeUrl,
            { ...filters, ...next },
            { preserveState: true, preserveScroll: true },
        );
    };

    const dateRange: DayPickerRange | undefined = filters.start_date
        ? {
              from: new Date(filters.start_date),
              to: filters.end_date ? new Date(filters.end_date) : undefined,
          }
        : undefined;

    return (
        <div className="flex flex-wrap items-center gap-2">
            {!lockToDay && (
                <DatePickerWithRange
                    date={dateRange}
                    onDateChange={(range) =>
                        applyFilters({
                            preset: 'custom',
                            start_date: range?.from
                                ? format(range.from, 'yyyy-MM-dd')
                                : undefined,
                            end_date: range?.to
                                ? format(range.to, 'yyyy-MM-dd')
                                : undefined,
                        })
                    }
                />
            )}

            {customers && (
                <IconSelect
                    className="w-[200px]"
                    placeholder="Tous les clients"
                    searchPlaceholder="Rechercher un client..."
                    emptyMessage="Aucun client trouvé."
                    value={filters.customer_id?.toString() ?? ''}
                    onValueChange={(value) =>
                        applyFilters({
                            customer_id: value ? Number(value) : null,
                        })
                    }
                    options={[
                        { value: '', label: 'Tous les clients' },
                        ...customers.map((customer) => ({
                            value: customer.id.toString(),
                            label: customer.company_name,
                            icon: UsersIcon,
                        })),
                    ]}
                />
            )}

            {shippers && (
                <IconSelect
                    className="w-[200px]"
                    placeholder="Tous les chargeurs"
                    searchPlaceholder="Rechercher un chargeur..."
                    emptyMessage="Aucun chargeur trouvé."
                    value={filters.shipper_id?.toString() ?? ''}
                    onValueChange={(value) =>
                        applyFilters({
                            shipper_id: value ? Number(value) : null,
                        })
                    }
                    options={[
                        { value: '', label: 'Tous les chargeurs' },
                        ...shippers.map((shipper) => ({
                            value: shipper.id.toString(),
                            label: shipper.name,
                            icon: UsersIcon,
                        })),
                    ]}
                />
            )}

            {vessels && (
                <IconSelect
                    className="w-[200px]"
                    placeholder="Tous les navires"
                    searchPlaceholder="Rechercher un navire..."
                    emptyMessage="Aucun navire trouvé."
                    value={filters.vessel_id?.toString() ?? ''}
                    onValueChange={(value) =>
                        applyFilters({
                            vessel_id: value ? Number(value) : null,
                        })
                    }
                    options={[
                        { value: '', label: 'Tous les navires' },
                        ...vessels.map((vessel) => ({
                            value: vessel.id.toString(),
                            label: vessel.name,
                            icon: ShipIcon,
                        })),
                    ]}
                />
            )}

            <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => router.get(routeUrl)}
            >
                Réinitialiser
            </Button>
        </div>
    );
}
