<?php

namespace Database\Seeders;

use App\Models\Holiday;
use Illuminate\Database\Seeder;

class HolidaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $holidays = [
            ['date' => '2026-01-01', 'label' => 'Jour de l\'an'],
            ['date' => '2026-04-06', 'label' => 'Lundi de Pâques'],
            ['date' => '2026-05-01', 'label' => 'Fête du Travail'],
            ['date' => '2026-05-08', 'label' => 'Victoire 1945'],
            ['date' => '2026-05-14', 'label' => 'Ascension'],
            ['date' => '2026-05-25', 'label' => 'Lundi de Pentecôte'],
            ['date' => '2026-07-14', 'label' => 'Fête Nationale'],
            ['date' => '2026-08-15', 'label' => 'Assomption'],
            ['date' => '2026-11-01', 'label' => 'Toussaint'],
            ['date' => '2026-11-11', 'label' => 'Armistice 1918'],
            ['date' => '2026-12-25', 'label' => 'Noël'],
        ];

        foreach ($holidays as $holiday) {
            Holiday::create($holiday);
        }
    }
}
