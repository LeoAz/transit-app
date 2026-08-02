import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Product } from '@/types/transit';

interface ProductFormModalProps {
    product?: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProductFormModal({
    product,
    open,
    onOpenChange,
}: ProductFormModalProps) {
    const isEditing = !!product;

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            code: '',
            label: '',
            category: '',
        });

    useEffect(() => {
        if (product) {
            setData({
                code: product.code || '',
                label: product.label || '',
                category: product.category || '',
            });
        }

        clearErrors();
    }, [product, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/referential/products/${product.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success('Produit mis à jour avec succès.');
                },
            });
        } else {
            post('/referential/products', {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    toast.success('Produit créé avec succès.');
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
                        </DialogTitle>
                        <DialogDescription>
                            Remplissez les informations ci-dessous pour{' '}
                            {isEditing ? 'modifier le' : 'créer un nouveau'} produit.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="code" className="text-right">
                                Code
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    className={errors.code ? 'border-destructive' : ''}
                                    required
                                />
                                {errors.code && (
                                    <p className="text-destructive mt-1 text-xs">
                                        {errors.code}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="label" className="text-right">
                                Libellé
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="label"
                                    value={data.label}
                                    onChange={(e) => setData('label', e.target.value)}
                                    className={errors.label ? 'border-destructive' : ''}
                                    required
                                />
                                {errors.label && (
                                    <p className="text-destructive mt-1 text-xs">
                                        {errors.label}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Catégorie
                            </Label>
                            <Input
                                id="category"
                                className="col-span-3"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {isEditing ? 'Enregistrer' : 'Créer'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
