import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { ContainerType, Folder, Loading } from '@/types';

interface LoadingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    folder: Folder;
    loading?: Loading | null;
}

export function LoadingModal({
    open,
    onOpenChange,
    folder,
    loading,
}: LoadingModalProps) {
    // Calcul du nombre maximal de conteneurs restant à charger pour ce dossier
    const maxAllowedContainers = React.useMemo(() => {
        const totalOtherLoaded =
            folder.loadings
                ?.filter((item) => item.id !== loading?.id)
                .reduce((sum, item) => sum + item.loaded_container_count, 0) ||
            0;

        return Math.max(1, folder.container_count - totalOtherLoaded);
    }, [folder, loading]);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            loading_date: '',
            loaded_container_count: 1,
            container_type: (folder.container_type || 40) as ContainerType,
            container_numbers: '',
            truck_number: '',
            carrier: '',
            driver: '',
            destination: '',
            notes: '',
        });

    React.useEffect(() => {
        if (loading) {
            setData({
                loading_date: loading.loading_date
                    ? new Date(loading.loading_date).toISOString().split('T')[0]
                    : '',
                loaded_container_count: Math.min(
                    loading.loaded_container_count || 1,
                    maxAllowedContainers,
                ),
                container_type: folder.container_type, // Forcé au type du dossier
                container_numbers: loading.container_numbers || '',
                truck_number: loading.truck_number || '',
                carrier: loading.carrier || '',
                driver: loading.driver || '',
                destination: loading.destination || '',
                notes: loading.notes || '',
            });
        } else {
            reset();
            // Initialisation par défaut : type du dossier et 1 conteneur (limité au max autorisé)
            setData({
                loading_date: '',
                loaded_container_count: Math.min(1, maxAllowedContainers),
                container_type: folder.container_type,
                container_numbers: '',
                truck_number: '',
                carrier: '',
                driver: '',
                destination: '',
                notes: '',
            });
        }
        clearErrors();
    }, [loading, open, folder, maxAllowedContainers]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation côté client pour la limite de conteneurs
        if (data.loaded_container_count > maxAllowedContainers) {
            toast.error(
                `Le nombre de conteneurs ne peut pas dépasser ${maxAllowedContainers} (solde restant pour ce dossier).`,
            );
            return;
        }

        if (loading) {
            put(`/folders/${folder.id}/loadings/${loading.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success('Chargement mis à jour avec succès.');
                },
            });
        } else {
            post(`/folders/${folder.id}/loadings`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    toast.success('Chargement enregistré avec succès.');
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[750px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>
                            {loading
                                ? 'Modifier le chargement'
                                : "Saisie d'un chargement"}
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Enregistrez les informations de chargement pour le
                            dossier{' '}
                            <span className="font-semibold text-foreground">
                                {folder.folder_number}
                            </span>
                            .
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4 text-sm">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Datepicker */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="loading_date"
                                    className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                >
                                    Date de chargement *
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className={cn(
                                                'h-9 w-full justify-start text-left text-sm font-normal',
                                                !data.loading_date &&
                                                    'text-muted-foreground',
                                                errors.loading_date &&
                                                    'border-destructive',
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {data.loading_date ? (
                                                format(
                                                    new Date(data.loading_date),
                                                    'PPP',
                                                    {
                                                        locale: fr,
                                                    },
                                                )
                                            ) : (
                                                <span>Choisir une date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={
                                                data.loading_date
                                                    ? new Date(
                                                          data.loading_date,
                                                      )
                                                    : undefined
                                            }
                                            onSelect={(date) =>
                                                setData(
                                                    'loading_date',
                                                    date
                                                        ? format(
                                                              date,
                                                              'yyyy-MM-dd',
                                                          )
                                                        : '',
                                                )
                                            }
                                            initialFocus
                                            locale={fr}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.loading_date && (
                                    <p className="text-xs text-destructive">
                                        {errors.loading_date}
                                    </p>
                                )}
                            </div>

                            {/* Nombre de conteneurs avec limite max */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="loaded_container_count"
                                        className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                    >
                                        Nbr de conteneurs *
                                    </Label>
                                    <span className="font-mono text-[11px] text-muted-foreground">
                                        Max : {maxAllowedContainers}
                                    </span>
                                </div>
                                <Input
                                    id="loaded_container_count"
                                    type="number"
                                    min="1"
                                    max={maxAllowedContainers}
                                    value={data.loaded_container_count}
                                    onChange={(e) => {
                                        const val =
                                            parseInt(e.target.value) || 1;
                                        setData(
                                            'loaded_container_count',
                                            Math.min(val, maxAllowedContainers),
                                        );
                                    }}
                                    className="h-9 text-sm"
                                    required
                                />
                                {errors.loaded_container_count && (
                                    <p className="text-xs text-destructive">
                                        {errors.loaded_container_count}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Type de conteneur désactivé (hérité du dossier) */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="container_type"
                                    className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                >
                                    Type de conteneur (Dossier)
                                </Label>
                                <Select
                                    value={folder.container_type.toString()}
                                    disabled
                                >
                                    <SelectTrigger className="h-9 cursor-not-allowed bg-muted/50 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="20">
                                            20 pieds
                                        </SelectItem>
                                        <SelectItem value="40">
                                            40 pieds
                                        </SelectItem>
                                        <SelectItem value="45">
                                            45 pieds
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="container_numbers"
                                    className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                >
                                    N° du/des conteneur(s) *
                                </Label>
                                <Input
                                    id="container_numbers"
                                    placeholder="Ex: MSKU1234567, TGHU7654321"
                                    value={data.container_numbers}
                                    onChange={(e) =>
                                        setData(
                                            'container_numbers',
                                            e.target.value,
                                        )
                                    }
                                    className="h-9 text-sm"
                                    required
                                />
                                {errors.container_numbers && (
                                    <p className="text-xs text-destructive">
                                        {errors.container_numbers}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="truck_number"
                                    className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                >
                                    N° Camion *
                                </Label>
                                <Input
                                    id="truck_number"
                                    placeholder="Ex: AB-123-CD"
                                    value={data.truck_number}
                                    onChange={(e) =>
                                        setData('truck_number', e.target.value)
                                    }
                                    className="h-9 text-sm"
                                    required
                                />
                                {errors.truck_number && (
                                    <p className="text-xs text-destructive">
                                        {errors.truck_number}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="driver"
                                    className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                >
                                    Chauffeur
                                </Label>
                                <Input
                                    id="driver"
                                    placeholder="Nom du chauffeur"
                                    value={data.driver}
                                    onChange={(e) =>
                                        setData('driver', e.target.value)
                                    }
                                    className="h-9 text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="carrier"
                                    className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                >
                                    Transporteur
                                </Label>
                                <Input
                                    id="carrier"
                                    placeholder="Société de transport"
                                    value={data.carrier}
                                    onChange={(e) =>
                                        setData('carrier', e.target.value)
                                    }
                                    className="h-9 text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="destination"
                                    className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                >
                                    Destination *
                                </Label>
                                <Input
                                    id="destination"
                                    placeholder="Lieu de livraison"
                                    value={data.destination}
                                    onChange={(e) =>
                                        setData('destination', e.target.value)
                                    }
                                    className="h-9 text-sm"
                                    required
                                />
                                {errors.destination && (
                                    <p className="text-xs text-destructive">
                                        {errors.destination}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="notes"
                                className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                            >
                                Observations
                            </Label>
                            <Textarea
                                id="notes"
                                placeholder="Remarques sur l'opération..."
                                value={data.notes}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                className="min-h-[90px] text-sm"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" size="sm" disabled={processing}>
                            {loading
                                ? 'Enregistrer les modifications'
                                : 'Valider le chargement'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
