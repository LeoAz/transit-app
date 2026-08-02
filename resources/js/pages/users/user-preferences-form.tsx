import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field";
import type { UserPreferences } from "@/types";

interface PreferenceToggleProps {
    id: keyof UserPreferences;
    title: string;
    description: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}

export function PreferenceToggle({
    id,
    title,
    description,
    checked,
    onCheckedChange,
}: PreferenceToggleProps) {
    return (
        <FieldLabel>
            <Field orientation="horizontal">
                <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={(val) => onCheckedChange(!!val)}
                />
                <FieldContent>
                    <FieldTitle>{title}</FieldTitle>
                    <FieldDescription>{description}</FieldDescription>
                </FieldContent>
            </Field>
        </FieldLabel>
    );
}

interface UserPreferencesFormProps {
    preferences: UserPreferences;
    onChange: (key: keyof UserPreferences, value: boolean) => void;
}

export function UserPreferencesForm({
    preferences,
    onChange,
}: UserPreferencesFormProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg border p-6">
            <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                </p>
                <div className="space-y-4">
                    <PreferenceToggle
                        id="email_notifications_eta"
                        title="ETA (Prévu)"
                        description="Recevoir des notifications par email pour les changements d'ETA."
                        checked={preferences.email_notifications_eta}
                        onCheckedChange={(val) =>
                            onChange("email_notifications_eta", val)
                        }
                    />
                    <PreferenceToggle
                        id="email_notifications_ata"
                        title="ATA (Arrivé)"
                        description="Recevoir des notifications par email pour les arrivées (ATA)."
                        checked={preferences.email_notifications_ata}
                        onCheckedChange={(val) =>
                            onChange("email_notifications_ata", val)
                        }
                    />
                    <PreferenceToggle
                        id="email_notifications_overdue"
                        title="Retard"
                        description="Recevoir des notifications par email pour les retards."
                        checked={preferences.email_notifications_overdue}
                        onCheckedChange={(val) =>
                            onChange("email_notifications_overdue", val)
                        }
                    />
                </div>
            </div>
            <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Application
                </p>
                <div className="space-y-4">
                    <PreferenceToggle
                        id="app_notifications_eta"
                        title="ETA (Prévu)"
                        description="Notifications dans l'application pour l'ETA."
                        checked={preferences.app_notifications_eta}
                        onCheckedChange={(val) =>
                            onChange("app_notifications_eta", val)
                        }
                    />
                    <PreferenceToggle
                        id="app_notifications_ata"
                        title="ATA (Arrivé)"
                        description="Notifications dans l'application pour l'ATA."
                        checked={preferences.app_notifications_ata}
                        onCheckedChange={(val) =>
                            onChange("app_notifications_ata", val)
                        }
                    />
                    <PreferenceToggle
                        id="app_notifications_overdue"
                        title="Retard"
                        description="Notifications dans l'application pour les retards."
                        checked={preferences.app_notifications_overdue}
                        onCheckedChange={(val) =>
                            onChange("app_notifications_overdue", val)
                        }
                    />
                </div>
            </div>
        </div>
    );
}
