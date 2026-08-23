import { FileSpreadsheetIcon, FileTextIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ReportExportButtonsProps {
    pdfUrl: string;
    excelUrl: string;
}

export function ReportExportButtons({
    pdfUrl,
    excelUrl,
}: ReportExportButtonsProps) {
    return (
        <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
                <a href={pdfUrl}>
                    <FileTextIcon className="mr-2 size-4" />
                    Exporter PDF
                </a>
            </Button>
            <Button asChild variant="outline" size="sm">
                <a href={excelUrl}>
                    <FileSpreadsheetIcon className="mr-2 size-4" />
                    Exporter Excel
                </a>
            </Button>
        </div>
    );
}
