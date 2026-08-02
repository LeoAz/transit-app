import { ChevronDown, ChevronUp, Search } from "lucide-react";
import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";

export interface Column<T> {
    header: string;
    accessorKey: keyof T | string;
    sortable?: boolean;
    cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchPlaceholder?: string;
    searchKey?: keyof T;
    filters?: (data: T[]) => T[];
    renderFilters?: React.ReactNode;
}

export function DataTable<T>({
    data,
    columns,
    searchPlaceholder = "Rechercher...",
    searchKey,
    filters,
    renderFilters,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortConfig, setSortConfig] = React.useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";

        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === "asc"
        ) {
            direction = "desc";
        }

        setSortConfig({ key, direction });
    };

    const filteredData = React.useMemo(() => {
        let items = [...data];

        // Apply external filters first
        if (filters) {
            items = filters(items);
        }

        if (searchQuery) {
            items = items.filter((item) => {
                if (searchKey) {
                    const value = item[searchKey];

                    return String(value)
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase());
                }

                // Global search: check all visible columns
                return columns.some((column) => {
                    const value = item[column.accessorKey as keyof T];

                    if (
                        value !== null &&
                        value !== undefined &&
                        (typeof value === "string" || typeof value === "number")
                    ) {
                        return String(value)
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase());
                    }

                    return false;
                });
            });
        }

        if (sortConfig) {
            items.sort((a, b) => {
                const aValue = a[sortConfig.key as keyof T];
                const bValue = b[sortConfig.key as keyof T];

                if (aValue < bValue) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }

                if (aValue > bValue) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }

                return 0;
            });
        }

        return items;
    }, [data, searchQuery, searchKey, sortConfig, filters, columns]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="relative flex w-full max-w-sm items-center">
                    <Search className="text-muted-foreground absolute left-2.5 size-4" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 pl-9"
                    />
                </div>
                {renderFilters && (
                    <div className="flex flex-wrap items-center gap-2">
                        {renderFilters}
                    </div>
                )}
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    key={column.accessorKey.toString()}
                                    className={
                                        column.sortable
                                            ? "cursor-pointer select-none"
                                            : ""
                                    }
                                    onClick={() =>
                                        column.sortable &&
                                        handleSort(column.accessorKey.toString())
                                    }
                                >
                                    <div className="flex items-center gap-1">
                                        {column.header}
                                        {column.sortable &&
                                            sortConfig?.key ===
                                                column.accessorKey && (
                                                <>
                                                    {sortConfig.direction ===
                                                    "asc" ? (
                                                        <ChevronUp className="size-4" />
                                                    ) : (
                                                        <ChevronDown className="size-4" />
                                                    )}
                                                </>
                                            )}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <TableRow key={index}>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.accessorKey.toString()}
                                        >
                                            {column.cell
                                                ? column.cell(item)
                                                : (item[
                                                      column.accessorKey as keyof T
                                                  ] as React.ReactNode)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Aucun résultat.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
