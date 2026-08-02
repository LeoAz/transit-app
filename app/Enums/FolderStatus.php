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
            self::PENDING => 'Non commencé',
            self::IN_PROGRESS => 'En cours',
            self::OVERDUE => 'En dépassement',
            self::CLOSED => 'Clôturé',
            self::CLOSED_LATE => 'Clôturé en retard',
        };
    }

    public static function options(): array
    {
        return array_map(fn (self $status) => [
            'value' => $status->value,
            'label' => $status->label(),
        ], self::cases());
    }
}
