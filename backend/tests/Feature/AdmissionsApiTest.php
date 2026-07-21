<?php

use App\Models\ConvocatoriaIngreso;

it('returns the latest published admissions call', function () {
    ConvocatoriaIngreso::factory()->create([
        'titulo' => 'Ingreso anterior',
        'publicada_at' => now()->subMonth(),
    ]);
    ConvocatoriaIngreso::factory()->create([
        'titulo' => 'Ingreso 2027',
        'ciclo_lectivo' => '2027',
        'requisitos' => [['texto' => 'DNI actualizado']],
        'documentos' => [['nombre' => 'Guía de ingreso', 'archivo' => 'ingresantes/documentos/guia.pdf']],
        'preguntas_frecuentes' => [['pregunta' => '¿Dónde consulto?', 'respuesta' => 'En el formulario web.']],
        'publicada_at' => now(),
    ]);
    ConvocatoriaIngreso::factory()->draft()->create(['titulo' => 'Borrador privado']);

    $this->getJson('/api/ingresantes')
        ->assertSuccessful()
        ->assertJsonPath('titulo', 'Ingreso 2027')
        ->assertJsonPath('ciclo_lectivo', '2027')
        ->assertJsonPath('requisitos.0', 'DNI actualizado')
        ->assertJsonPath('documentos.0.nombre', 'Guía de ingreso')
        ->assertJsonPath('preguntas_frecuentes.0.pregunta', '¿Dónde consulto?')
        ->assertJsonMissing(['titulo' => 'Borrador privado']);
});

it('hides drafts and scheduled admissions calls', function () {
    ConvocatoriaIngreso::factory()->draft()->create();
    ConvocatoriaIngreso::factory()->create(['publicada_at' => now()->addDay()]);

    $this->getJson('/api/ingresantes')->assertNotFound();
});
