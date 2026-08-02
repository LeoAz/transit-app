"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useId, useState } from "react";
import type { ReactNode, ElementType } from "react";

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
  icon?: ElementType;
  number?: string | number;
  render?: ReactNode;
}

interface ComponentProps {
  id?: string;
  label?: string;
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  error?: string;
}

export default function IconSelect({
  id,
  label,
  options,
  value,
  onValueChange,
  placeholder = "Sélectionner...",
  searchPlaceholder = "Rechercher...",
  emptyMessage = "Aucun résultat trouvé.",
  className,
  error,
}: ComponentProps) {
  const generatedId = useId();
  const currentId = id || generatedId;
  const [open, setOpen] = useState<boolean>(false);

  const selectedOption = options.find((option) => option.value === value);

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
            {value && selectedOption ? (
              <span className="flex min-w-0 items-center gap-2">
                {selectedOption.icon && (
                  <selectedOption.icon className="size-4 text-muted-foreground" />
                )}
                <span className="truncate">
                  {selectedOption.label}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
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
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    className="flex items-center justify-between"
                    key={option.value}
                    onSelect={() => {
                      onValueChange(option.value === value ? "" : option.value);
                      setOpen(false);
                    }}
                    value={option.label}
                  >
                    <div className="flex items-center gap-2">
                      {option.icon ? (
                        <option.icon className="size-4 text-muted-foreground" />
                      ) : (
                        <div className="size-4" />
                      )}
                      {option.render || option.label}
                    </div>
                    <div className="flex items-center gap-2">
                      {option.number !== undefined && (
                        <span className="text-muted-foreground text-xs">
                          {option.number.toLocaleString()}
                        </span>
                      )}
                      {value === option.value && (
                        <CheckIcon className="size-4 text-primary ml-auto" />
                      )}
                    </div>
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
