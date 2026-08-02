<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un administrateur par défaut
        $admin = User::factory()->create([
            'name' => 'Admin Transit',
            'email' => 'admin@transit.com',
            'password' => Hash::make('password'),
            'role' => UserRole::ADMIN,
            'code' => 'ADM-0001',
        ]);
        UserPreference::factory()->create(['user_id' => $admin->id]);

        // Créer des chargeurs (Shippers)
        User::factory()->count(5)->create([
            'role' => UserRole::SHIPPER,
        ])->each(function ($user) {
            UserPreference::factory()->create(['user_id' => $user->id]);
        });
    }
}
