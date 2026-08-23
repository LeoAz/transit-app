import { Head, router } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/confirm-dialog';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import reports from '@/routes/reports';
import type {
    ReportExecution,
    ReportOption,
    ReportSchedule,
} from '@/types/reports';

import { getExecutionColumns } from './components/ExecutionHistoryColumns';
import { ScheduleFormModal } from './components/ScheduleFormModal';
import { getScheduleColumns } from './components/ScheduleTableColumns';

interface ScheduledReportsIndexProps {
    schedules: ReportSchedule[];
    executions: ReportExecution[];
    formData: {
        reportTypes: ReportOption[];
        formats: ReportOption[];
        frequencies: ReportOption[];
    };
}

export default function ScheduledReportsIndex({
    schedules,
    executions,
    formData,
}: ScheduledReportsIndexProps) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedSchedule, setSelectedSchedule] = React.useState<
        ReportSchedule | undefined
    >(undefined);
    const [scheduleToDelete, setScheduleToDelete] = React.useState<
        ReportSchedule | undefined
    >(undefined);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const openCreate = () => {
        setSelectedSchedule(undefined);
        setIsModalOpen(true);
    };

    const openEdit = (schedule: ReportSchedule) => {
        setSelectedSchedule(schedule);
        setIsModalOpen(true);
    };

    const handleDelete = () => {
        if (!scheduleToDelete) {
            return;
        }

        setIsDeleting(true);
        router.delete(
            reports.scheduled.destroy.url({
                reportSchedule: scheduleToDelete.id,
            }),
            {
                onSuccess: () => {
                    toast.success('Programmation supprimée.');
                    setScheduleToDelete(undefined);
                },
                onFinish: () => setIsDeleting(false),
            },
        );
    };

    const columns = React.useMemo(
        () =>
            getScheduleColumns({
                reportTypes: formData.reportTypes,
                formats: formData.formats,
                frequencies: formData.frequencies,
                onEdit: openEdit,
                onDelete: setScheduleToDelete,
            }),
        [formData],
    );

    const executionColumns = React.useMemo(
        () =>
            getExecutionColumns({
                reportTypes: formData.reportTypes,
                formats: formData.formats,
            }),
        [formData],
    );

    return (
        <div className="flex flex-col gap-8 p-6">
            <Head title="Rapports programmés" />

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Rapports programmés
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Programmez l'envoi automatique d'un rapport par e-mail
                        et retrouvez l'historique des envois précédents.
                    </p>
                </div>
                <Button onClick={openCreate}>
                    <PlusIcon className="mr-2 size-4" />
                    Nouvelle programmation
                </Button>
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-medium">Mes programmations</h2>
                <DataTable
                    data={schedules}
                    columns={columns}
                    searchPlaceholder="Rechercher une programmation..."
                />
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-medium">Historique des envois</h2>
                <DataTable
                    data={executions}
                    columns={executionColumns}
                    searchPlaceholder="Rechercher dans l'historique..."
                />
            </div>

            <ScheduleFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                schedule={selectedSchedule}
                reportTypes={formData.reportTypes}
                formats={formData.formats}
                frequencies={formData.frequencies}
            />

            <ConfirmDialog
                open={Boolean(scheduleToDelete)}
                onOpenChange={(open) => !open && setScheduleToDelete(undefined)}
                title="Supprimer la programmation"
                description="Êtes-vous sûr de vouloir supprimer cette programmation ? L'historique des envois précédents sera conservé."
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}

ScheduledReportsIndex.layout = {
    breadcrumbs: [
        { title: 'Tableau de bord', href: dashboard.url() },
        { title: 'Rapports', href: reports.index.url() },
        { title: 'Rapports programmés', href: reports.scheduled.index.url() },
    ],
};
