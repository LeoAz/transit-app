import { AlertTriangleIcon, CheckCircleIcon, ClockIcon, FolderIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KPIStatsProps {
    stats: {
        in_progress: number;
        closed_this_month: number;
        active_alerts: number;
        overdue: number;
    };
}

export default function KPIStats({ stats }: KPIStatsProps) {
    const kpis = [
        {
            title: 'Dossiers en cours',
            value: stats.in_progress,
            icon: FolderIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
        },
        {
            title: 'Clôturés du mois',
            value: stats.closed_this_month,
            icon: CheckCircleIcon,
            color: 'text-green-600',
            bg: 'bg-green-100',
        },
        {
            title: 'Alertes actives',
            value: stats.active_alerts,
            icon: AlertTriangleIcon,
            color: 'text-orange-600',
            bg: 'bg-orange-100',
        },
        {
            title: 'En dépassement',
            value: stats.overdue,
            icon: ClockIcon,
            color: 'text-red-600',
            bg: 'bg-red-100',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
                <Card key={kpi.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                        <div className={`${kpi.bg} ${kpi.color} rounded-full p-2`}>
                            <kpi.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{kpi.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
