<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('folders', function (Blueprint $table) {
            $table->foreignId('vessel_id')->nullable()->after('vessel_name')->constrained('vessels')->nullOnDelete();
        });

        // Backfill : rattache les dossiers existants à un navire du référentiel
        // lorsque leur "vessel_name" en texte libre correspond à un nom connu.
        $vessels = DB::table('vessels')->select('id', 'name')->get();

        foreach ($vessels as $vessel) {
            DB::table('folders')
                ->whereRaw('LOWER(TRIM(vessel_name)) = ?', [mb_strtolower(trim($vessel->name))])
                ->whereNull('vessel_id')
                ->update(['vessel_id' => $vessel->id]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('folders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('vessel_id');
        });
    }
};
