import type { FolderStatus } from './transit';

export type ReportPeriodPreset = 'day' | 'week' | 'month' | 'year' | 'custom';

export interface ReportPeriodFilters {
    [key: string]: string | number | null | undefined;
    preset: ReportPeriodPreset;
    start_date: string;
    end_date: string;
    customer_id?: number | null;
    shipper_id?: number | null;
    vessel_id?: number | null;
    status?: string | null;
}

export interface ClientSituationRow {
    customer: string;
    customer_id: number;
    folders_count: number;
    containers_ordered: number;
    containers_loaded: number;
    containers_remaining: number;
    progress_rate: number;
}

export interface ShipperSituationRow {
    shipper: string;
    shipper_id: number;
    folders_assigned_count: number;
    folders_in_progress_count: number;
    folders_closed_count: number;
    volume_treated: number;
}

export interface OngoingFolderRow {
    folder_number: string;
    customer: string | null;
    shipper: string;
    status: FolderStatus;
    status_label: string;
    container_count: number;
    loaded: number;
    eta: string | null;
    ata: string | null;
    loading_deadline: string | null;
    days_until_deadline: number | null;
}

export interface ClosedFolderRow {
    folder_number: string;
    customer: string | null;
    status: FolderStatus;
    status_label: string;
    ata: string | null;
    closed_at: string | null;
    delay_working_days: number | null;
    is_late: boolean;
}

export interface DailyReportLoading {
    folder_number: string | null;
    customer: string | null;
    shipper: string | null;
    truck_number: string;
    loaded_container_count: number;
    destination: string;
}

export interface DailyReportAlert {
    folder_number: string;
    customer: string | null;
    status: FolderStatus;
    status_label: string;
    loading_deadline: string | null;
}

export type ArrivalPunctuality = 'on_time' | 'early' | 'late';

export interface ArrivalPunctualityFolderRow {
    company: string;
    vessel: string;
    folder_number: string;
    eta: string;
    ata: string;
    gap_days: number;
    punctuality: ArrivalPunctuality;
    punctuality_label: string;
}

export interface ArrivalPunctualityCompanyRow {
    company: string;
    total: number;
    on_time: number;
    early: number;
    late: number;
    punctuality_rate: number;
    folders: ArrivalPunctualityFolderRow[];
}

export type ScheduledReportType =
    | 'client_situation'
    | 'shipper_situation'
    | 'ongoing_folders'
    | 'closed_folders'
    | 'daily'
    | 'arrival_punctuality';

export type ReportExportFormat = 'pdf' | 'excel';

export type ReportScheduleFrequency = 'daily' | 'weekly' | 'monthly';

export interface ReportOption {
    value: string;
    label: string;
}

export interface ReportSchedule {
    id: number;
    user_id: number;
    report_type: ScheduledReportType;
    format: ReportExportFormat;
    frequency: ReportScheduleFrequency;
    day_of_week: number | null;
    day_of_month: number | null;
    send_time: string;
    additional_recipients: string[] | null;
    is_active: boolean;
    last_sent_at: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ReportExecution {
    id: number;
    user_id: number;
    report_schedule_id: number | null;
    report_type: ScheduledReportType;
    format: ReportExportFormat;
    period_start: string;
    period_end: string;
    file_path: string | null;
    file_name: string | null;
    status: 'sent' | 'failed';
    error_message: string | null;
    recipients: string[] | null;
    sent_at: string | null;
    created_at?: string;
}
