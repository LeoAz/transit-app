<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\LoadingController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReportExecutionController;
use App\Http\Controllers\ReportExportController;
use App\Http\Controllers\ReportScheduleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VesselController;
use Illuminate\Support\Facades\Route;

// --- Public Routes ---
Route::get('/', function () {
    return redirect()->route('login');
})->middleware('guest')->name('home');

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

    // Rapports et situations
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', [ReportController::class, 'index'])->name('index');

        Route::get('/client-situation', [ReportController::class, 'clientSituation'])->name('client-situation');
        Route::get('/client-situation/export/pdf', [ReportExportController::class, 'clientSituationPdf'])->name('client-situation.export.pdf');
        Route::get('/client-situation/export/excel', [ReportExportController::class, 'clientSituationExcel'])->name('client-situation.export.excel');

        Route::get('/shipper-situation', [ReportController::class, 'shipperSituation'])->name('shipper-situation');
        Route::get('/shipper-situation/export/pdf', [ReportExportController::class, 'shipperSituationPdf'])->name('shipper-situation.export.pdf');
        Route::get('/shipper-situation/export/excel', [ReportExportController::class, 'shipperSituationExcel'])->name('shipper-situation.export.excel');

        Route::get('/ongoing-folders', [ReportController::class, 'ongoingFolders'])->name('ongoing-folders');
        Route::get('/ongoing-folders/export/pdf', [ReportExportController::class, 'ongoingFoldersPdf'])->name('ongoing-folders.export.pdf');
        Route::get('/ongoing-folders/export/excel', [ReportExportController::class, 'ongoingFoldersExcel'])->name('ongoing-folders.export.excel');

        Route::get('/closed-folders', [ReportController::class, 'closedFolders'])->name('closed-folders');
        Route::get('/closed-folders/export/pdf', [ReportExportController::class, 'closedFoldersPdf'])->name('closed-folders.export.pdf');
        Route::get('/closed-folders/export/excel', [ReportExportController::class, 'closedFoldersExcel'])->name('closed-folders.export.excel');

        Route::get('/daily', [ReportController::class, 'dailyReport'])->name('daily');
        Route::get('/daily/export/pdf', [ReportExportController::class, 'dailyPdf'])->name('daily.export.pdf');
        Route::get('/daily/export/excel', [ReportExportController::class, 'dailyExcel'])->name('daily.export.excel');

        Route::get('/arrival-punctuality', [ReportController::class, 'arrivalPunctuality'])->name('arrival-punctuality');
        Route::get('/arrival-punctuality/export/pdf', [ReportExportController::class, 'arrivalPunctualityPdf'])->name('arrival-punctuality.export.pdf');
        Route::get('/arrival-punctuality/export/excel', [ReportExportController::class, 'arrivalPunctualityExcel'])->name('arrival-punctuality.export.excel');
    });

    // Programmation d'envoi automatique des rapports par e-mail
    Route::prefix('reports/scheduled')->name('reports.scheduled.')->group(function () {
        Route::get('/', [ReportScheduleController::class, 'index'])->name('index');
        Route::post('/', [ReportScheduleController::class, 'store'])->name('store');
        Route::put('/{reportSchedule}', [ReportScheduleController::class, 'update'])->name('update');
        Route::delete('/{reportSchedule}', [ReportScheduleController::class, 'destroy'])->name('destroy');
        Route::get('/executions/{reportExecution}/download', [ReportExecutionController::class, 'download'])->name('executions.download');
    });
});

require __DIR__.'/settings.php';
