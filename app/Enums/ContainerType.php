<?php

namespace App\Enums;

enum ContainerType: int
{
    case TYPE_20 = 20;
    case TYPE_40 = 40;
    case TYPE_45 = 45;

    public function label(): string
    {
        return match ($this) {
            self::TYPE_20 => '20 pieds',
            self::TYPE_40 => '40 pieds',
            self::TYPE_45 => '45 pieds',
        };
    }
}
