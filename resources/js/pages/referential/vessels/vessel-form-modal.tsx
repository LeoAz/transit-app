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
import type { Vessel } from '@/types/transit';

interface VesselFormModalProps {
    vessel?: Partial<Vessel> | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccessCreated?: (createdVesselName: string) => void;
}

export default function VesselFormModal({
    vessel,
    open,
    onOpenChange,
    onSuccessCreated,
}: VesselFormModalProps) {
    const isEditing = !!vessel?.id;

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            company: '',
            flag: '',
        });

    useEffect(() => {
        if (open) {
            setData({
                name: vessel?.name || '',
                company: vessel?.company || '',
                flag: vessel?.flag || '',
            });
            clearErrors();
        } else {
            reset();
        }
    }, [vessel, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isEditing) {
            put(`/referential/vessels/${vessel.id}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success('Navire mis à jour avec succès.');
                },
            });
        } else {
            const createdName = data.name;
            post('/referential/vessels', {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    toast.success('Navire créé avec succès.');
                    if (onSuccessCreated) {
                        onSuccessCreated(createdName);
                    }
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
                            {isEditing
                                ? 'Modifier le navire'
                                : 'Ajouter un navire'}
                        </DialogTitle>
                        <DialogDescription>
                            Remplissez les informations ci-dessous pour{' '}
                            {isEditing ? 'modifier le' : 'créer un nouveau'}{' '}
                            navire.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nom *
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className={
                                        errors.name ? 'border-destructive' : ''
                                    }
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="company" className="text-right">
                                Compagnie
                            </Label>
                            <Input
                                id="company"
                                className="col-span-3"
                                value={data.company}
                                onChange={(e) =>
                                    setData('company', e.target.value)
                                }
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="flag" className="text-right">
                                Pavillon
                            </Label>
                            <Input
                                id="flag"
                                className="col-span-3"
                                value={data.flag}
                                onChange={(e) =>
                                    setData('flag', e.target.value)
                                }
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
