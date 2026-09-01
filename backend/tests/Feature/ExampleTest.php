<?php

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

test('the internal container health check is accepted', function () {
    $this->withHeader('Host', '127.0.0.1')->get('/up')->assertSuccessful();
});

test('the production container enables secure sessions and transport headers', function () {
    $dockerfile = file_get_contents(base_path('Dockerfile'));
    $bootstrap = file_get_contents(base_path('bootstrap/app.php'));
    $nginx = file_get_contents(base_path('docker/nginx'));

    expect($dockerfile)
        ->toContain('http://127.0.0.1:80/up')
        ->toContain('SESSION_SECURE_COOKIE=true')
        ->toContain('SESSION_HTTP_ONLY=true')
        ->toContain('SESSION_SAME_SITE=lax');

    expect($bootstrap)
        ->toContain('trustProxies')
        ->not->toContain('trustHosts');

    expect($nginx)
        ->toContain('server_tokens off;')
        ->toContain('Strict-Transport-Security "max-age=31536000; includeSubDomains"')
        ->toContain('X-Content-Type-Options "nosniff"')
        ->toContain('X-Frame-Options "SAMEORIGIN"');
});
