<?php

use App\Models\AvisoSitio;

it('returns active notices ordered by priority', function () {
    AvisoSitio::factory()->create(['titulo' => 'Aviso secundario', 'prioridad' => 2]);
    AvisoSitio::factory()->create(['titulo' => 'Aviso prioritario', 'prioridad' => 10]);
    AvisoSitio::factory()->draft()->create(['titulo' => 'Borrador']);
    AvisoSitio::factory()->scheduled()->create(['titulo' => 'Programado']);
    AvisoSitio::factory()->expired()->create(['titulo' => 'Vencido']);

    $this->getJson('/api/avisos')
        ->assertSuccessful()
        ->assertJsonCount(2)
        ->assertJsonPath('0.titulo', 'Aviso prioritario')
        ->assertJsonPath('1.titulo', 'Aviso secundario')
        ->assertJsonMissing(['titulo' => 'Borrador'])
        ->assertJsonMissing(['titulo' => 'Programado'])
        ->assertJsonMissing(['titulo' => 'Vencido']);
});

it('includes notices exactly at their schedule boundaries', function () {
    $now = now()->startOfSecond();
    $this->travelTo($now);

    AvisoSitio::factory()->create(['inicia_at' => $now, 'finaliza_at' => $now]);

    $this->getJson('/api/avisos')->assertSuccessful()->assertJsonCount(1);
});

it('removes unsafe action urls from the public response', function () {
    AvisoSitio::factory()->create([
        'url_enlace' => 'javascript:alert(1)',
        'texto_enlace' => 'Abrir',
    ]);

    $this->getJson('/api/avisos')
        ->assertSuccessful()
        ->assertJsonPath('0.url_enlace', null)
        ->assertJsonPath('0.texto_enlace', null);
});
