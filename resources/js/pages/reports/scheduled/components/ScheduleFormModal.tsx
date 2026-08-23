import { useForm } from '@inertiajs/react';
import {
    CalendarClockIcon,
    CalendarDaysIcon,
    CheckCircle2Icon,
    ClockIcon,
    ShipIcon,
    UsersIcon,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import IconSelect from '@/components/comp-233';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import reports from '@/routes/reports';
import type { ReportOption, ReportSchedule } from '@/types/reports';

const REPORT_ICONS: Record<string, React.ElementType> = {
    client_situation: UsersIcon,
    shipper_situation: ShipIcon,
    ongoing_folders: ClockIcon,
    closed_folders: CheckCircle2Icon,
    daily: CalendarDaysIcon,
    arrival_punctuality: CalendarClockIcon,
};

const DAYS_OF_WEEK = [
    { value: '1', label: 'Lundi' },
    { value: '2', label: 'Mardi' },
    { value: '3', label: 'Mercredi' },
    { value: '4', label: 'Jeudi' },
    { value: '5', label: 'Vendredi' },
    { value: '6', label: 'Samedi' },
    { value: '7', label: 'Dimanche' },
];

interface ScheduleFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    schedule?: ReportSchedule;
    reportTypes: ReportOption[];
    formats: ReportOption[];
    frequencies: ReportOption[];
}

