<?php

use App\Models\Carrera;
use App\Models\Consulta;

it('stores a valid career inquiry for the Filament panel', function () {
    $career = Carrera::factory()->create();

    $this->postJson('/api/consultas', [
        'carrera_id' => $career->id,
        'nombre' => 'Ana Pérez',
        'telefono' => '+54 9 388 555-1234',
        'email' => 'ana@example.com',
        'mensaje' => 'Quisiera conocer los requisitos para inscribirme.',
        'pagina_origen' => 'http://localhost:3000/carreras/'.$career->slug,
        'acepta_contacto' => true,
    ])->assertCreated()->assertJsonPath('consulta.estado', 'nueva');

    $inquiry = Consulta::first();
    expect($inquiry)->not->toBeNull()
        ->and($inquiry->carrera_id)->toBe($career->id)
        ->and($inquiry->estado)->toBe('nueva');
});

it('validates consent and contact details', function () {
    $this->postJson('/api/consultas', [
        'nombre' => 'Ana',
        'telefono' => '123',
        'mensaje' => 'Corto',
    ])->assertUnprocessable()->assertJsonValidationErrors(['telefono', 'mensaje', 'acepta_contacto']);
});

it('rejects the honeypot field', function () {
    $this->postJson('/api/consultas', [
        'nombre' => 'Robot',
        'telefono' => '5493885551234',
        'mensaje' => 'Este mensaje intenta superar la longitud mínima.',
        'acepta_contacto' => true,
        'website' => 'https://spam.example',
    ])->assertUnprocessable()->assertJsonValidationErrors(['website']);
});
