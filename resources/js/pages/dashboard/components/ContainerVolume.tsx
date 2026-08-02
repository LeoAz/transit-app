import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContainerVolumeProps {
    stats: {
        total: number;
        by_type: {
            '20ft': number;
            '40ft': number;
            '45ft': number;
        };
        loaded: number;
        remaining: number;
    };
}

export default function ContainerVolume({ stats }: ContainerVolumeProps) {
    const progress = stats.total > 0 ? Math.round((stats.loaded / stats.total) * 100) : 0;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg">Volume conteneurs du mois</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">20'</p>
                            <p className="text-xl font-bold">{stats.by_type['20ft']}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">40'</p>
                            <p className="text-xl font-bold">{stats.by_type['40ft']}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase">45'</p>
                            <p className="text-xl font-bold">{stats.by_type['45ft']}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Chargés: {stats.loaded} / {stats.total}</span>
                            <span className="font-bold">{progress}%</span>
                        </div>
                        <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500 ease-in-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Restants à charger:</span>
                        <span className="text-lg font-bold text-orange-600">{stats.remaining}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
