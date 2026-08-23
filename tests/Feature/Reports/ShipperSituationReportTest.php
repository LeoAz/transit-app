<?php

namespace Tests\Feature\Reports;

use App\Enums\FolderStatus;
use App\Enums\UserRole;
use App\Models\Folder;
use App\Models\Loading;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

uses(RefreshDatabase::class);

test('shipper situation report buckets folders by status and sums volume treated', function () {
    $admin = User::factory()->create(['role' => UserRole::ADMIN]);
    $shipper = User::factory()->create(['role' => UserRole::SHIPPER]);

    $inProgress = Folder::factory()->create(['shipper_id' => $shipper->id, 'status' => FolderStatus::IN_PROGRESS]);
    Folder::factory()->create(['shipper_id' => $shipper->id, 'status' => FolderStatus::CLOSED]);
    Folder::factory()->create(['shipper_id' => $shipper->id, 'status' => FolderStatus::CLOSED_LATE]);

    Loading::factory()->create([
        'folder_id' => $inProgress->id,
        'loaded_container_count' => 7,
        'loading_date' => Carbon::now(),
    ]);

    $response = $this->actingAs($admin)->get('/reports/shipper-situation?period=year');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('reports/shipper-situation')
        ->where('rows.0.shipper', $shipper->name)
        ->where('rows.0.folders_assigned_count', 3)
        ->where('rows.0.folders_in_progress_count', 1)
        ->where('rows.0.folders_closed_count', 2)
        ->where('rows.0.volume_treated', 7)
    );
});

test('a shipper user is scoped to only their own row', function () {
    $shipper = User::factory()->create(['role' => UserRole::SHIPPER]);
    $otherShipper = User::factory()->create(['role' => UserRole::SHIPPER]);

    Folder::factory()->create(['shipper_id' => $shipper->id]);
    Folder::factory()->create(['shipper_id' => $otherShipper->id]);

    $response = $this->actingAs($shipper)->get('/reports/shipper-situation?period=year');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('reports/shipper-situation')
        ->has('rows', 1)
        ->where('rows.0.shipper_id', $shipper->id)
    );
});
