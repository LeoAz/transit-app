import type { Column } from '@/components/data-table';
import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ShipperPerformanceData {
    name: string;
    in_progress: number;
    closed: number;
    avg_delay: string;
    punctuality: number;
}

interface ShipperPerformanceProps {
    data: ShipperPerformanceData[];
}

export default function ShipperPerformance({ data }: ShipperPerformanceProps) {
    const getPunctualityColor = (value: number) => {
        if (value >= 85) {
            return 'text-green-600 font-bold';
        }

        if (value >= 75) {
            return 'text-orange-600 font-bold';
        }

        return 'text-red-600 font-bold';
    };

    const columns: Column<ShipperPerformanceData>[] = [
        {
            header: 'Chargeur',
            accessorKey: 'name',
            sortable: true,
        },
        {
            header: 'En cours',
            accessorKey: 'in_progress',
            sortable: true,
            cell: (item) => <div className="text-center">{item.in_progress}</div>,
        },
        {
            header: 'Clôturés',
            accessorKey: 'closed',
            sortable: true,
            cell: (item) => <div className="text-center">{item.closed}</div>,
        },
        {
            header: 'Délai moyen',
            accessorKey: 'avg_delay',
            sortable: true,
        },
        {
            header: 'Ponctualité',
            accessorKey: 'punctuality',
            sortable: true,
            cell: (item) => (
                <div className={`text-right ${getPunctualityColor(item.punctuality)}`}>
                    {item.punctuality}%
                </div>
            ),
        },
    ];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">Performance chargeurs (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable
                    data={data}
                    columns={columns}
                    searchPlaceholder="Rechercher un chargeur..."
                    searchKey="name"
                />
            </CardContent>
        </Card>
    );
}
