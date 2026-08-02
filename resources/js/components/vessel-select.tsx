'use client';

import { CheckIcon, ChevronDownIcon, PlusIcon } from 'lucide-react';
import * as React from 'react';

import VesselFormModal from '@/pages/referential/vessels/vessel-form-modal';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Vessel {
    id: number;
    name: string;
    company?: string;
    flag?: string;
}

interface VesselSelectProps {
    vessels?: Vessel[];
    value: string;
    onValueChange: (value: string) => void;
    error?: string;
    placeholder?: string;
}

export function VesselSelect({
    vessels = [],
    value,
    onValueChange,
    error,
    placeholder = 'Sélectionner ou créer un navire...',
}: VesselSelectProps) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [searchValue, setSearchValue] = React.useState<string>('');
    const [isCreateModalOpen, setIsCreateModalOpen] =
        React.useState<boolean>(false);

    const filteredVessels = React.useMemo(() => {
        const query = searchValue.trim().toLowerCase();
        if (!query) return vessels;
        return vessels.filter((vessel) =>
            vessel.name.toLowerCase().includes(query),
        );
    }, [vessels, searchValue]);

    const exactMatch = React.useMemo(() => {
        const query = searchValue.trim().toLowerCase();
        if (!query) return true;
        return vessels.some((vessel) => vessel.name.toLowerCase() === query);
    }, [vessels, searchValue]);

    const handleOpenCreateModal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // 👈 Stoppe la propagation au clic du bouton "Créer"
        setOpen(false);
        setIsCreateModalOpen(true);
    };

    const handleCreatedSuccess = (createdVesselName: string) => {
        onValueChange(createdVesselName);
        setSearchValue('');
    };

    return (
        <div className="w-full space-y-1">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            'h-9 w-full justify-between border-input bg-background px-3 font-normal outline-none hover:bg-background focus-visible:outline-[3px]',
                            !value && 'text-muted-foreground',
                            error &&
                                'border-destructive focus-visible:ring-destructive',
                        )}
                        variant="outline"
                    >
                        <span className="truncate">{value || placeholder}</span>
                        <ChevronDownIcon
                            aria-hidden="true"
                            className="ml-2 size-4 shrink-0 text-muted-foreground/80"
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    className="w-[var(--radix-popper-anchor-width)] p-0"
                >
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Rechercher un navire..."
                            value={searchValue}
                            onValueChange={setSearchValue}
                        />
                        <CommandList>
                            {filteredVessels.length === 0 && (
                                <CommandEmpty className="py-3 text-center text-xs text-muted-foreground">
                                    Aucun navire trouvé.
                                </CommandEmpty>
                            )}

                            {filteredVessels.length > 0 && (
                                <CommandGroup>
                                    {filteredVessels.map((vessel) => (
                                        <CommandItem
                                            key={vessel.id}
                                            value={vessel.name}
                                            onSelect={() => {
                                                onValueChange(vessel.name);
                                                setOpen(false);
                                                setSearchValue('');
                                            }}
                                        >
                                            <span className="truncate">
                                                {vessel.name}
                                            </span>
                                            {value === vessel.name && (
                                                <CheckIcon className="ml-auto size-4" />
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>

                        {searchValue.trim() !== '' && !exactMatch && (
                            <>
                                <CommandSeparator />
                                <div className="p-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-9 w-full justify-start text-sm font-normal"
                                        onClick={handleOpenCreateModal}
                                    >
                                        <PlusIcon
                                            aria-hidden="true"
                                            className="mr-2 size-4 opacity-60"
                                        />
                                        <span className="truncate">
                                            Créer le navire "
                                            {searchValue.trim()}"...
                                        </span>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>

            <VesselFormModal
                vessel={
                    searchValue.trim() ? { name: searchValue.trim() } : null
                }
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccessCreated={handleCreatedSuccess}
            />

            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
