<?php

use App\Models\Carrera;
use App\Models\CarreraImagen;
use App\Models\CarreraPublicacionSocial;
use App\Models\Materia;

it('publishes only visible careers with their study plan and gallery', function () {
    $published = Carrera::factory()->create(['nombre' => 'Desarrollo de Software', 'slug' => 'desarrollo-de-software']);
    Carrera::factory()->draft()->create(['slug' => 'carrera-borrador']);
    Materia::factory()->for($published)->create(['nombre' => 'Programación I', 'anio' => 1]);
    CarreraImagen::factory()->for($published)->create(['texto_alternativo' => 'Estudiantes en el aula']);
    CarreraImagen::factory()->for($published)->count(9)->create();

    $this->getJson('/api/carreras')
        ->assertSuccessful()
        ->assertJsonCount(1)
        ->assertJsonPath('0.slug', 'desarrollo-de-software')
        ->assertJsonPath('0.subjects.0.name', 'Programación I')
        ->assertJsonCount(8, '0.gallery')
        ->assertJsonPath('0.gallery.0.alt', 'Estudiantes en el aula')
        ->assertJsonMissing(['slug' => 'carrera-borrador']);
});

it('returns a published career by slug and hides drafts', function () {
    Carrera::factory()->create(['slug' => 'farmacia']);
    Carrera::factory()->draft()->create(['slug' => 'secreta']);

    $this->getJson('/api/carreras/farmacia')->assertSuccessful()->assertJsonPath('slug', 'farmacia');
    $this->getJson('/api/carreras/secreta')->assertNotFound();
});

it('sanitizes career rich text before publishing it', function () {
    Carrera::factory()->create([
        'slug' => 'carrera-segura',
        'perfil_profesional' => '<p>Perfil profesional</p><script>alert("xss")</script>',
    ]);

    $this->getJson('/api/carreras/carrera-segura')
        ->assertSuccessful()
        ->assertJsonPath('content', '<p>Perfil profesional</p>');
});

it('publishes up to three authorized social posts in their editorial order', function () {
    $career = Carrera::factory()->create(['slug' => 'enfermeria']);

    CarreraPublicacionSocial::factory()->for($career)->create([
        'titulo' => 'Segundo contenido',
        'orden' => 2,
        'url' => 'https://www.instagram.com/p/segundaPublicacion/',
    ]);
    CarreraPublicacionSocial::factory()->for($career)->create([
        'titulo' => 'Experiencia de una egresada',
        'descripcion' => 'Una egresada comparte su recorrido profesional.',
        'cuenta' => '@iesnuevohorizonte',
        'fecha_publicacion' => '2026-07-20',
        'texto_boton' => 'Conocer su experiencia',
        'imagen_previsualizacion_path' => 'carreras/publicaciones-sociales/enfermeria.jpg',
        'imagen_previsualizacion_alt' => 'Egresada de Enfermería contando su experiencia',
        'orden' => 1,
        'url' => 'https://www.instagram.com/reel/DVyed6wkeFF/?utm_source=ig_embed',
    ]);
    CarreraPublicacionSocial::factory()->for($career)->create([
        'titulo' => 'Tercer contenido',
        'orden' => 3,
        'url' => 'https://www.instagram.com/reel/tercerReel/',
    ]);
    CarreraPublicacionSocial::factory()->for($career)->create([
        'titulo' => 'Fuera del límite',
        'orden' => 4,
        'url' => 'https://www.instagram.com/reel/cuartoReel/',
    ]);
    CarreraPublicacionSocial::factory()->for($career)->draft()->create([
        'titulo' => 'Borrador',
        'orden' => 0,
    ]);
    CarreraPublicacionSocial::factory()->for($career)->unauthorized()->create([
        'titulo' => 'Sin autorización',
        'orden' => 0,
    ]);
    CarreraPublicacionSocial::factory()->for($career)->create([
        'titulo' => 'Enlace no permitido',
        'url' => 'https://example.com/reel/no-corresponde/',
        'orden' => 0,
    ]);

    $response = $this->getJson('/api/carreras/enfermeria')
        ->assertSuccessful()
        ->assertJsonCount(3, 'social_posts')
        ->assertJsonPath('social_posts.0.title', 'Experiencia de una egresada')
        ->assertJsonPath('social_posts.0.description', 'Una egresada comparte su recorrido profesional.')
        ->assertJsonPath('social_posts.0.url', 'https://www.instagram.com/reel/DVyed6wkeFF/')
        ->assertJsonPath('social_posts.0.account', '@iesnuevohorizonte')
        ->assertJsonPath('social_posts.0.published_at', '2026-07-20')
        ->assertJsonPath('social_posts.0.button_label', 'Conocer su experiencia')
        ->assertJsonPath('social_posts.0.preview_alt', 'Egresada de Enfermería contando su experiencia')
        ->assertJsonPath('social_posts.1.title', 'Segundo contenido')
        ->assertJsonPath('social_posts.2.title', 'Tercer contenido')
        ->assertJsonMissing(['title' => 'Borrador'])
        ->assertJsonMissing(['title' => 'Sin autorización'])
        ->assertJsonMissing(['title' => 'Enlace no permitido'])
        ->assertJsonMissing(['title' => 'Fuera del límite']);

    expect($response->json('social_posts.0'))
        ->not->toHaveKey('embed_html');
});
