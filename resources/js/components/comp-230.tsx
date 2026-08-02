"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Option {
    value: string;
    label: string;
    searchLabel?: string;
    render?: React.ReactNode;
}

interface ComponentProps {
    id?: string;
    label?: string;
    options: Option[];
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
    error?: string;
    shouldFilter?: boolean;
}

export default function RoleSelect({
    id,
    label,
    options,
    value,
    onValueChange,
    placeholder = "Sélectionner...",
    emptyMessage = "Aucun résultat trouvé.",
    className,
    error,
    shouldFilter = true,
}: ComponentProps) {
    const generatedId = useId();
    const currentId = id || generatedId;
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className={cn("*:not-first:mt-2", className)}>
            {label && <Label htmlFor={currentId}>{label}</Label>}
            <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]",
                            error && "border-destructive",
                        )}
                        id={currentId}
                        role="combobox"
                        variant="outline"
                    >
                        <span
                            className={cn(
                                "truncate",
                                !value && "text-muted-foreground",
                            )}
                        >
                            {value
                                ? options.find(
                                      (option) => option.value === value,
                                  )?.render || options.find(
                                      (option) => option.value === value,
                                  )?.label
                                : placeholder}
                        </span>
                        <ChevronDownIcon
                            aria-hidden="true"
                            className="shrink-0 text-muted-foreground/80"
                            size={16}
                        />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
                >
                    <Command shouldFilter={shouldFilter}>
                        <CommandInput placeholder={placeholder} />
                        <CommandList>
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            onValueChange(
                                                option.value === value
                                                    ? ""
                                                    : option.value,
                                            );
                                            setOpen(false);
                                        }}
                                        value={option.searchLabel || option.label}
                                    >
                                        {option.render || option.label}
                                        {value === option.value && (
                                            <CheckIcon
                                                className="ml-auto"
                                                size={16}
                                            />
                                        )}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
