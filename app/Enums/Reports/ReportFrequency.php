<?php

namespace App\Enums\Reports;

enum ReportFrequency: string
{
    case DAILY = 'daily';
    case WEEKLY = 'weekly';
    case MONTHLY = 'monthly';

    public function label(): string
    {
        return match ($this) {
            self::DAILY => 'Quotidien',
            self::WEEKLY => 'Hebdomadaire',
            self::MONTHLY => 'Mensuel',
        };
    }

    /**
     * Preset compris par App\Data\Reports\ReportPeriod::forPreset().
     */
    public function periodPreset(): string
    {
        return match ($this) {
            self::DAILY => 'day',
            self::WEEKLY => 'week',
            self::MONTHLY => 'month',
        };
    }

    public static function options(): array
    {
        return array_map(fn (self $frequency) => [
            'value' => $frequency->value,
            'label' => $frequency->label(),
        ], self::cases());
    }
}
