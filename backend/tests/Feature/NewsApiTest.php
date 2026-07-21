<?php

use App\Models\Noticia;

it('groups published news and important dates for the website', function () {
    Noticia::factory()->create(['slug' => 'actividad-publicada']);
    Noticia::factory()->create(['slug' => 'convenio-publicado', 'categoria' => 'convenio']);
    Noticia::factory()->importantDate()->create(['slug' => 'fecha-importante']);
    Noticia::factory()->draft()->create(['slug' => 'borrador']);

    $this->getJson('/api/noticias')
        ->assertSuccessful()
        ->assertJsonCount(2, 'generales')
        ->assertJsonCount(1, 'fechas_importantes')
        ->assertJsonPath('generales.0.slug', 'actividad-publicada')
        ->assertJsonPath('fechas_importantes.0.slug', 'fecha-importante')
        ->assertJsonFragment(['slug' => 'convenio-publicado', 'categoria' => 'convenio'])
        ->assertJsonMissing(['slug' => 'borrador']);
});

it('shows only a published news item by slug', function () {
    Noticia::factory()->create(['slug' => 'noticia-visible']);
    Noticia::factory()->draft()->create(['slug' => 'noticia-oculta']);

    $this->getJson('/api/noticias/noticia-visible')->assertSuccessful();
    $this->getJson('/api/noticias/noticia-oculta')->assertNotFound();
});

it('allows the local frontend origin to read public news', function () {
    $this->withHeader('Origin', 'http://127.0.0.1:3000')
        ->getJson('/api/noticias')
        ->assertSuccessful()
        ->assertHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
});

it('sanitizes rich text before publishing it', function () {
    Noticia::factory()->create([
        'slug' => 'contenido-seguro',
        'contenido' => '<p>Contenido válido</p><script>alert("xss")</script><a href="javascript:alert(1)">Enlace</a>',
    ]);

    $this->getJson('/api/noticias/contenido-seguro')
        ->assertSuccessful()
        ->assertJsonMissing(['contenido' => '<p>Contenido válido</p><script>alert("xss")</script><a href="javascript:alert(1)">Enlace</a>'])
        ->assertJsonPath('contenido', '<p>Contenido válido</p><a>Enlace</a>');
});
