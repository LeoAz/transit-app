<?php

namespace Database\Seeders;

use App\Enums\FolderStatus;
use App\Enums\UserRole;
use App\Models\AssignmentHistory;
use App\Models\AuditLog;
use App\Models\Customer;
use App\Models\Document;
use App\Models\Folder;
use App\Models\Loading;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CustomerSeeder::class,
            ProductSeeder::class,
            VesselSeeder::class,
            HolidaySeeder::class,
        ]);

        $users = User::all();
        $shippers = User::where('role', UserRole::SHIPPER)->get();
        $customers = Customer::all();
        $products = Product::all();

        // Créer des dossiers avec leurs relations
        Folder::factory()->count(50)->create([
            'customer_id' => fn () => $customers->random()->id,
            'product_id' => fn () => $products->random()->id,
            'shipper_id' => fn () => $shippers->random()->id,
        ])->each(function ($folder) use ($users) {
            // Créer des documents pour chaque dossier
            Document::factory()->count(rand(2, 5))->create([
                'folder_id' => $folder->id,
                'user_id' => $users->random()->id,
            ]);

            // Créer des chargements pour certains dossiers
            if (in_array($folder->status, [FolderStatus::IN_PROGRESS, FolderStatus::CLOSED])) {
                Loading::factory()->count(rand(1, 3))->create([
                    'folder_id' => $folder->id,
                    'user_id' => $users->random()->id,
                ]);
            }

            // Créer un historique d'assignation
            AssignmentHistory::factory()->create([
                'folder_id' => $folder->id,
                'user_id' => $users->random()->id,
            ]);

            // Créer des logs d'audit
            AuditLog::factory()->count(rand(1, 3))->create([
                'auditable_id' => $folder->id,
                'user_id' => $users->random()->id,
            ]);
        });
    }
}
