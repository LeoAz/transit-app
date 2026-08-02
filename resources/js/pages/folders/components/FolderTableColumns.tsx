import { Link } from '@inertiajs/react';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import folders from '@/routes/folders';
import type { Folder, FolderStatus } from '@/types/transit';
import { FolderStatusBadge } from './FolderStatusBadge';

interface GetFolderColumnsProps {
    statuses?: Array<{ value: FolderStatus; label: string }>;
    onEdit: (folder: Folder) => void;
    onDelete: (folder: Folder) => void;
}

export function getFolderColumns({
    statuses,
    onEdit,
    onDelete,
}: GetFolderColumnsProps) {
    return [
        {
            header: 'N° Dossier',
            accessorKey: 'folder_number',
            sortable: true,
            cell: (folder: Folder) => (
                <Link
                    href={folders.show.url({ folder: folder.id })}
                    className="font-medium text-primary hover:underline"
                >
                    {folder.folder_number}
                </Link>
            ),
        },
        {
            header: 'N° BL',
            accessorKey: 'bl_number',
            sortable: true,
        },
        {
            header: 'Client',
            accessorKey: 'customer.company_name',
            sortable: true,
            cell: (folder: Folder) => folder.customer?.company_name || '-',
        },
        {
            header: 'Navire',
            accessorKey: 'vessel_name',
            sortable: true,
        },
        {
            header: 'ETA',
            accessorKey: 'eta',
            sortable: true,
            cell: (folder: Folder) =>
                folder.eta
                    ? new Date(folder.eta).toLocaleDateString('fr-FR')
                    : '-',
        },
        {
            header: 'Chargeur',
            accessorKey: 'shipper.name',
            cell: (folder: Folder) =>
                folder.shipper ? (
                    folder.shipper.name
                ) : (
                    <span className="text-xs text-muted-foreground italic">
                        Non affecté
                    </span>
                ),
        },
        {
            header: 'Statut',
            accessorKey: 'status',
            sortable: true,
            cell: (folder: Folder) => (
                <FolderStatusBadge status={folder.status} statuses={statuses} />
            ),
        },
        {
            header: 'Actions',
            accessorKey: 'id',
            cell: (folder: Folder) => (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={folders.show.url({ folder: folder.id })}>
                            <Eye className="size-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(folder)}
                    >
                        <Edit2 className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => onDelete(folder)}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            ),
        },
    ];
}
