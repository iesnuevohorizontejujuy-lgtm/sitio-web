<?php

use App\Models\Carrera;
use App\Models\CarreraImagen;
use App\Models\Materia;

it('publishes only visible careers with their study plan and gallery', function () {
    $published = Carrera::factory()->create(['nombre' => 'Desarrollo de Software', 'slug' => 'desarrollo-de-software']);
    Carrera::factory()->draft()->create(['slug' => 'carrera-borrador']);
    Materia::factory()->for($published)->create(['nombre' => 'Programación I', 'anio' => 1]);
    CarreraImagen::factory()->for($published)->create(['texto_alternativo' => 'Estudiantes en el aula']);

    $this->getJson('/api/carreras')
        ->assertSuccessful()
        ->assertJsonCount(1)
        ->assertJsonPath('0.slug', 'desarrollo-de-software')
        ->assertJsonPath('0.subjects.0.name', 'Programación I')
        ->assertJsonPath('0.gallery.0.alt', 'Estudiantes en el aula')
        ->assertJsonMissing(['slug' => 'carrera-borrador']);
});

it('returns a published career by slug and hides drafts', function () {
    Carrera::factory()->create(['slug' => 'farmacia']);
    Carrera::factory()->draft()->create(['slug' => 'secreta']);

    $this->getJson('/api/carreras/farmacia')->assertSuccessful()->assertJsonPath('slug', 'farmacia');
    $this->getJson('/api/carreras/secreta')->assertNotFound();
});
