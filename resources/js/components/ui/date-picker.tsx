"use strict";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
    className?: string;
    date?: Date;
    onDateChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function DatePicker({
                               className,
                               date,
                               onDateChange,
                               placeholder = "Choisir une date",
                               disabled = false,
                           }: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        disabled={disabled}
                        className={cn(
                            "h-9 w-full justify-start text-left text-sm font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        {date ? (
                            format(date, "dd MMMM yyyy", { locale: fr })
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="single"
                        defaultMonth={date}
                        selected={date}
                        onSelect={(selectedDate) => {
                            onDateChange?.(selectedDate);
                            setOpen(false);
                        }}
                        locale={fr}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
