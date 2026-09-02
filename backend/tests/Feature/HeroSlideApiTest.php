<?php

use App\Models\DiapositivaPortada;

it('returns at most four active homepage slides in editorial order', function () {
    DiapositivaPortada::factory()->create(['titulo' => 'Tercera', 'orden' => 3]);
    DiapositivaPortada::factory()->create(['titulo' => 'Primera', 'orden' => 1, 'imagen_movil_path' => 'portada/movil.webp']);
    DiapositivaPortada::factory()->create(['titulo' => 'Segunda', 'orden' => 2]);
    DiapositivaPortada::factory()->create(['titulo' => 'Cuarta', 'orden' => 4]);
    DiapositivaPortada::factory()->create(['titulo' => 'Quinta', 'orden' => 5]);
    DiapositivaPortada::factory()->draft()->create(['titulo' => 'Borrador', 'orden' => 0]);
    DiapositivaPortada::factory()->create(['titulo' => 'Finalizada', 'orden' => 0, 'finaliza_at' => now()->subMinute()]);
    DiapositivaPortada::factory()->create(['titulo' => 'Programada', 'orden' => 0, 'inicia_at' => now()->addDay()]);

    $this->getJson('/api/portada/diapositivas')
        ->assertSuccessful()
        ->assertJsonCount(4)
        ->assertJsonPath('0.titulo', 'Primera')
        ->assertJsonPath('0.imagen_movil', url('/storage/portada/movil.webp'))
        ->assertJsonPath('1.titulo', 'Segunda')
        ->assertJsonPath('2.titulo', 'Tercera')
        ->assertJsonPath('3.titulo', 'Cuarta')
        ->assertJsonMissing(['titulo' => 'Borrador'])
        ->assertJsonMissing(['titulo' => 'Finalizada'])
        ->assertJsonMissing(['titulo' => 'Programada'])
        ->assertJsonMissing(['titulo' => 'Quinta']);
});
