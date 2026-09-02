<?php

use App\Models\ConfiguracionPermisoExamen;

beforeEach(function () {
    ConfiguracionPermisoExamen::query()->delete();
});

it('returns the latest published editorial content for exam permits', function () {
    ConfiguracionPermisoExamen::factory()->create([
        'titulo' => 'Contenido anterior',
        'updated_at' => now()->subDay(),
    ]);
    ConfiguracionPermisoExamen::factory()->create([
        'titulo' => 'Prepará tu solicitud',
        'indicaciones' => [
            ['texto' => '  Tené a mano tu DNI.  '],
            ['texto' => ''],
            ['texto' => 'Revisá las fechas de examen.'],
        ],
        'updated_at' => now(),
    ]);
    ConfiguracionPermisoExamen::factory()->draft()->create([
        'titulo' => 'Borrador interno',
        'updated_at' => now()->addMinute(),
    ]);

    $this->getJson('/api/permisos-examen/contenido')
        ->assertSuccessful()
        ->assertJsonPath('titulo', 'Prepará tu solicitud')
        ->assertJsonPath('indicaciones.0', 'Tené a mano tu DNI.')
        ->assertJsonPath('indicaciones.1', 'Revisá las fechas de examen.')
        ->assertJsonMissing(['titulo' => 'Borrador interno']);
});

it('returns null when there is no published exam permit content', function () {
    ConfiguracionPermisoExamen::factory()->draft()->create();

    $this->getJson('/api/permisos-examen/contenido')
        ->assertNoContent();
});
