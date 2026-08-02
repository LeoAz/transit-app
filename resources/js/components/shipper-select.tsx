import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { User } from '@/types/user';

interface ShipperSelectProps {
    shippers?: User[];
    value?: string;
    onValueChange: (value: string) => void;
    error?: string;
}

export function ShipperSelect({
    shippers = [],
    value,
    onValueChange,
    error,
}: ShipperSelectProps) {
    const [open, setOpen] = React.useState(false);

    const selectedShipper = shippers.find((s) => s.id.toString() === value);

    const getDisplayName = (shipper: any) => {
        if (shipper.name) return shipper.name;
        return `${shipper.first_name ?? ''} ${shipper.last_name ?? ''}`.trim();
    };

    return (
        <div className="space-y-1">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            'h-9 w-full justify-between text-sm font-normal',
                            !value && 'text-muted-foreground',
                            error && 'border-destructive',
                        )}
                    >
                        {selectedShipper ? (
                            <span>
                                {getDisplayName(selectedShipper)}{' '}
                                {selectedShipper.zone &&
                                    `(${selectedShipper.zone})`}
                            </span>
                        ) : (
                            'Rechercher et sélectionner un agent...'
                        )}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[380px] p-0" align="start">
                    <Command>
                        <CommandInput
                            placeholder="Rechercher un chargeur..."
                            className="h-9 text-sm"
                        />
                        <CommandList>
                            <CommandEmpty className="py-2.5 text-center text-xs text-muted-foreground">
                                Aucun chargeur trouvé.
                            </CommandEmpty>
                            <CommandGroup>
                                {(shippers ?? []).map((shipper: any) => {
                                    const isSelected =
                                        shipper.id.toString() === value;
                                    const displayName = getDisplayName(shipper);
                                    const searchValue =
                                        `${displayName} ${shipper.zone ?? ''}`
                                            .trim()
                                            .toLowerCase();

                                    return (
                                        <CommandItem
                                            key={shipper.id}
                                            value={searchValue}
                                            onSelect={() => {
                                                onValueChange(
                                                    shipper.id.toString(),
                                                );
                                                setOpen(false);
                                            }}
                                            className="cursor-pointer text-sm"
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 size-4',
                                                    isSelected
                                                        ? 'opacity-100'
                                                        : 'opacity-0',
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span>{displayName}</span>
                                                {shipper.zone && (
                                                    <span className="text-xs text-muted-foreground">
                                                        Zone : {shipper.zone}
                                                    </span>
                                                )}
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
