<?php

namespace App\Enums\Reports;

enum ReportType: string
{
    case CLIENT_SITUATION = 'client_situation';
    case SHIPPER_SITUATION = 'shipper_situation';
    case ONGOING_FOLDERS = 'ongoing_folders';
    case CLOSED_FOLDERS = 'closed_folders';
    case DAILY = 'daily';
    case ARRIVAL_PUNCTUALITY = 'arrival_punctuality';

    public function label(): string
    {
        return match ($this) {
            self::CLIENT_SITUATION => 'Situation par client',
            self::SHIPPER_SITUATION => 'Situation par chargeur',
            self::ONGOING_FOLDERS => 'Dossiers en cours',
            self::CLOSED_FOLDERS => 'Dossiers clôturés',
            self::DAILY => 'Rapport journalier',
            self::ARRIVAL_PUNCTUALITY => 'Ponctualité des arrivées',
        };
    }

    public static function options(): array
    {
        return array_map(fn (self $type) => [
            'value' => $type->value,
            'label' => $type->label(),
        ], self::cases());
    }
}
