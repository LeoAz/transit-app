import { Head, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import type { Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import ReferentialLayout from '@/layouts/referential/layout';
import type { Holiday } from '@/types/transit';
import HolidayFormModal from './holiday-form-modal';

interface HolidaysIndexProps {
    holidays: Holiday[];
}

export default function HolidaysIndex({ holidays }: HolidaysIndexProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);

    const handleEdit = (holiday: Holiday) => {
        setEditingHoliday(holiday);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingHoliday(null);
        setIsModalOpen(true);
    };

    const handleDelete = (holiday: Holiday) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce jour férié ?')) {
            router.delete(`/referential/holidays/${holiday.id}`, {
                onSuccess: () => toast.success('Jour férié supprimé avec succès.'),
            });
        }
    };

    const columns: Column<Holiday>[] = [
        {
            header: 'Date',
            accessorKey: 'date',
            sortable: true,
            cell: (holiday) => format(parseISO(holiday.date), 'PPP', { locale: fr }),
        },
        { header: 'Libellé', accessorKey: 'label', sortable: true },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: (holiday) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(holiday)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(holiday)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <ReferentialLayout
            breadcrumbs={[
                { title: 'Référentiel', href: '/referential/customers' },
                { title: 'Jours fériés', href: '/referential/holidays' },
            ]}
        >
            <Head title="Jours fériés" />

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Liste des jours fériés</h2>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau jour férié
                </Button>
            </div>

            <DataTable data={holidays} columns={columns} />

            <HolidayFormModal
                holiday={editingHoliday}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </ReferentialLayout>
    );
}
