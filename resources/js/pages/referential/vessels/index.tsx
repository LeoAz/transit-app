import { Head, router } from '@inertiajs/react';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import type { Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import ReferentialLayout from '@/layouts/referential/layout';
import type { Vessel } from '@/types/transit';
import VesselFormModal from './vessel-form-modal';

interface VesselsIndexProps {
    vessels: Vessel[];
}

export default function VesselsIndex({ vessels }: VesselsIndexProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);

    const handleEdit = (vessel: Vessel) => {
        setEditingVessel(vessel);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingVessel(null);
        setIsModalOpen(true);
    };

    const handleDelete = (vessel: Vessel) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce navire ?')) {
            router.delete(`/referential/vessels/${vessel.id}`, {
                onSuccess: () => toast.success('Navire supprimé avec succès.'),
            });
        }
    };

    const columns: Column<Vessel>[] = [
        { header: 'Nom', accessorKey: 'name', sortable: true },
        { header: 'Compagnie', accessorKey: 'company', sortable: true },
        { header: 'Pavillon', accessorKey: 'flag', sortable: true },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: (vessel) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(vessel)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(vessel)}
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
                { title: 'Navires', href: '/referential/vessels' },
            ]}
        >
            <Head title="Navires" />

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Liste des navires</h2>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau navire
                </Button>
            </div>

            <DataTable data={vessels} columns={columns} />

            <VesselFormModal
                vessel={editingVessel}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </ReferentialLayout>
    );
}
