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

it('serves livewire assets through laravel behind nginx', function () {
    $livewireRoute = collect(Route::getRoutes())->first(
        fn ($route): bool => str_ends_with($route->uri(), '/livewire.js'),
    );

    expect($livewireRoute)->not->toBeNull();

    $this->get('/'.$livewireRoute->uri())
        ->assertOk()
        ->assertHeader('Content-Type', 'application/javascript; charset=UTF-8');

    $nginxConfiguration = file_get_contents(base_path('docker/nginx'));
    $dockerfile = file_get_contents(base_path('Dockerfile'));

    expect($nginxConfiguration)
        ->toContain('listen 80 default_server;')
        ->toContain('location ^~ /livewire')
        ->toContain('try_files $uri $uri/ /index.php?$query_string;')
        ->and($dockerfile)
        ->toContain('EXPOSE 80')
        ->toContain('http://127.0.0.1:80/up');
});
