import * as React from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { Customer, Folder, Product, Vessel } from '@/types/transit';
import { FolderFormModal } from '../folder-form-modal';

export interface FormDataProps {
    customers?: Customer[];
    products?: Product[];
    vessels?: Vessel[];
    containerTypes?: Array<{ value: number; label: string }>;
}

interface FolderDialogsProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    isConfirmOpen: boolean;
    setIsConfirmOpen: (open: boolean) => void;
    selectedFolder: Folder | undefined;
    processing: boolean;
    onDelete: () => void;
    formData?: FormDataProps;
}

export function FolderDialogs({
    isModalOpen,
    setIsModalOpen,
    isConfirmOpen,
    setIsConfirmOpen,
    selectedFolder,
    processing,
    onDelete,
    formData,
}: FolderDialogsProps) {
    return (
        <>
            <FolderFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                folder={selectedFolder}
                customers={formData?.customers ?? []}
                products={formData?.products ?? []}
                vessels={formData?.vessels ?? []}
                containerTypes={formData?.containerTypes ?? []}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Supprimer le dossier"
                description={`Êtes-vous sûr de vouloir supprimer le dossier ${selectedFolder?.folder_number} ? Cette action supprimera également tout l'historique associé.`}
                onConfirm={onDelete}
                isLoading={processing}
            />
        </>
    );
}
