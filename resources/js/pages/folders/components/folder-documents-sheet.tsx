import { router, useForm } from '@inertiajs/react';
import {
    AlertCircleIcon,
    Download,
    Eye,
    FileArchiveIcon,
    FileIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    FileUpIcon,
    ImageIcon,
    Loader2,
    Plus,
    Trash2,
    Upload,
    XIcon,
} from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { Document, Folder } from '@/types/transit';

interface FolderDocumentsSheetProps {
    folder: Folder;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function FolderDocumentsSheet({
    folder,
    isOpen,
    onOpenChange,
}: FolderDocumentsSheetProps) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
    const [documentToDelete, setDocumentToDelete] = React.useState<number | null>(
        null,
    );
    const [isPolling, setIsPolling] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Référence pour suivre le nombre de documents sans déclencher de render synchrone dans useEffect
    const lastDocumentsCountRef = React.useRef(folder.documents?.length || 0);

    // Arrêter le polling si un nouveau document est apparu
    React.useEffect(() => {
        const currentCount = folder.documents?.length || 0;

        if (currentCount > lastDocumentsCountRef.current) {
            setIsPolling(false);
        }

        lastDocumentsCountRef.current = currentCount;
    }, [folder.documents?.length]);

    // Polling pour mettre à jour la liste des documents tant que l'upload est en cours
    React.useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPolling && isOpen) {
            interval = setInterval(() => {
                router.reload({
                    only: ['folder'],
                    onFinish: () => {
                        // On pourrait arrêter le polling ici si on avait un indicateur
                        // de fin de traitement dans les données du dossier.
                        // Pour l'instant, on laisse l'utilisateur décider ou on attend 1 min.
                    }
                });
            }, 3000); // Toutes les 3 secondes
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isPolling, isOpen]);

    // Arrêter le polling après 2 minutes pour éviter de consommer des ressources indéfiniment
    React.useEffect(() => {
        if (isPolling) {
            const timer = setTimeout(() => {
                setIsPolling(false);
            }, 120000);

            return () => clearTimeout(timer);
        }
    }, [isPolling]);

    const { data, setData, post, processing, progress, errors, reset } = useForm<{
        document_type: string;
        file: File | null;
    }>({
        document_type: '',
        file: null,
    });

    const formatBytes = (bytes: number) => {
        if (!bytes || bytes === 0) {
            return '0 B';
        }

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    };

    const getFileIcon = (fileOrName: File | string, mimeType?: string) => {
        const fileName =
            typeof fileOrName === 'string' ? fileOrName : fileOrName.name;
        const type =
            typeof fileOrName === 'string' ? mimeType || '' : fileOrName.type;

        if (
            type.includes('pdf') ||
            fileName.endsWith('.pdf') ||
            type.includes('word') ||
            fileName.endsWith('.doc') ||
            fileName.endsWith('.docx')
        ) {
            return <FileTextIcon className="size-4 text-blue-500" />;
        }

        if (
            type.includes('zip') ||
            type.includes('archive') ||
            fileName.endsWith('.zip') ||
            fileName.endsWith('.rar')
        ) {
            return <FileArchiveIcon className="size-4 text-amber-500" />;
        }

        if (
            type.includes('excel') ||
            fileName.endsWith('.xls') ||
            fileName.endsWith('.xlsx')
        ) {
            return <FileSpreadsheetIcon className="size-4 text-emerald-500" />;
        }

        if (type.startsWith('image/')) {
            return <ImageIcon className="size-4 text-purple-500" />;
        }

        return <FileIcon className="size-4 opacity-60" />;
    };

    // --- Drag & Drop Handlers ---
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const selectedFile = e.dataTransfer.files[0];
            setData('file', selectedFile);
            e.dataTransfer.clearData();
        }
    };

    const handleUpload = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.file || !data.document_type) {
            return;
        }

        post(`/folders/${folder.id}/documents`, {
            forceFormData: true,
            onSuccess: () => {
                toast.success(
                    'Document envoyé pour traitement. Il apparaîtra dans la liste sous peu.',
                );
                reset();
                setIsAdding(false);
                setIsPolling(true);
            },
        });
    };

    const handleDelete = () => {
        if (!documentToDelete) {
            return;
        }

        router.delete(`/documents/${documentToDelete}`, {
            onSuccess: () => {
                toast.success('Document supprimé avec succès.');
                setDocumentToDelete(null);
                setSelectedIds((prev) =>
                    prev.filter((id) => id !== documentToDelete),
                );
            },
        });
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === (folder.documents?.length || 0)) {
            setSelectedIds([]);
        } else {
            setSelectedIds(folder.documents?.map((d) => d.id) || []);
        }
    };

    const [isGeneratingZip, setIsGeneratingZip] = React.useState(false);

    // ... existing hooks

    const handleDownloadBulk = async () => {
        if (selectedIds.length === 0) {
            return;
        }

        setIsGeneratingZip(true);
        toast.info('Génération du fichier ZIP en cours...');

        try {
            const response = await fetch('/documents/download-bulk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ ids: selectedIds }),
            });

            const data = await response.json();
            const taskId = data.task_id;

            if (taskId) {
                pollZipStatus(taskId);
            } else {
                toast.error('Erreur lors du lancement de la génération.');
                setIsGeneratingZip(false);
            }
        } catch {
            toast.error('Une erreur est survenue.');
            setIsGeneratingZip(false);
        }
    };

    const pollZipStatus = (taskId: string) => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/documents/check-zip/${taskId}`);
                const data = await response.json();

                if (data.status === 'completed') {
                    clearInterval(interval);
                    setIsGeneratingZip(false);
                    setSelectedIds([]);
                    toast.success('Fichier ZIP prêt ! Le téléchargement va commencer.');

                    // Utiliser un formulaire temporaire pour soumettre la requête GET
                    // Cela permet de mieux gérer les cookies de session dans certains navigateurs
                    // ou d'ouvrir dans un nouvel onglet si nécessaire.
                    const link = document.createElement('a');
                    link.href = data.download_url;
                    link.download = data.file_name || 'documents.zip';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else if (data.status === 'failed') {
                    clearInterval(interval);
                    setIsGeneratingZip(false);
                    toast.error(`La génération a échoué: ${data.error}`);
                }
            } catch {
                clearInterval(interval);
                setIsGeneratingZip(false);
            }
        }, 2000);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            {/* Augmentation importante de la taille du Sheet (sm:max-w-2xl md:max-w-3xl) */}
            <SheetContent className="flex w-full flex-col max-w-3xl px-5 sm:max-w-2xl md:max-w-3xl">
                <SheetHeader>
                    <div className="flex items-center gap-2">
                        <SheetTitle className="text-xl">
                            Gestion des documents
                        </SheetTitle>
                        {isPolling && (
                            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary animate-pulse">
                                <Upload className="size-2.5" />
                                Mise à jour automatique...
                            </div>
                        )}
                    </div>
                    <SheetDescription>
                        Consultez, téléchargez et téléversez les documents
                        associés au dossier{' '}
                        <span className="font-semibold text-foreground">
                            {folder.folder_number}
                        </span>
                        .
                    </SheetDescription>
                </SheetHeader>

                <div className="my-3 flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                        {folder.documents && folder.documents.length > 0 && (
                            <Checkbox
                                checked={
                                    selectedIds.length ===
                                        folder.documents.length &&
                                    folder.documents.length > 0
                                }
                                onCheckedChange={toggleSelectAll}
                                className="size-4"
                            />
                        )}
                        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Liste des pièces jointes (
                            {folder.documents?.length || 0})
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={handleDownloadBulk}
                                disabled={isGeneratingZip}
                                className="h-8 gap-1.5 text-xs border-primary/30 text-primary hover:bg-primary/5"
                            >
                                {isGeneratingZip ? (
                                    <>
                                        <Loader2 className="size-3.5 animate-spin" />
                                        Génération en cours...
                                    </>
                                ) : (
                                    <>
                                        <Download className="size-3.5" /> Télécharger les documents (Format: ZIP)
                                        ({selectedIds.length})
                                    </>
                                )}
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant={isAdding ? 'outline' : 'default'}
                            onClick={() => {
                                setIsAdding(!isAdding);

                                if (isAdding) {
                                    reset();
                                }
                            }}
                            className="h-8 gap-1.5 text-xs"
                        >
                            {isAdding ? (
                                'Fermer'
                            ) : (
                                <>
                                    <Plus className="size-3.5" /> Ajouter
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Formulaire de téléversement Drag & Drop */}
                {isAdding && (
                    <form
                        onSubmit={handleUpload}
                        className="mb-4 space-y-4 rounded-xl border bg-muted/20 p-4 transition-all"
                    >
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="document_type"
                                className="text-xs font-semibold"
                            >
                                Type de document *
                            </Label>
                            <Input
                                id="document_type"
                                placeholder="Ex: Connaissement (BL), Facture commerciale, Déclaration..."
                                value={data.document_type}
                                onChange={(e) =>
                                    setData('document_type', e.target.value)
                                }
                                className="h-9 bg-background text-sm"
                                required
                            />
                            {errors.document_type && (
                                <p className="text-xs text-destructive">
                                    {errors.document_type}
                                </p>
                            )}
                        </div>

                        {/* Zone Drop Area */}
                        {!data.file ? (
                            <div
                                className={cn(
                                    'flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-input bg-background p-4 text-center transition-colors hover:bg-accent/50',
                                    isDragging && 'border-primary bg-accent/60',
                                )}
                                onClick={() => fileInputRef.current?.click()}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                role="button"
                                tabIndex={-1}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            'file',
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                    className="sr-only"
                                />

                                <div className="mb-2 flex size-10 items-center justify-center rounded-full border bg-muted">
                                    <FileUpIcon className="size-4 opacity-60" />
                                </div>
                                <p className="text-sm font-medium">
                                    Téléverser un fichier
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Glissez-déposez votre fichier ici ou cliquez
                                    pour parcourir
                                </p>
                                <p className="mt-2 text-[11px] text-muted-foreground/70">
                                    Formats acceptés : PDF, images, Word, Excel,
                                    ZIP (Max. 50 Mo)
                                </p>
                            </div>
                        ) : (
                            /* Affichage du fichier sélectionné */
                            <div className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border bg-muted/50">
                                        {getFileIcon(data.file)}
                                    </div>
                                    <div className="flex min-w-0 flex-col">
                                        <p className="truncate text-sm font-medium">
                                            {data.file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatBytes(data.file.size)}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-muted-foreground hover:text-foreground"
                                    onClick={() => setData('file', null)}
                                >
                                    <XIcon className="size-4" />
                                </Button>
                            </div>
                        )}

                        {errors.file && (
                            <div className="flex items-center gap-1 text-xs text-destructive">
                                <AlertCircleIcon className="size-3.5 shrink-0" />
                                <span>{errors.file}</span>
                            </div>
                        )}

                        {progress && (
                            <div className="w-full space-y-1">
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>Téléversement...</span>
                                    <span>{progress.percentage}%</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full bg-primary transition-all duration-300"
                                        style={{
                                            width: `${progress.percentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            size="sm"
                            disabled={
                                processing || !data.file || !data.document_type
                            }
                            className="h-9 w-full gap-1.5 text-xs"
                        >
                            <Upload className="size-3.5" /> Enregistrer le
                            document
                        </Button>
                    </form>
                )}

                {/* Liste des documents existants */}
                <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                    {!folder.documents || folder.documents.length === 0 ? (
                        <div className="my-2 flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                            <FileTextIcon className="mb-2 size-10 opacity-30" />
                            <p className="text-sm font-medium">
                                Aucun document joint à ce dossier
                            </p>
                            <p className="mt-0.5 text-xs opacity-75">
                                Cliquez sur "Ajouter un document" pour
                                téléverser une nouvelle pièce.
                            </p>
                        </div>
                    ) : (
                        folder.documents.map((doc: Document) => (
                            <div
                                key={doc.id}
                                className={cn(
                                    'flex items-center justify-between gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/40',
                                    selectedIds.includes(doc.id) &&
                                        'border-primary/40 bg-primary/5',
                                )}
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <Checkbox
                                        checked={selectedIds.includes(doc.id)}
                                        onCheckedChange={() =>
                                            toggleSelect(doc.id)
                                        }
                                        className="size-4"
                                    />
                                    <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border bg-muted/40">
                                        {getFileIcon(doc.file_name, doc.format)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">
                                            {doc.document_type}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {doc.file_name} •{' '}
                                            {formatBytes(doc.size)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="size-8"
                                        asChild
                                    >
                                        <a
                                            href={`/documents/${doc.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Eye className="size-4 text-muted-foreground" />
                                        </a>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="size-8"
                                        asChild
                                    >
                                        <a
                                            href={`/documents/${doc.id}/download`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Download className="size-4 text-muted-foreground" />
                                        </a>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-8 text-destructive hover:bg-destructive/10"
                                        onClick={() => setDocumentToDelete(doc.id)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Dialog
                    open={documentToDelete !== null}
                    onOpenChange={(open) => !open && setDocumentToDelete(null)}
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Supprimer le document</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer ce document ?
                                Cette action est irréversible.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setDocumentToDelete(null)}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                Supprimer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SheetContent>
        </Sheet>
    );
}
