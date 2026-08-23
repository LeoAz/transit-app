<?php

namespace Tests\Feature\Reports;

use App\Enums\FolderStatus;
use App\Enums\UserRole;
use App\Models\Folder;
use App\Models\Holiday;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

uses(RefreshDatabase::class);

test('closed folders report computes delay in working days', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);

    Holiday::create(['date' => '2026-08-05', 'label' => 'Holiday']);

    $folder = Folder::factory()->create([
        'status' => FolderStatus::CLOSED_LATE,
        'ata' => '2026-08-01',
    ]);

    Carbon::setTestNow('2026-08-10 10:00:00');
    $folder->touch();
    Carbon::setTestNow();

    $response = $this->actingAs($user)->get('/reports/closed-folders?period=custom&start_date=2026-08-01&end_date=2026-08-31');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('reports/closed-folders')
        ->where('rows.0.folder_number', $folder->folder_number)
        ->where('rows.0.is_late', true)
        ->where('rows.0.delay_working_days', 5)
    );
});

test('closed folders report excludes non-closed statuses', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);

    Folder::factory()->create(['status' => FolderStatus::IN_PROGRESS]);
    Folder::factory()->create(['status' => FolderStatus::CLOSED]);

    $response = $this->actingAs($user)->get('/reports/closed-folders?period=year');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('reports/closed-folders')
        ->has('rows', 1)
    );
});
