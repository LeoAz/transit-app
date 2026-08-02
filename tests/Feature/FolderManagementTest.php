<?php

namespace Tests\Feature;

use App\Enums\ContainerType;
use App\Enums\FolderStatus;
use App\Enums\UserRole;
use App\Models\Customer;
use App\Models\Folder;
use App\Models\Holiday;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('folders page is displayed', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);

    $response = $this
        ->actingAs($user)
        ->get('/folders');

    $response->assertOk();
});

test('folder can be created (Module 1)', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    $customer = Customer::factory()->create();
    $product = Product::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post('/folders', [
            'date_reception_bl' => '2026-08-01',
            'bl_number' => 'BL-001',
            'customer_id' => $customer->id,
            'container_type' => ContainerType::TWENTY->value,
            'container_count' => 5,
            'product_id' => $product->id,
            'vessel_name' => 'MSC OSCAR',
            'eta' => '2026-08-10',
            'notes' => 'Some notes',
        ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('folders', [
        'bl_number' => 'BL-001',
        'status' => FolderStatus::PENDING->value,
    ]);

    $folder = Folder::where('bl_number', 'BL-001')->first();
    $year = now()->year;
    expect($folder->folder_number)->toMatch('/DOS-'.$year.'-\d{4}/');
});

test('folder number resets every year', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    $customer = Customer::factory()->create();
    $product = Product::factory()->create();

    // Create a folder in 2025
    Carbon::setTestNow('2025-01-01 10:00:00');
    $folder2025 = Folder::create([
        'bl_received_at' => '2025-01-01',
        'bl_number' => 'BL-2025',
        'customer_id' => $customer->id,
        'container_type' => ContainerType::TWENTY,
        'container_count' => 1,
        'product_id' => $product->id,
        'vessel_name' => 'MSC 2025',
        'eta' => '2025-01-10',
        'status' => FolderStatus::PENDING,
    ]);

    expect($folder2025->folder_number)->toBe('DOS-2025-0001');

    // Create another folder in 2026
    Carbon::setTestNow('2026-01-01 10:00:00');
    $folder2026 = Folder::create([
        'bl_received_at' => '2026-01-01',
        'bl_number' => 'BL-2026',
        'customer_id' => $customer->id,
        'container_type' => ContainerType::TWENTY,
        'container_count' => 1,
        'product_id' => $product->id,
        'vessel_name' => 'MSC 2026',
        'eta' => '2026-01-10',
        'status' => FolderStatus::PENDING,
    ]);

    expect($folder2026->folder_number)->toBe('DOS-2026-0001');

    Carbon::setTestNow();
});

test('folder can be created with files', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    $customer = Customer::factory()->create();
    $product = Product::factory()->create();

    Storage::fake('public');
    $file1 = UploadedFile::fake()->create('doc1.pdf', 100);
    $file2 = UploadedFile::fake()->create('doc2.jpg', 200);

    $response = $this
        ->actingAs($user)
        ->post('/folders', [
            'date_reception_bl' => '2026-08-01',
            'bl_number' => 'BL-FILES',
            'customer_id' => $customer->id,
            'container_type' => ContainerType::TWENTY->value,
            'container_count' => 5,
            'product_id' => $product->id,
            'vessel_name' => 'MSC OSCAR',
            'eta' => '2026-08-10',
            'files' => [$file1, $file2],
        ]);

    $response->assertSessionHasNoErrors();

    $folder = Folder::where('bl_number', 'BL-FILES')->first();
    expect($folder->documents)->toHaveCount(2);

    Storage::disk('public')->assertExists($folder->documents[0]->file_path);
    Storage::disk('public')->assertExists($folder->documents[1]->file_path);
});

test('folder can be assigned to a shipper (Module 2)', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    $folder = Folder::factory()->create();
    $shipper = User::factory()->create(['role' => UserRole::SHIPPER]);

    $response = $this
        ->actingAs($user)
        ->post("/folders/{$folder->id}/assign", [
            'shipper_id' => $shipper->id,
            'reason' => 'Affectation initiale',
        ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('folders', [
        'id' => $folder->id,
        'shipper_id' => $shipper->id,
    ]);

    $this->assertDatabaseHas('assignment_histories', [
        'folder_id' => $folder->id,
        'new_shipper_id' => $shipper->id,
    ]);
});

test('arrival can be validated and deadline calculated (Module 3)', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    $folder = Folder::factory()->create(['status' => FolderStatus::PENDING]);

    // Setup some holidays
    Holiday::create(['date' => '2026-08-05', 'label' => 'Holiday']); // Wednesday

    // ATA is 2026-08-01 (Saturday)
    // Business days:
    // - Aug 3 (Mon) - Day 1
    // - Aug 4 (Tue) - Day 2
    // - Aug 5 (Wed) - HOLIDAY
    // - Aug 6 (Thu) - Day 3
    // - Aug 7 (Fri) - Day 4
    // - Aug 8 (Sat) - WEEKEND
    // - Aug 9 (Sun) - WEEKEND
    // - Aug 10 (Mon) - Day 5
    // Deadline should be 2026-08-10

    $response = $this
        ->actingAs($user)
        ->post("/folders/{$folder->id}/validate-arrival", [
            'ata' => '2026-08-01',
            'notes' => 'Navire arrivé',
        ]);

    $response->assertSessionHasNoErrors();

    $folder->refresh();

    expect($folder->status)->toBe(FolderStatus::IN_PROGRESS);
    expect($folder->ata->format('Y-m-d'))->toBe('2026-08-01');
    expect($folder->loading_deadline->format('Y-m-d'))->toBe('2026-08-10');
});
