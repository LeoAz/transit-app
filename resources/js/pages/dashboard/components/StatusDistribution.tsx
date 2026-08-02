import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusDistributionProps {
    stats: Record<string, number>;
}

export default function StatusDistribution({ stats }: StatusDistributionProps) {
    const total = Object.values(stats).reduce((acc, curr) => acc + curr, 0);

    const statuses = [
        { label: 'Non commencé', key: 'pending', color: 'bg-slate-400' },
        { label: 'En cours', key: 'in_progress', color: 'bg-blue-500' },
        { label: 'En dépassement', key: 'overdue', color: 'bg-red-500' },
        { label: 'Clôturé', key: 'closed', color: 'bg-green-500' },
        { label: 'Clôturé en retard', key: 'closed_late', color: 'bg-orange-500' },
    ];

    const maxCount = Math.max(...statuses.map(s => stats[s.key] || 0), 1);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">Répartition par statut</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between h-48 gap-2 pt-4">
                    {statuses.map((status) => {
                        const count = stats[status.key] || 0;
                        const heightPercentage = (count / maxCount) * 100;

                        return (
                            <div key={status.key} className="flex flex-col items-center flex-1 gap-2 h-full group">
                                <div className="relative flex-1 w-full flex items-end justify-center">
                                    <div
                                        className={`w-full rounded-t-sm ${status.color} transition-all duration-500 min-h-[4px] relative`}
                                        style={{ height: `${heightPercentage}%` }}
                                    >
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                            {count}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-center line-clamp-2 h-8 leading-tight">
                                    {status.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-4 pt-4 border-t text-center">
                    <p className="text-sm font-medium">Total: {total} dossiers</p>
                </div>
            </CardContent>
        </Card>
    );
}
