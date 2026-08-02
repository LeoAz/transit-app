import { Head, router } from '@inertiajs/react';
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import type { Column } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import ReferentialLayout from '@/layouts/referential/layout';
import type { Product } from '@/types/transit';
import ProductFormModal from './product-form-modal';

interface ProductsIndexProps {
    products: Product[];
}

export default function ProductsIndex({ products }: ProductsIndexProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleDelete = (product: Product) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            router.delete(`/referential/products/${product.id}`, {
                onSuccess: () => toast.success('Produit supprimé avec succès.'),
            });
        }
    };

    const columns: Column<Product>[] = [
        { header: 'Code', accessorKey: 'code', sortable: true },
        { header: 'Libellé', accessorKey: 'label', sortable: true },
        { header: 'Catégorie', accessorKey: 'category', sortable: true },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: (product) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(product)}
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
                { title: 'Produits', href: '/referential/products' },
            ]}
        >
            <Head title="Produits" />

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Liste des produits</h2>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau produit
                </Button>
            </div>

            <DataTable data={products} columns={columns} />

            <ProductFormModal
                product={editingProduct}
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </ReferentialLayout>
    );
}
