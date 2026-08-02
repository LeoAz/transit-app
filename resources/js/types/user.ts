export interface UserPreferences {
    email_notifications_eta: boolean;
    email_notifications_ata: boolean;
    email_notifications_overdue: boolean;
    app_notifications_eta: boolean;
    app_notifications_ata: boolean;
    app_notifications_overdue: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    code?: string | null;
    phone?: string | null;
    zone?: string | null;
    preferences?: UserPreferences;
    email_verified_at?: string | null;
    created_at?: string;
    updated_at?: string;
}
