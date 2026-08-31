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
