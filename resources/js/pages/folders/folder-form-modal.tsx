import { useForm } from '@inertiajs/react';
import {
    BlocksIcon,
    PackageIcon,
    ShipIcon,
    UsersIcon,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import IconSelect from '@/components/comp-233';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
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
import folders from '@/routes/folders';
import type { Customer, Folder, Product, Vessel } from '@/types/transit';

interface FolderFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    folder?: Folder;
    customers?: Customer[];
    products?: Product[];
    vessels?: Vessel[];
    containerTypes?: Array<{ value: number; label: string }>;
}

export function FolderFormModal({
    open,
    onOpenChange,
    folder,
    customers = [],
    products = [],
    vessels = [],
    containerTypes = [],
}: FolderFormModalProps) {
    const isEditing = Boolean(folder);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        bl_number: folder?.bl_number ?? '',
        bl_received_at: folder?.bl_received_at ?? '',
        customer_id: folder?.customer_id ? folder.customer_id.toString() : '',
        product_id: folder?.product_id ? folder.product_id.toString() : '',
        vessel_id: folder?.vessel_id ? folder.vessel_id.toString() : '',
        vessel_name: folder?.vessel_name ?? '',
        container_type: folder?.container_type
            ? folder.container_type.toString()
            : '20',
        container_count: folder?.container_count ?? 1,
        eta: folder?.eta ?? '',
        notes: folder?.notes ?? '',
    });

    React.useEffect(() => {
        if (folder) {
            setData({
                bl_number: folder.bl_number ?? '',
                bl_received_at: folder.bl_received_at ?? '',
                customer_id: folder.customer_id
                    ? folder.customer_id.toString()
                    : '',
                product_id: folder.product_id
                    ? folder.product_id.toString()
                    : '',
                vessel_id: folder.vessel_id ? folder.vessel_id.toString() : '',
                vessel_name: folder.vessel_name ?? '',
                container_type: folder.container_type
                    ? folder.container_type.toString()
                    : '20',
                container_count: folder.container_count ?? 1,
                eta: folder.eta ?? '',
                notes: folder.notes ?? '',
            });
        } else {
            reset();
        }
    }, [folder]);

    const handleVesselChange = (val: string) => {
        setData((current) => ({
            ...current,
            vessel_id: val,
            vessel_name:
                vessels.find((v) => v.id.toString() === val)?.name ??
                current.vessel_name,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && folder) {
            put(folders.update.url({ folder: folder.id }), {
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success('Dossier mis à jour avec succès.');
                },
            });
        } else {
            post(folders.store.url(), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    toast.success('Dossier créé avec succès.');
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Augmentation de la largeur : sm:max-w-2xl md:max-w-3xl */}
            <DialogContent className="sm:max-w-2xl md:max-w-3xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {isEditing
                                ? `Modifier le dossier ${folder?.folder_number}`
                                : 'Nouveau Dossier'}
                        </DialogTitle>
                        <DialogDescription>
                            {isEditing
                                ? 'Mettez à jour les informations du dossier de transit.'
                                : 'Renseignez les informations de base pour créer un dossier.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 py-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bl_number">N° BL *</Label>
                                <Input
                                    id="bl_number"
                                    value={data.bl_number}
                                    onChange={(e) =>
                                        setData('bl_number', e.target.value)
                                    }
                                    placeholder="ex: BL-987654"
                                    className="h-9 text-sm"
                                />
                                {errors.bl_number && (
                                    <p className="text-xs text-destructive">
                                        {errors.bl_number}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bl_received_at">
                                    Date Réception BL *
                                </Label>
                                <DatePicker
                                    date={
                                        data.bl_received_at
                                            ? new Date(data.bl_received_at)
                                            : undefined
                                    }
                                    onDateChange={(date) =>
                                        setData(
                                            'bl_received_at',
                                            date
                                                ? date
                                                      .toISOString()
                                                      .split('T')[0]
                                                : '',
                                        )
                                    }
                                    placeholder="Sélectionner la date de réception"
                                />
                                {errors.bl_received_at && (
                                    <p className="text-xs text-destructive">
                                        {errors.bl_received_at}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customer_id">Client *</Label>
                                <IconSelect
                                    id="customer_id"
                                    options={customers.map((c) => ({
                                        value: c.id.toString(),
                                        label: c.company_name,
                                        icon: UsersIcon,
                                    }))}
                                    value={data.customer_id}
                                    onValueChange={(val) =>
                                        setData('customer_id', val)
                                    }
                                    placeholder="Sélectionner un client"
                                    error={errors.customer_id}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="product_id">
                                    Marchandise *
                                </Label>
                                <IconSelect
                                    id="product_id"
                                    options={products.map((p) => ({
                                        value: p.id.toString(),
                                        label: p.label,
                                        icon: PackageIcon,
                                    }))}
                                    value={data.product_id}
                                    onValueChange={(val) =>
                                        setData('product_id', val)
                                    }
                                    placeholder="Sélectionner un produit"
                                    error={errors.product_id}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="vessel_id">Navire *</Label>
                                {vessels.length > 0 ? (
                                    <IconSelect
                                        id="vessel_id"
                                        options={vessels.map((v) => ({
                                            value: v.id.toString(),
                                            label: v.name,
                                            icon: ShipIcon,
                                        }))}
                                        value={data.vessel_id}
                                        onValueChange={handleVesselChange}
                                        placeholder="Sélectionner un navire"
                                        error={errors.vessel_id ?? errors.vessel_name}
                                    />
                                ) : (
                                    <>
                                        <Input
                                            id="vessel_name"
                                            value={data.vessel_name}
                                            onChange={(e) =>
                                                setData(
                                                    'vessel_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nom du navire"
                                            className="h-9 text-sm"
                                        />
                                        {errors.vessel_name && (
                                            <p className="text-xs text-destructive">
                                                {errors.vessel_name}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="eta">ETA Prévue *</Label>
                                <DatePicker
                                    date={
                                        data.eta
                                            ? new Date(data.eta)
                                            : undefined
                                    }
                                    onDateChange={(date) =>
                                        setData(
                                            'eta',
                                            date
                                                ? date
                                                      .toISOString()
                                                      .split('T')[0]
                                                : '',
                                        )
                                    }
                                    placeholder="Sélectionner l'ETA"
                                />
                                {errors.eta && (
                                    <p className="text-xs text-destructive">
                                        {errors.eta}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="container_type">
                                    Type de Conteneur *
                                </Label>
                                <IconSelect
                                    id="container_type"
                                    options={containerTypes.map((ct) => ({
                                        value: ct.value.toString(),
                                        label: ct.label,
                                        icon: BlocksIcon,
                                    }))}
                                    value={data.container_type}
                                    onValueChange={(val) =>
                                        setData('container_type', val)
                                    }
                                    placeholder="Type"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="container_count">
                                    Nombre de conteneurs *
                                </Label>
                                <Input
                                    id="container_count"
                                    type="number"
                                    min={1}
                                    value={data.container_count}
                                    onChange={(e) =>
                                        setData(
                                            'container_count',
                                            parseInt(e.target.value) || 1,
                                        )
                                    }
                                    className="h-9 text-sm"
                                />
                            </div>
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
                            {isEditing ? 'Enregistrer' : 'Créer le dossier'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
