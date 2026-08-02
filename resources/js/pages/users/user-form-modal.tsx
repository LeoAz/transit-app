import { useForm } from "@inertiajs/react";
import * as React from "react";
import { toast } from "sonner";
import RoleSelect from "@/components/comp-230";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { store, update } from "@/routes/users";
import type { User, UserPreferences } from "@/types";
import { UserPreferencesForm } from "./user-preferences-form";

interface UserFormModalProps {
    user?: User;
    roles: { value: string; label: string }[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface UserFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    code: string;
    phone: string;
    zone: string;
    preferences: UserPreferences;
}

export function UserFormModal({
    user,
    roles,
    open,
    onOpenChange,
}: UserFormModalProps) {
    const isEditing = !!user;

    const { data, setData, post, put, processing, errors, reset } =
        useForm<UserFormData>({
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            password_confirmation: "",
            role: user?.role || "",
            code: user?.code ?? "",
            phone: user?.phone ?? "",
            zone: user?.zone ?? "",
            preferences: {
                email_notifications_eta:
                    user?.preferences?.email_notifications_eta ?? true,
                email_notifications_ata:
                    user?.preferences?.email_notifications_ata ?? true,
                email_notifications_overdue:
                    user?.preferences?.email_notifications_overdue ?? true,
                app_notifications_eta:
                    user?.preferences?.app_notifications_eta ?? true,
                app_notifications_ata:
                    user?.preferences?.app_notifications_ata ?? true,
                app_notifications_overdue:
                    user?.preferences?.app_notifications_overdue ?? true,
            },
        });

    React.useEffect(() => {
        if (open) {
            setData({
                name: user?.name || "",
                email: user?.email || "",
                password: "",
                password_confirmation: "",
                role: user?.role || "",
                code: user?.code ?? "",
                phone: user?.phone ?? "",
                zone: user?.zone ?? "",
                preferences: {
                    email_notifications_eta:
                        user?.preferences?.email_notifications_eta ?? true,
                    email_notifications_ata:
                        user?.preferences?.email_notifications_ata ?? true,
                    email_notifications_overdue:
                        user?.preferences?.email_notifications_overdue ?? true,
                    app_notifications_eta:
                        user?.preferences?.app_notifications_eta ?? true,
                    app_notifications_ata:
                        user?.preferences?.app_notifications_ata ?? true,
                    app_notifications_overdue:
                        user?.preferences?.app_notifications_overdue ?? true,
                },
            });
        }
    }, [open, user, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && user) {
            put(update.url(user.id), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    toast.success("Utilisateur mis à jour avec succès.");
                },
            });
        } else {
            post(store.url(), {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                    toast.success("Utilisateur créé avec succès.");
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? "Modifier l'utilisateur"
                            : "Créer un utilisateur"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Modifiez les informations de l'utilisateur ici."
                            : "Remplissez les informations pour créer un nouvel utilisateur."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">
                                Confirmer le mot de passe
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                placeholder="Code identifiant"
                            />
                            {errors.code && (
                                <p className="text-xs text-destructive">
                                    {errors.code}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                placeholder="Numéro de téléphone"
                            />
                            {errors.phone && (
                                <p className="text-xs text-destructive">
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <RoleSelect
                            label="Rôle"
                            options={roles}
                            value={data.role}
                            onValueChange={(value) => setData("role", value)}
                            placeholder="Sélectionnez un rôle"
                            error={errors.role}
                        />
                        {data.role === "shipper" && (
                            <div className="space-y-2">
                                <Label htmlFor="zone">Zone</Label>
                                <Input
                                    id="zone"
                                    value={data.zone}
                                    onChange={(e) =>
                                        setData("zone", e.target.value)
                                    }
                                    placeholder="Zone géographique"
                                />
                                {errors.zone && (
                                    <p className="text-xs text-destructive">
                                        {errors.zone}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Label>Préférences de notification</Label>
                        <UserPreferencesForm
                            preferences={data.preferences}
                            onChange={(key: keyof UserPreferences, value: boolean) =>
                                setData("preferences", {
                                    ...data.preferences,
                                    [key]: value,
                                })
                            }
                        />
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
                            {isEditing ? "Enregistrer" : "Créer l'utilisateur"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
