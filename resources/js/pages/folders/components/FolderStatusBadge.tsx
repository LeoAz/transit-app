import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import type { FolderStatus } from '@/types/transit';

interface FolderStatusBadgeProps {
    status: FolderStatus;
    statuses?: Array<{ value: FolderStatus; label: string }>;
}

export function FolderStatusBadge({
    status,
    statuses = [],
}: FolderStatusBadgeProps) {
    const statusObj = statuses.find((s) => s.value === status);
    const label = statusObj?.label || status;

    switch (status) {
        case 'pending':
            return <Badge variant="outline">{label}</Badge>;
        case 'in_progress':
            return (
                <Badge
                    variant="secondary"
                    className="border-blue-200 bg-blue-100 text-blue-800"
                >
                    {label}
                </Badge>
            );
        case 'overdue':
            return <Badge variant="destructive">{label}</Badge>;
        case 'closed':
            return (
                <Badge className="border-green-200 bg-green-100 text-green-800">
                    {label}
                </Badge>
            );
        case 'closed_late':
            return (
                <Badge className="border-orange-200 bg-orange-100 text-orange-800">
                    {label}
                </Badge>
            );
        default:
            return <Badge variant="outline">{label}</Badge>;
    }
}
