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
import type { Customer } from '@/types/transit';

interface CustomerFormModalProps {
    customer?: Customer | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CustomerFormModal({
    customer,
    open,
    onOpenChange,
}: CustomerFormModalProps) {
    const isEditing = !!customer;

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            code: '',
            company_name: '',
            address: '',
            contact: '',
            phone: '',
            email: '',
            tax_id: '',
        });

    useEffect(() => {
        if (customer) {
            setData({
                code: customer.code || '',
                company_name: customer.company_name || '',
                address: customer.address || '',
                contact: customer.contact || '',
                phone: customer.phone || '',
                email: customer.email || '',
                tax_id: customer.tax_id || '',
            });
        }

        clearErrors();
    }, [customer, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/referential/customers/${customer.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success('Client mis à jour avec succès.');
                },
            });
        } else {
            post('/referential/customers', {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    toast.success('Client créé avec succès.');
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
                            {isEditing ? 'Modifier le client' : 'Ajouter un client'}
                        </DialogTitle>
                        <DialogDescription>
                            Remplissez les informations ci-dessous pour{' '}
                            {isEditing ? 'modifier le' : 'créer un nouveau'} client.
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
                            <Label htmlFor="company_name" className="text-right">
                                Raison sociale
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="company_name"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    className={errors.company_name ? 'border-destructive' : ''}
                                    required
                                />
                                {errors.company_name && (
                                    <p className="text-destructive mt-1 text-xs">
                                        {errors.company_name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Adresse
                            </Label>
                            <Input
                                id="address"
                                className="col-span-3"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="contact" className="text-right">
                                Contact
                            </Label>
                            <Input
                                id="contact"
                                className="col-span-3"
                                value={data.contact}
                                onChange={(e) => setData('contact', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Téléphone
                            </Label>
                            <Input
                                id="phone"
                                className="col-span-3"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={errors.email ? 'border-destructive' : ''}
                                />
                                {errors.email && (
                                    <p className="text-destructive mt-1 text-xs">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tax_id" className="text-right">
                                NIF/RC
                            </Label>
                            <Input
                                id="tax_id"
                                className="col-span-3"
                                value={data.tax_id}
                                onChange={(e) => setData('tax_id', e.target.value)}
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
