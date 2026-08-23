import * as React from 'react';

interface ReportHeaderProps {
    title: string;
    description: string;
    actions?: React.ReactNode;
}

export function ReportHeader({
    title,
    description,
    actions,
}: ReportHeaderProps) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    {title}
                </h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {actions}
        </div>
    );
}
