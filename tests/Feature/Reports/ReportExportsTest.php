<?php

namespace Tests\Feature\Reports;

use App\Enums\UserRole;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

dataset('report_export_routes', [
    'client-situation' => ['reports/client-situation/export/pdf', 'reports/client-situation/export/excel'],
    'shipper-situation' => ['reports/shipper-situation/export/pdf', 'reports/shipper-situation/export/excel'],
    'ongoing-folders' => ['reports/ongoing-folders/export/pdf', 'reports/ongoing-folders/export/excel'],
    'closed-folders' => ['reports/closed-folders/export/pdf', 'reports/closed-folders/export/excel'],
    'daily' => ['reports/daily/export/pdf', 'reports/daily/export/excel'],
    'arrival-punctuality' => ['reports/arrival-punctuality/export/pdf', 'reports/arrival-punctuality/export/excel'],
]);

test('report exports return downloadable files', function (string $pdfRoute, string $excelRoute) {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    Folder::factory()->count(2)->create();

    $pdfResponse = $this->actingAs($user)->get('/'.$pdfRoute.'?period=year');
    $pdfResponse->assertOk();
    expect($pdfResponse->headers->get('content-type'))->toContain('application/pdf');

    $excelResponse = $this->actingAs($user)->get('/'.$excelRoute.'?period=year');
    $excelResponse->assertOk();
    expect($excelResponse->headers->get('content-type'))->toContain('spreadsheetml');
})->with('report_export_routes');
