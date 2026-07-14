<?php

use App\Models\User;

it('allows administrators to access the CMS panel', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->get('/panel')->assertSuccessful();
});

it('forbids non administrators from the CMS panel', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/panel')->assertForbidden();
});
