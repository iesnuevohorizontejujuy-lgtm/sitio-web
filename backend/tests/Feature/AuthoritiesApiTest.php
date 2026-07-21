<?php

use App\Models\Autoridad;

it('returns only published authorities in institutional order', function () {
    Autoridad::factory()->create(['nombre' => 'Segunda autoridad', 'orden' => 2]);
    Autoridad::factory()->create(['nombre' => 'Primera autoridad', 'orden' => 1]);
    Autoridad::factory()->draft()->create(['nombre' => 'Autoridad privada', 'orden' => 0]);

    $this->getJson('/api/autoridades')
        ->assertSuccessful()
        ->assertJsonCount(2)
        ->assertJsonPath('0.nombre', 'Primera autoridad')
        ->assertJsonPath('1.nombre', 'Segunda autoridad')
        ->assertJsonMissing(['nombre' => 'Autoridad privada']);
});