export function ScheduleFormModal({
    open,
    onOpenChange,
    schedule,
    reportTypes,
    formats,
    frequencies,
}: ScheduleFormModalProps) {
    const isEditing = Boolean(schedule);

    const { data, setData, post, put, transform, processing, errors, reset } =
        useForm({
            report_type: schedule?.report_type ?? '',
            format: schedule?.format ?? '',
            frequency: schedule?.frequency ?? '',
            day_of_week: schedule?.day_of_week
                ? schedule.day_of_week.toString()
                : '',
            day_of_month: schedule?.day_of_month
                ? schedule.day_of_month.toString()
                : '',
            send_time: schedule?.send_time
                ? schedule.send_time.slice(0, 5)
                : '06:00',
            additional_recipients:
                schedule?.additional_recipients?.join(', ') ?? '',
            is_active: schedule?.is_active ?? true,
        });

    React.useEffect(() => {
        if (schedule) {
            setData({
                report_type: schedule.report_type,
                format: schedule.format,
                frequency: schedule.frequency,
                day_of_week: schedule.day_of_week
                    ? schedule.day_of_week.toString()
                    : '',
                day_of_month: schedule.day_of_month
                    ? schedule.day_of_month.toString()
                    : '',
                send_time: schedule.send_time.slice(0, 5),
                additional_recipients:
                    schedule.additional_recipients?.join(', ') ?? '',
                is_active: schedule.is_active,
            });
        } else {
            reset();
        }
    }, [schedule]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((current) => ({
            ...current,
            additional_recipients: current.additional_recipients
                .split(',')
                .map((email) => email.trim())
                .filter(Boolean),
        }));

        const options = {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                toast.success(
                    isEditing
                        ? 'Programmation mise à jour avec succès.'
                        : 'Programmation créée avec succès.',
                );
            },
        };

        if (isEditing && schedule) {
            put(
                reports.scheduled.update.url({ reportSchedule: schedule.id }),
                options,
            );
        } else {
            post(reports.scheduled.store.url(), options);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {isEditing
                                ? 'Modifier la programmation'
                                : 'Nouvelle programmation'}
                        </DialogTitle>
                        <DialogDescription>
                            Choisissez le rapport, sa périodicité d'envoi et le
                            format du fichier joint à l'e-mail.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 py-5">
                        <div className="space-y-2">
                            <Label htmlFor="report_type">Rapport *</Label>
                            <IconSelect
                                id="report_type"
                                options={reportTypes.map((r) => ({
                                    value: r.value,
                                    label: r.label,
                                    icon: REPORT_ICONS[r.value] ?? ClockIcon,
                                }))}
                                value={data.report_type}
                                onValueChange={(val) =>
                                    setData('report_type', val)
                                }
                                placeholder="Sélectionner un rapport"
                                searchPlaceholder="Rechercher un rapport..."
                                error={errors.report_type}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="format">Format *</Label>
                                <Select
                                    value={data.format}
                                    onValueChange={(val) =>
                                        setData('format', val)
                                    }
                                >
                                    <SelectTrigger
                                        id="format"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {formats.map((f) => (
                                            <SelectItem
                                                key={f.value}
                                                value={f.value}
                                            >
                                                {f.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.format && (
                                    <p className="text-xs text-destructive">
                                        {errors.format}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="frequency">Périodicité *</Label>
                                <Select
                                    value={data.frequency}
                                    onValueChange={(val) =>
                                        setData('frequency', val)
                                    }
                                >
                                    <SelectTrigger
                                        id="frequency"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Périodicité" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {frequencies.map((f) => (
                                            <SelectItem
                                                key={f.value}
                                                value={f.value}
                                            >
                                                {f.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.frequency && (
                                    <p className="text-xs text-destructive">
                                        {errors.frequency}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {data.frequency === 'weekly' && (
                                <div className="space-y-2">
                                    <Label htmlFor="day_of_week">
                                        Jour de la semaine *
                                    </Label>
                                    <Select
                                        value={data.day_of_week}
                                        onValueChange={(val) =>
                                            setData('day_of_week', val)
                                        }
                                    >
                                        <SelectTrigger
                                            id="day_of_week"
                                            className="w-full"
                                        >
                                            <SelectValue placeholder="Jour" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DAYS_OF_WEEK.map((d) => (
                                                <SelectItem
                                                    key={d.value}
                                                    value={d.value}
                                                >
                                                    {d.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.day_of_week && (
                                        <p className="text-xs text-destructive">
                                            {errors.day_of_week}
                                        </p>
                                    )}
                                </div>
                            )}

                            {data.frequency === 'monthly' && (
                                <div className="space-y-2">
                                    <Label htmlFor="day_of_month">
                                        Jour du mois *
                                    </Label>
                                    <Input
                                        id="day_of_month"
                                        type="number"
                                        min={1}
                                        max={31}
                                        value={data.day_of_month}
                                        onChange={(e) =>
                                            setData(
                                                'day_of_month',
                                                e.target.value,
                                            )
                                        }
                                        className="h-9 text-sm"
                                    />
                                    {errors.day_of_month && (
                                        <p className="text-xs text-destructive">
                                            {errors.day_of_month}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="send_time">
                                    Heure d'envoi *
                                </Label>
                                <Input
                                    id="send_time"
                                    type="time"
                                    value={data.send_time}
                                    onChange={(e) =>
                                        setData('send_time', e.target.value)
                                    }
                                    className="h-9 text-sm"
                                />
                                {errors.send_time && (
                                    <p className="text-xs text-destructive">
                                        {errors.send_time}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="additional_recipients">
                                Destinataires additionnels
                            </Label>
                            <Input
                                id="additional_recipients"
                                value={data.additional_recipients}
                                onChange={(e) =>
                                    setData(
                                        'additional_recipients',
                                        e.target.value,
                                    )
                                }
                                placeholder="ex: collegue@entreprise.com, client@entreprise.com"
                                className="h-9 text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                Séparez plusieurs adresses par une virgule. Le
                                rapport sera aussi envoyé à votre adresse.
                            </p>
                            {Object.keys(errors).some((key) =>
                                key.startsWith('additional_recipients'),
                            ) && (
                                <p className="text-xs text-destructive">
                                    Une ou plusieurs adresses sont invalides.
                                </p>
                            )}
                        </div>

                        {isEditing && (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) =>
                                        setData('is_active', checked === true)
                                    }
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="font-normal"
                                >
                                    Programmation active
                                </Label>
                            </div>
                        )}
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
                            {isEditing
                                ? 'Enregistrer'
                                : 'Créer la programmation'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
