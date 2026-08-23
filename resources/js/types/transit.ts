import type { User } from './user';

export type ContainerType = 20 | 40 | 45;

export type FolderStatus =
    | 'pending'
    | 'in_progress'
    | 'overdue'
    | 'closed'
    | 'closed_late';

export interface Customer {
    id: number;
    code?: string;
    company_name: string;
    address?: string;
    contact?: string;
    phone?: string;
    email?: string;
    tax_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Product {
    id: number;
    code?: string;
    label: string;
    category?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Vessel {
    id: number;
    name: string;
    company?: string;
    flag?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Holiday {
    id: number;
    date: string;
    label: string;
    created_at?: string;
    updated_at?: string;
}

export interface Loading {
    id: number;
    folder_id: number;
    loading_date: string;
    truck_number: string;
    carrier?: string;
    driver?: string;
    loaded_container_count: number;
    container_type: ContainerType;
    container_numbers: string;
    destination: string;
    notes?: string;
    user_id: number;
    user?: User;
    created_at?: string;
    updated_at?: string;
}

export interface Document {
    id: number;
    folder_id: number;
    document_type: string;
    file_name: string;
    file_path: string;
    format: string;
    size: number;
    user_id: number;
    user?: User;
    created_at?: string;
    updated_at?: string;
}

export interface AssignmentHistory {
    id: number;
    folder_id: number;
    previous_shipper_id: number | null;
    new_shipper_id: number;
    changed_at: string;
    reason: string;
    user_id: number;
    previous_shipper?: User;
    new_shipper?: User;
    user?: User;
    created_at?: string;
    updated_at?: string;
}

export interface FolderStatistics {
    total: number;
    pending: number;
    in_progress: number;
    overdue: number;
    closed: number;
}

export interface Folder {
    id: number;
    folder_number: string;
    bl_received_at: string;
    bl_number: string;
    customer_id: number;
    container_type: ContainerType;
    container_count: number;
    product_id: number;
    vessel_id?: number | null;
    vessel_name: string;
    vessel?: Vessel;
    eta: string;
    ata?: string | null;
    notes?: string | null;
    shipper_id?: number | null;
    status: FolderStatus;
    loading_deadline?: string | null;
    customer?: Customer;
    shipper?: User;
    product?: Product;
    loadings?: Loading[];
    documents?: Document[];
    assignment_histories?: AssignmentHistory[];
    created_at?: string;
    updated_at?: string;
}

export interface FolderFormData {
    customers: Customer[];
    shippers: User[];
    products: Product[];
    vessels?: Vessel[];
    containerTypes?: Array<{ value: ContainerType; label: string }>;
    statuses?: Array<{ value: FolderStatus; label: string }>;
}
