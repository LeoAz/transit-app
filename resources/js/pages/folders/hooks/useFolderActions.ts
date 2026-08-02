import { useForm } from '@inertiajs/react';
import * as React from 'react';
import { toast } from 'sonner';
import folders from '@/routes/folders';
import type { Folder } from '@/types/transit';

export function useFolderActions() {
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [isConfirmOpen, setIsConfirmOpen] = React.useState<boolean>(false);
    const [selectedFolder, setSelectedFolder] = React.useState<
        Folder | undefined
    >(undefined);

    const { delete: destroy, processing } = useForm();

    const openCreate = React.useCallback(() => {
        setSelectedFolder(undefined);
        setIsModalOpen(true);
    }, []);

    const openEdit = React.useCallback((folder: Folder) => {
        setSelectedFolder(folder);
        setIsModalOpen(true);
    }, []);

    const openDelete = React.useCallback((folder: Folder) => {
        setSelectedFolder(folder);
        setIsConfirmOpen(true);
    }, []);

    const deleteFolder = React.useCallback(() => {
        if (selectedFolder) {
            destroy(folders.destroy.url({ folder: selectedFolder.id }), {
                onSuccess: () => {
                    setIsConfirmOpen(false);
                    setSelectedFolder(undefined);
                    toast.success('Dossier supprimé avec succès.');
                },
            });
        }
    }, [selectedFolder, destroy]);

    return {
        selectedFolder,
        isModalOpen,
        setIsModalOpen,
        isConfirmOpen,
        setIsConfirmOpen,
        processing,
        openCreate,
        openEdit,
        openDelete,
        deleteFolder,
    };
}
