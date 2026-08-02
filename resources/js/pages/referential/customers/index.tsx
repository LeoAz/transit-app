import { Head, router } from '@inertiajs/react';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import type { Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import ReferentialLayout from '@/layouts/referential/layout';
import type { Customer } from '@/types/transit';
import CustomerFormModal from './customer-form-modal';

interface CustomersIndexProps {
    customers: Customer[];
}

export default function CustomersIndex({ customers }: CustomersIndexProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingCustomer(null);
        setIsModalOpen(true);
    };

    const handleDelete = (customer: Customer) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
            router.delete(`/referential/customers/${customer.id}`, {
                onSuccess: () => toast.success('Client supprimé avec succès.'),
            });
        }
    };

    const columns: Column<Customer>[] = [
        { header: 'Code', accessorKey: 'code', sortable: true },
        { header: 'Raison sociale', accessorKey: 'company_name', sortable: true },
        { header: 'Contact', accessorKey: 'contact' },
        { header: 'Téléphone', accessorKey: 'phone' },
        { header: 'Email', accessorKey: 'email' },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: (customer) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(customer)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(customer)}
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
                { title: 'Clients', href: '/referential/customers' },
            ]}
        >
            <Head title="Clients" />

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Liste des clients</h2>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau client
                </Button>
            </div>

            <DataTable data={customers} columns={columns} />

            <CustomerFormModal
                customer={editingCustomer}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </ReferentialLayout>
    );
}
