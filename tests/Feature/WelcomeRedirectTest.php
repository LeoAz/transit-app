<?php

use App\Models\User;

test('root route redirects to login', function () {
    $response = $this->get('/');

    $response->assertRedirect(route('login'));
});

test('authenticated users are redirected from root to dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/');

    $response->assertRedirect(route('dashboard'));
});
