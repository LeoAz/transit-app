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
        // 1. Avant de supprimer, nous devons migrer les données si nécessaire.
        // On suppose que les utilisateurs liés aux chargeurs existent déjà dans 'users'.
        // Si on veut préserver les liens, on doit mettre à jour les IDs dans folders et assignment_histories.

        // Récupérer les correspondances shipper.id -> shipper.user_id
        $shippers = DB::table('shippers')->select('id', 'user_id')->get();

        foreach ($shippers as $shipper) {
            if ($shipper->user_id) {
                // Mettre à jour folders
                DB::table('folders')
                    ->where('shipper_id', $shipper->id)
                    ->update(['shipper_id' => $shipper->user_id]);

                // Mettre à jour assignment_histories
                DB::table('assignment_histories')
                    ->where('previous_shipper_id', $shipper->id)
                    ->update(['previous_shipper_id' => $shipper->user_id]);

                DB::table('assignment_histories')
                    ->where('new_shipper_id', $shipper->id)
                    ->update(['new_shipper_id' => $shipper->user_id]);
            }
        }

        // 2. Supprimer les contraintes de clés étrangères pointant vers 'shippers'
        Schema::table('folders', function (Blueprint $table) {
            $table->dropForeign(['shipper_id']);
        });

        Schema::table('assignment_histories', function (Blueprint $table) {
            $table->dropForeign(['previous_shipper_id']);
            $table->dropForeign(['new_shipper_id']);
        });

        // 3. Modifier les colonnes pour pointer vers 'users'
        Schema::table('folders', function (Blueprint $table) {
            $table->foreign('shipper_id')->references('id')->on('users')->onDelete('set null');
        });

        Schema::table('assignment_histories', function (Blueprint $table) {
            $table->foreign('previous_shipper_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('new_shipper_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 4. Supprimer la table 'shippers'
        Schema::dropIfExists('shippers');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Difficile de revenir en arrière parfaitement sans la table shippers,
        // mais on peut au moins restaurer les contraintes vers une table (qui devra être recréée)

        Schema::create('shippers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('code')->unique();
            $table->string('last_name');
            $table->string('first_name');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('zone')->nullable();
            $table->timestamps();
        });

        Schema::table('folders', function (Blueprint $table) {
            $table->dropForeign(['shipper_id']);
        });

        Schema::table('assignment_histories', function (Blueprint $table) {
            $table->dropForeign(['previous_shipper_id']);
            $table->dropForeign(['new_shipper_id']);
        });

        Schema::table('folders', function (Blueprint $table) {
            $table->foreign('shipper_id')->references('id')->on('shippers')->onDelete('set null');
        });

        Schema::table('assignment_histories', function (Blueprint $table) {
            $table->foreign('previous_shipper_id')->references('id')->on('shippers')->onDelete('set null');
            $table->foreign('new_shipper_id')->references('id')->on('shippers')->onDelete('cascade');
        });
    }
};
