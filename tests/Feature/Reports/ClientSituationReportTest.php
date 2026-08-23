<?php

namespace Tests\Feature\Reports;

use App\Enums\UserRole;
use App\Models\Customer;
use App\Models\Folder;
use App\Models\Loading;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('client situation report computes progress rate per customer', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);
    $customer = Customer::factory()->create(['company_name' => 'ACME Corp']);

    $folder1 = Folder::factory()->create(['customer_id' => $customer->id, 'container_count' => 10]);
    $folder2 = Folder::factory()->create(['customer_id' => $customer->id, 'container_count' => 5]);

    Loading::factory()->create(['folder_id' => $folder1->id, 'loaded_container_count' => 4]);
    Loading::factory()->create(['folder_id' => $folder2->id, 'loaded_container_count' => 5]);

    $response = $this->actingAs($user)->get('/reports/client-situation?period=year');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('reports/client-situation')
        ->where('rows.0.customer', 'ACME Corp')
        ->where('rows.0.folders_count', 2)
        ->where('rows.0.containers_ordered', 15)
        ->where('rows.0.containers_loaded', 9)
        ->where('rows.0.containers_remaining', 6)
        ->where('rows.0.progress_rate', 60)
    );
});

test('shipper role only sees their own folders on the client situation report', function () {
    $shipperUser = User::factory()->create(['role' => UserRole::SHIPPER]);
    $otherShipper = User::factory()->create(['role' => UserRole::SHIPPER]);
    $customer = Customer::factory()->create(['company_name' => 'Client Visible']);
    $otherCustomer = Customer::factory()->create(['company_name' => 'Client Caché']);

    Folder::factory()->create(['customer_id' => $customer->id, 'shipper_id' => $shipperUser->id]);
    Folder::factory()->create(['customer_id' => $otherCustomer->id, 'shipper_id' => $otherShipper->id]);

    $response = $this->actingAs($shipperUser)->get('/reports/client-situation?period=year');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('reports/client-situation')
        ->has('rows', 1)
        ->where('rows.0.customer', 'Client Visible')
    );
});
