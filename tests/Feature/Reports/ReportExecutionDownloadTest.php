<?php

namespace Tests\Feature\Reports;

use App\Models\ReportExecution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('the owner can download a generated report execution', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    Storage::disk('public')->put('reports/scheduled/1/rapport.pdf', 'contenu-pdf');

    $execution = ReportExecution::factory()->create([
        'user_id' => $user->id,
        'status' => 'sent',
        'file_path' => 'reports/scheduled/1/rapport.pdf',
        'file_name' => 'rapport.pdf',
    ]);

    $response = $this->actingAs($user)->get("/reports/scheduled/executions/{$execution->id}/download");

    $response->assertOk();
});

test('a failed execution without a file returns 404', function () {
    $user = User::factory()->create();

    $execution = ReportExecution::factory()->create([
        'user_id' => $user->id,
        'status' => 'failed',
        'file_path' => null,
        'file_name' => null,
    ]);

    $this->actingAs($user)
        ->get("/reports/scheduled/executions/{$execution->id}/download")
        ->assertNotFound();
});

test('another user cannot download someone elses execution', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();

    $execution = ReportExecution::factory()->create([
        'user_id' => $owner->id,
        'status' => 'sent',
    ]);

    $this->actingAs($intruder)
        ->get("/reports/scheduled/executions/{$execution->id}/download")
        ->assertForbidden();
});
