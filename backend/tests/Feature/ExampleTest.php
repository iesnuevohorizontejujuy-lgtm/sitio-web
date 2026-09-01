<?php

use Illuminate\Http\Middleware\TrustHosts;

test('the application returns a successful response', function () {
    $response = $this->get('/');

    $response
        ->assertSuccessful()
        ->assertSee('La información del instituto, en un solo lugar.')
        ->assertSee('Ingresar al panel')
        ->assertSee(route('filament.panel.auth.login'), escape: false)
        ->assertSee(route('filament.panel.resources.consultas.index'), escape: false)
        ->assertSee(route('filament.panel.resources.diapositiva-portadas.index'), escape: false);
});

test('only the configured cms and local host names are trusted', function () {
    $trustedHosts = app(TrustHosts::class)->hosts();

    expect($trustedHosts)
        ->toBe([
            '^sitio\.cms\.iesnuevohorizonte\.com$',
            '^localhost$',
            '^127\.0\.0\.1$',
        ])
        ->not->toContain('.*');
});

test('the production cms host is trusted', function () {
    $this->withHeader('Host', 'sitio.cms.iesnuevohorizonte.com')->get('/')->assertSuccessful();
});

test('the production container enables secure sessions and transport headers', function () {
    $dockerfile = file_get_contents(base_path('Dockerfile'));
    $nginx = file_get_contents(base_path('docker/nginx'));

    expect($dockerfile)
        ->toContain('SESSION_SECURE_COOKIE=true')
        ->toContain('SESSION_HTTP_ONLY=true')
        ->toContain('SESSION_SAME_SITE=lax');

    expect($nginx)
        ->toContain('server_tokens off;')
        ->toContain('Strict-Transport-Security "max-age=31536000; includeSubDomains"')
        ->toContain('X-Content-Type-Options "nosniff"')
        ->toContain('X-Frame-Options "SAMEORIGIN"');
});
