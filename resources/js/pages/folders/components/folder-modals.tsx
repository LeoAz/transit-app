import { useForm } from '@inertiajs/react';
import * as React from 'react';
import { toast } from 'sonner';

import { ShipperSelect } from '@/components/shipper-select';
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
import type { Folder, Vessel } from '@/types/transit';
import type { User } from '@/types/user';

interface FolderModalsProps {
    folder: Folder;
    shippers?: User[];
    vessels?: Vessel[];
    isAssignModalOpen: boolean;
    setIsAssignModalOpen: (open: boolean) => void;
    isArrivalModalOpen: boolean;
    setIsArrivalModalOpen: (open: boolean) => void;
}

export function FolderModals({
    folder,
    shippers = [],
    vessels = [],
    isAssignModalOpen,
    setIsAssignModalOpen,
    isArrivalModalOpen,
    setIsArrivalModalOpen,
}: FolderModalsProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unusedVessels = vessels;
    const assignForm = useForm({
        shipper_id: folder?.shipper_id?.toString() || '',
        reason: '',
    });

    const arrivalForm = useForm({
        ata: folder?.ata || '',
        notes: '',
    });

    React.useEffect(() => {
        if (folder) {
            assignForm.setData(
                'shipper_id',
                folder.shipper_id?.toString() || '',
            );

            if (folder.ata) {
                arrivalForm.setData('ata', folder.ata);
            }
        }
    }, [folder]);

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();

        if (!folder?.id) {
            return;
        }

        assignForm.post(folders.assign.url({ folder: folder.id }), {
            onSuccess: () => {
                setIsAssignModalOpen(false);
                assignForm.reset('reason');
                toast.success('Chargeur affecté avec succès.');
            },
        });
    };

    const handleArrival = (e: React.FormEvent) => {
        e.preventDefault();

        if (!folder?.id) {
            return;
        }

        arrivalForm.post(folders.validateArrival.url({ folder: folder.id }), {
            onSuccess: () => {
                setIsArrivalModalOpen(false);
                toast.success('Arrivée validée.');
            },
        });
    };

    return (
        <>
            {/* Modal Affectation Agent */}
            <Dialog
                open={isAssignModalOpen}
                onOpenChange={setIsAssignModalOpen}
            >
                <DialogContent className="sm:max-w-[420px]">
                    <form onSubmit={handleAssign}>
                        <DialogHeader>
                            <DialogTitle>Affecter un agent</DialogTitle>
                            <DialogDescription className="text-sm">
                                Choisissez le chargeur responsable du traitement
                                de ce dossier.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="shipper_id"
                                    className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                >
                                    Agent / Chargeur *
                                </Label>
                                <ShipperSelect
                                    shippers={shippers}
                                    value={assignForm.data.shipper_id}
                                    onValueChange={(val) =>
                                        assignForm.setData('shipper_id', val)
                                    }
                                    error={assignForm.errors.shipper_id}
                                />
                            </div>

                            {folder?.shipper_id && (
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="reason"
                                        className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                    >
                                        Motif du réacheminement *
                                    </Label>
                                    <Input
                                        id="reason"
                                        value={assignForm.data.reason}
                                        onChange={(e) =>
                                            assignForm.setData(
                                                'reason',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Ex: Répartition de la charge de travail"
                                        className="h-9 text-sm"
                                        required
                                    />
                                    {assignForm.errors.reason && (
                                        <p className="text-xs text-destructive">
                                            {assignForm.errors.reason}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsAssignModalOpen(false)}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={
                                    assignForm.processing ||
                                    !assignForm.data.shipper_id
                                }
                            >
                                Confirmer
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Validation ATA */}
            <Dialog
                open={isArrivalModalOpen}
                onOpenChange={setIsArrivalModalOpen}
            >
                <DialogContent className="sm:max-w-[420px]">
                    <form onSubmit={handleArrival}>
                        <DialogHeader>
                            <DialogTitle>Valider l'arrivée (ATA)</DialogTitle>
                            <DialogDescription className="text-sm">
                                Entrez la date d'arrivée réelle du navire pour
                                initier les délais de déchargement.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="ata"
                                    className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                >
                                    Date réelle (ATA) *
                                </Label>
                                <DatePicker
                                    date={
                                        arrivalForm.data.ata
                                            ? new Date(arrivalForm.data.ata)
                                            : undefined
                                    }
                                    onDateChange={(date) =>
                                        arrivalForm.setData(
                                            'ata',
                                            date
                                                ? date
                                                      .toISOString()
                                                      .split('T')[0]
                                                : '',
                                        )
                                    }
                                    placeholder="Sélectionner une date d'arrivée"
                                />
                                {arrivalForm.errors.ata && (
                                    <p className="text-xs text-destructive">
                                        {arrivalForm.errors.ata}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="notes"
                                    className="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                >
                                    Observations
                                </Label>
                                <Input
                                    id="notes"
                                    value={arrivalForm.data.notes}
                                    onChange={(e) =>
                                        arrivalForm.setData(
                                            'notes',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ex: Navire à quai à 14h00"
                                    className="h-9 text-sm"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsArrivalModalOpen(false)}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={
                                    arrivalForm.processing ||
                                    !arrivalForm.data.ata
                                }
                            >
                                Enregistrer
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
