<?php

namespace App\Enums;

enum FolderStatus: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case OVERDUE = 'overdue';
    case CLOSED = 'closed';
    case CLOSED_LATE = 'closed_late';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'En attente',
            self::IN_PROGRESS => 'En cours',
            self::OVERDUE => 'En dépassement',
            self::CLOSED => 'Clôturé',
            self::CLOSED_LATE => 'Clôturé en retard',
        };
    }
}
