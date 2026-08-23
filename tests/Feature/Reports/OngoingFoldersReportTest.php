<?php

namespace Tests\Feature\Reports;

use App\Enums\FolderStatus;
use App\Enums\UserRole;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('ongoing folders report only includes non-closed statuses', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);

    Folder::factory()->create(['folder_number' => 'DOS-PENDING', 'status' => FolderStatus::PENDING]);
    Folder::factory()->create(['folder_number' => 'DOS-PROGRESS', 'status' => FolderStatus::IN_PROGRESS]);
    Folder::factory()->create(['folder_number' => 'DOS-OVERDUE', 'status' => FolderStatus::OVERDUE]);
    Folder::factory()->create(['folder_number' => 'DOS-CLOSED', 'status' => FolderStatus::CLOSED]);
    Folder::factory()->create(['folder_number' => 'DOS-CLOSED-LATE', 'status' => FolderStatus::CLOSED_LATE]);

    $response = $this->actingAs($user)->get('/reports/ongoing-folders?period=year');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('reports/ongoing-folders')
        ->has('rows', 3)
    );

    $numbers = collect($response->viewData('page')['props']['rows'])->pluck('folder_number');
    expect($numbers)->toContain('DOS-PENDING', 'DOS-PROGRESS', 'DOS-OVERDUE');
    expect($numbers)->not->toContain('DOS-CLOSED', 'DOS-CLOSED-LATE');
});
