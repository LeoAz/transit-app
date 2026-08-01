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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('folder_id')->constrained()->onDelete('cascade');
            $table->string('document_type'); // Scanned BL, Delivery Note, etc.
            $table->string('file_name');
            $table->string('file_path');
            $table->string('format');
            $table->integer('size');
            $table->foreignId('user_id')->constrained();
            $table->timestamps();
        });

        Schema::create('user_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('email_notifications_eta')->default(true);
            $table->boolean('email_notifications_ata')->default(true);
            $table->boolean('email_notifications_overdue')->default(true);
            $table->boolean('app_notifications_eta')->default(true);
            $table->boolean('app_notifications_ata')->default(true);
            $table->boolean('app_notifications_overdue')->default(true);
            $table->string('daily_report_frequency')->default('none'); // daily, weekly, none
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_preferences');
        Schema::dropIfExists('documents');
    }
};
