<?php

use App\Enums\UserRole;
use App\Models\User;

test('users page is displayed', function () {
    $user = User::factory()->create(['role' => UserRole::ADMIN]);

    $response = $this
        ->actingAs($user)
        ->get('/users');

    $response->assertOk();
});

test('user can be created', function () {
    $admin = User::factory()->create(['role' => UserRole::ADMIN]);

    $response = $this
        ->actingAs($admin)
        ->post('/users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => UserRole::SHIPPER->value,
            'preferences' => [
                'email_notifications_eta' => true,
            ],
        ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('users', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'role' => UserRole::SHIPPER->value,
    ]);
});

test('user can be updated', function () {
    $admin = User::factory()->create(['role' => UserRole::ADMIN]);
    $user = User::factory()->create();

    $response = $this
        ->actingAs($admin)
        ->put("/users/{$user->id}", [
            'name' => 'Updated Name',
            'email' => $user->email,
            'role' => UserRole::SUPERVISOR->value,
        ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
        'role' => UserRole::SUPERVISOR->value,
    ]);
});

test('user can be deleted', function () {
    $admin = User::factory()->create(['role' => UserRole::ADMIN]);
    $user = User::factory()->create();

    $response = $this
        ->actingAs($admin)
        ->delete("/users/{$user->id}");

    $response->assertSessionHasNoErrors();
    $this->assertModelMissing($user);
});
