import type { Column } from '@/components/data-table';
import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UpcomingArrival {
    vessel: string;
    eta: string;
    folder_number: string;
    bl_number: string;
    container_count: number;
}

interface UpcomingArrivalsProps {
    arrivals: UpcomingArrival[];
}

export default function UpcomingArrivals({ arrivals }: UpcomingArrivalsProps) {
    const columns: Column<UpcomingArrival>[] = [
        {
            header: 'N° Dossier',
            accessorKey: 'folder_number',
            sortable: true,
        },
        {
            header: 'BL',
            accessorKey: 'bl_number',
            sortable: true,
        },
        {
            header: 'Navire',
            accessorKey: 'vessel',
            sortable: true,
        },
        {
            header: 'Date d\'arrivée',
            accessorKey: 'eta',
            sortable: true,
            cell: (item) => new Date(item.eta).toLocaleDateString(),
        },
        {
            header: 'Nb Conteneurs',
            accessorKey: 'container_count',
            sortable: true,
            cell: (item) => <div className="text-center">{item.container_count}</div>,
        },
    ];

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">Prochaines arrivées (7 jours)</CardTitle>
            </CardHeader>
            <CardContent>
                <DataTable
                    data={arrivals}
                    columns={columns}
                    searchPlaceholder="Rechercher par dossier, BL ou navire..."
                    searchKey="folder_number"
                />
            </CardContent>
        </Card>
    );
}
