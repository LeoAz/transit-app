import { Plus } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';

interface FolderHeaderProps {
    onCreate: () => void;
}

export function FolderHeader({ onCreate }: FolderHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-xl font-semibold tracking-tight">
                    Dossiers de Transport
                </h1>
                <p className="text-sm text-muted-foreground">
                    Gérez et suivez l'état de vos dossiers transit.
                </p>
            </div>
            <Button size="sm" onClick={onCreate}>
                <Plus className="mr-2 size-4" />
                Nouveau Dossier
            </Button>
        </div>
    );
}
