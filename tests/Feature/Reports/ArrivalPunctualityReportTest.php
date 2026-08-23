<?php

namespace Tests\Feature\Reports;

use App\Enums\UserRole;
use App\Models\Folder;
use App\Models\User;
use App\Models\Vessel;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('arrival punctuality report groups folders by company and computes rate', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    $vessel = Vessel::factory()->create(['company' => 'Maersk']);

    Folder::factory()->create(['vessel_id' => $vessel->id, 'eta' => '2026-08-01', 'ata' => '2026-08-01']);
    Folder::factory()->create(['vessel_id' => $vessel->id, 'eta' => '2026-08-05', 'ata' => '2026-08-03']);
    Folder::factory()->create(['vessel_id' => $vessel->id, 'eta' => '2026-08-10', 'ata' => '2026-08-12']);

    $response = $this->actingAs($user)->get('/reports/arrival-punctuality?period=year');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('reports/arrival-punctuality')
        ->where('rows.0.company', 'Maersk')
        ->where('rows.0.total', 3)
        ->where('rows.0.on_time', 1)
        ->where('rows.0.early', 1)
        ->where('rows.0.late', 1)
        ->where('rows.0.punctuality_rate', 66.7)
    );
});

test('folders without a linked vessel are grouped as unknown company', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);

    Folder::factory()->create(['vessel_id' => null, 'eta' => '2026-08-01', 'ata' => '2026-08-01']);

    $response = $this->actingAs($user)->get('/reports/arrival-punctuality?period=year');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('reports/arrival-punctuality')
        ->where('rows.0.company', 'Compagnie inconnue')
    );
});
