<?php

namespace App\Enums;

use Carbon\CarbonInterface;

enum ArrivalPunctuality: string
{
    case ON_TIME = 'on_time';
    case EARLY = 'early';
    case LATE = 'late';

    public function label(): string
    {
        return match ($this) {
            self::ON_TIME => "À l'heure",
            self::EARLY => 'En avance',
            self::LATE => 'En retard',
        };
    }

    public static function fromDates(CarbonInterface $eta, CarbonInterface $ata): self
    {
        return match (true) {
            $ata->isSameDay($eta) => self::ON_TIME,
            $ata->lt($eta) => self::EARLY,
            default => self::LATE,
        };
    }
}
