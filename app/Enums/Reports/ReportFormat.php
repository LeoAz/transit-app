<?php

namespace App\Enums\Reports;

enum ReportFormat: string
{
    case PDF = 'pdf';
    case EXCEL = 'excel';

    public function label(): string
    {
        return match ($this) {
            self::PDF => 'PDF',
            self::EXCEL => 'Excel',
        };
    }

    public static function options(): array
    {
        return array_map(fn (self $format) => [
            'value' => $format->value,
            'label' => $format->label(),
        ], self::cases());
    }
}
