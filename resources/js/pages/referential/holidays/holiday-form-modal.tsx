import { useForm } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Holiday } from '@/types/transit';

interface HolidayFormModalProps {
    holiday?: Holiday | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function HolidayFormModal({
    holiday,
    open,
    onOpenChange,
}: HolidayFormModalProps) {
    const isEditing = !!holiday;

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            date: '',
            label: '',
        });

    useEffect(() => {
        if (holiday) {
            setData({
                date: holiday.date || '',
                label: holiday.label || '',
            });
        }

        clearErrors();
    }, [holiday, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            put(`/referential/holidays/${holiday.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success('Jour férié mis à jour avec succès.');
                },
            });
        } else {
            post('/referential/holidays', {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    toast.success('Jour férié créé avec succès.');
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
                            {isEditing ? 'Modifier le jour férié' : 'Ajouter un jour férié'}
                        </DialogTitle>
                        <DialogDescription>
                            Définissez la date et le libellé du jour férié.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                Date
                            </Label>
                            <div className="col-span-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !data.date && 'text-muted-foreground',
                                                errors.date && 'border-destructive'
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {data.date ? (
                                                format(parseISO(data.date), 'PPP', { locale: fr })
                                            ) : (
                                                <span>Choisir une date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={data.date ? parseISO(data.date) : undefined}
                                            onSelect={(date) =>
                                                setData('date', date ? format(date, 'yyyy-MM-dd') : '')
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.date && (
                                    <p className="text-destructive mt-1 text-xs">
                                        {errors.date}
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
