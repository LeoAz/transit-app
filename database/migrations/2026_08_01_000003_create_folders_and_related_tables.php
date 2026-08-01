<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('folders', function (Blueprint $table) {
            $table->id();
            $table->string('folder_number')->unique();
            $table->date('bl_received_at');
            $table->string('bl_number');
            $table->foreignId('customer_id')->constrained();
            $table->integer('container_type'); // 20, 40, 45
            $table->integer('container_count');
            $table->foreignId('product_id')->constrained('products');
            $table->string('vessel_name');
            $table->date('eta');
            $table->date('ata')->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('shipper_id')->nullable()->constrained('shippers');
            $table->string('status')->default('pending');
            $table->date('loading_deadline')->nullable();
            $table->timestamps();
        });

        Schema::create('loadings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('folder_id')->constrained()->onDelete('cascade');
            $table->date('loading_date');
            $table->string('truck_number');
            $table->string('carrier')->nullable();
            $table->string('driver')->nullable();
            $table->integer('loaded_container_count');
            $table->integer('container_type');
            $table->text('container_numbers');
            $table->string('destination');
            $table->text('notes')->nullable();
            $table->foreignId('user_id')->constrained(); // User who recorded the loading
            $table->timestamps();
        });

        Schema::create('assignment_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('folder_id')->constrained()->onDelete('cascade');
            $table->foreignId('previous_shipper_id')->nullable()->constrained('shippers');
            $table->foreignId('new_shipper_id')->constrained('shippers');
            $table->timestamp('changed_at');
            $table->text('reason')->nullable();
            $table->foreignId('user_id')->constrained(); // Supervisor who made the change
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignment_histories');
        Schema::dropIfExists('loadings');
        Schema::dropIfExists('folders');
    }
};
