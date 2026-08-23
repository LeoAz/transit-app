import { Head, Link } from '@inertiajs/react';
import {
    CalendarClockIcon,
    CalendarDaysIcon,
    CheckCircle2Icon,
    ClockIcon,
    MailIcon,
    ShipIcon,
    UsersIcon,
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';
import reports from '@/routes/reports';

const reportCards: Array<{
    title: string;
    description: string;
    href: string;
    icon: React.ElementType;
}> = [
    {
        title: 'Situation par client',
        description:
            "Dossiers, conteneurs commandés / chargés / restants, taux d'avancement.",
        href: reports.clientSituation.url(),
        icon: UsersIcon,
    },
    {
        title: 'Situation par chargeur',
        description: 'Dossiers affectés, en cours, clôturés, volume traité.',
        href: reports.shipperSituation.url(),
        icon: ShipIcon,
    },
    {
        title: 'Dossiers en cours',
        description: 'Vue synthétique des dossiers non clôturés.',
        href: reports.ongoingFolders.url(),
        icon: ClockIcon,
    },
    {
        title: 'Dossiers clôturés',
        description: 'Historique et statistiques de délais.',
        href: reports.closedFolders.url(),
        icon: CheckCircle2Icon,
    },
    {
        title: 'Rapport journalier',
        description: 'Chargements du jour et alertes actives.',
        href: reports.daily.url(),
        icon: CalendarDaysIcon,
    },
    {
        title: 'Ponctualité des arrivées',
        description: 'Analyse ETA vs ATA par compagnie maritime.',
        href: reports.arrivalPunctuality.url(),
        icon: CalendarClockIcon,
    },
];

export default function ReportsIndex() {
    return (
        <div className="flex flex-col gap-8 p-6">
            <Head title="Rapports et situations" />

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Rapports et situations
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Consultez et exportez les rapports opérationnels en PDF
                        ou Excel.
                    </p>
                </div>
                <Button asChild variant="outline">
                    <Link href={reports.scheduled.index.url()}>
                        <MailIcon className="mr-2 size-4" />
                        Rapports programmés
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reportCards.map((report) => (
                    <Link key={report.href} href={report.href}>
                        <Card className="h-full transition-shadow hover:shadow-md">
                            <CardHeader>
                                <report.icon className="mb-2 size-6 text-muted-foreground" />
                                <CardTitle>{report.title}</CardTitle>
                                <CardDescription>
                                    {report.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

ReportsIndex.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard.url() },
        { title: 'Rapports', href: reports.index.url() },
    ],
};
