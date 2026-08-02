<?php

namespace App\Enums;

enum ContainerType: int
{
    case TWENTY = 20;
    case FORTY = 40;
    case FORTY_FIVE = 45;

    public function label(): string
    {
        return match ($this) {
            self::TWENTY => '20 pieds',
            self::FORTY => '40 pieds',
            self::FORTY_FIVE => '45 pieds',
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
