<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['Electronique', 'Textile', 'Alimentaire', 'Construction', 'Automobile'];

        foreach ($categories as $category) {
            Product::factory()->count(5)->create([
                'category' => $category,
            ]);
        }
    }
}
