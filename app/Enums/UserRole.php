<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case SUPERVISOR = 'supervisor';
    case SHIPPER = 'shipper';
    case ENTRY_AGENT = 'entry_agent';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrateur',
            self::SUPERVISOR => 'Superviseur',
            self::SHIPPER => 'Chargeur',
            self::ENTRY_AGENT => 'Agent de saisie',
        };
    }
}
