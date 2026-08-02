<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\LoadingController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VesselController;
use Illuminate\Support\Facades\Route;

// --- Public Routes ---
Route::inertia('/', 'welcome')->name('home');

// --- Authenticated Routes ---
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Référentiels
    Route::prefix('referential')->name('referential.')->group(function () {
        Route::apiResource('customers', CustomerController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('vessels', VesselController::class);
        Route::apiResource('holidays', HolidayController::class);
    });

    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');

    // Gestion des Utilisateurs et Dossiers
    Route::resource('users', UserController::class);
    Route::resource('folders', FolderController::class);

    // Actions spécifiques sur les Dossiers
    Route::prefix('folders/{folder}')->name('folders.')->group(function () {
        Route::post('assign', [FolderController::class, 'assign'])->name('assign');
        Route::post('validate-arrival', [FolderController::class, 'validateArrival'])->name('validate-arrival');

        // Gestion des Chargements (Loadings)
        Route::apiResource('loadings', LoadingController::class)->only(['store', 'update', 'destroy']);

        // Gestion des Documents
        Route::post('documents', [DocumentController::class, 'store'])->name('documents.store');
    });

    Route::get('documents/{document}', [DocumentController::class, 'show'])->name('documents.show');
    Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');
    Route::get('documents/download-temp/{filename}', [DocumentController::class, 'downloadTemp'])->name('documents.download-temp');
    Route::post('documents/download-bulk', [DocumentController::class, 'downloadBulk'])->name('documents.download-bulk');
    Route::get('documents/check-zip/{taskId}', [DocumentController::class, 'checkZipStatus'])->name('documents.check-zip');
    Route::delete('documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');
});

require __DIR__.'/settings.php';
