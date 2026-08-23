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

test('daily report only shows today loadings and near-deadline alerts', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);

    Carbon::setTestNow('2026-08-10 09:00:00');

    $todayFolder = Folder::factory()->create(['status' => FolderStatus::PENDING, 'loading_deadline' => null]);
    Loading::factory()->create(['folder_id' => $todayFolder->id, 'loading_date' => '2026-08-10']);
    $otherDayFolder = Folder::factory()->create(['status' => FolderStatus::PENDING, 'loading_deadline' => null]);
    Loading::factory()->create(['folder_id' => $otherDayFolder->id, 'loading_date' => '2026-08-09']);

    $overdueFolder = Folder::factory()->create(['status' => FolderStatus::OVERDUE, 'loading_deadline' => '2026-08-01']);
    $nearDeadlineFolder = Folder::factory()->create(['status' => FolderStatus::IN_PROGRESS, 'loading_deadline' => '2026-08-12']);
    Folder::factory()->create(['status' => FolderStatus::IN_PROGRESS, 'loading_deadline' => '2026-08-25']);
    Folder::factory()->create(['status' => FolderStatus::CLOSED, 'loading_deadline' => '2026-08-11']);

    $response = $this->actingAs($user)->get('/reports/daily?period=day');

    Carbon::setTestNow();

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('reports/daily')
        ->has('loadings', 1)
        ->where('loadings.0.folder_number', $todayFolder->folder_number)
        ->has('alerts', 2)
    );

    $alertNumbers = collect($response->viewData('page')['props']['alerts'])->pluck('folder_number');
    expect($alertNumbers)->toContain($overdueFolder->folder_number, $nearDeadlineFolder->folder_number);
});
