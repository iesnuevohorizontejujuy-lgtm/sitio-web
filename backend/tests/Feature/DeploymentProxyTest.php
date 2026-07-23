<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

it('trusts the https headers forwarded by the deployment proxy', function () {
    Route::get('/deployment-proxy-check', fn (Request $request): array => [
        'secure' => $request->isSecure(),
        'root' => $request->root(),
    ]);

    $this->withHeaders([
        'X-Forwarded-Host' => 'cms.iesnuevohorizonte.edu.ar',
        'X-Forwarded-Port' => '443',
        'X-Forwarded-Proto' => 'https',
    ])->get('/deployment-proxy-check')
        ->assertOk()
        ->assertJson([
            'secure' => true,
            'root' => 'https://cms.iesnuevohorizonte.edu.ar',
        ]);
});
