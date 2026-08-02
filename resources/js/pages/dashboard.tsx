import { Deferred, Head } from '@inertiajs/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dashboard } from '@/routes';
import ContainerVolume from './dashboard/components/ContainerVolume';
import DashboardFilters from './dashboard/components/DashboardFilters';
import KPIStats from './dashboard/components/KPIStats';
import ShipperPerformance from './dashboard/components/ShipperPerformance';
import StatusDistribution from './dashboard/components/StatusDistribution';
import UpcomingArrivals from './dashboard/components/UpcomingArrivals';

interface DashboardProps {
    stats?: {
        kpis: any;
        containers: any;
        status_distribution: any;
        shipper_performance: any;
        upcoming_arrivals: any;
    };
    filters: any;
}

export default function Dashboard({ stats, filters }: DashboardProps) {
    return (
        <>
            <Head title="Tableau de bord" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Tableau de bord statistique</h1>
                </div>

                <DashboardFilters filters={filters} />

                <Deferred data="stats" fallback={<DashboardSkeleton />}>
                    {stats && (
                        <div className="space-y-6">
                            {/* Zone 1: KPIs */}
                            <KPIStats stats={stats.kpis} />

                            <div className="grid gap-4 md:grid-cols-2">
                                {/* Zone 2: Volume Conteneurs */}
                                <ContainerVolume stats={stats.containers} />

                                {/* Zone 3: Répartition par statut */}
                                <StatusDistribution stats={stats.status_distribution} />
                            </div>

                            <Tabs defaultValue="performance" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 max-w-md">
                                    <TabsTrigger value="performance">Performance Chargeurs</TabsTrigger>
                                    <TabsTrigger value="arrivals">Prochaines Arrivées</TabsTrigger>
                                </TabsList>
                                <TabsContent value="performance" className="mt-4">
                                    <ShipperPerformance data={stats.shipper_performance} />
                                </TabsContent>
                                <TabsContent value="arrivals" className="mt-4">
                                    <UpcomingArrivals arrivals={stats.upcoming_arrivals} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </Deferred>
            </div>
        </>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-64 w-full rounded-xl" />
                ))}
            </div>
            <div className="grid gap-4">
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Tableau de bord',
            href: dashboard(),
        },
    ],
};
