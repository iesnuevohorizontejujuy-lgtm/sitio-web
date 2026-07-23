<?php

use App\Models\Carrera;
use App\Models\Materia;
use Database\Seeders\CarreraAcademicSeeder;
use Database\Seeders\CarreraSeeder;

it('imports the verified academic catalog for every public career', function () {
    $this->seed(CarreraSeeder::class);

    $resolutions = [
        'farmacia' => 'Res. 740-E-S-22',
        'cocinas-regionales-y-cultura-alimentaria' => 'Res. 3004-E-22',
        'administracion-financiera' => 'Res. 840-E-23',
        'actividad-fisica-y-fitness' => 'Res. 6304-E-22',
        'agente-sanitario-y-promotor-de-la-salud' => 'Res. 3466-E/S-22',
        'esterilizacion' => 'Res. 3720-E/S-23',
        'desarrollo-de-software' => 'Res. 2730-E-22',
        'acompanamiento-terapeutico' => 'Res. 5570-E-S-23',
        'administracion-y-gestion-tributaria' => 'Res. 2768-E-16',
        'hemoterapia' => 'Res. 749-E/S-23',
        'enfermeria' => 'Res. 3586-E/S-22',
        'gestion-juridica' => 'Res. 3748-E-22',
        'higiene-y-seguridad-en-el-trabajo' => 'Res. 6055-E-23',
        'laboratorio-de-analisis-clinicos' => 'Res. 3523-E/S-23',
        'ninez-adolescencia-y-familia' => 'Res. 965-E-23',
        'preparacion-fisica' => 'Res. 1302-E-23',
        'periodismo-y-nuevas-tecnologias' => 'Res. 6186-E-22',
        'traduccion-tecnico-cientifica-en-ingles' => 'Res. 3332-E-22',
        'soporte-tic' => 'Res. 2772-E-22',
        'protesis-dental' => 'Res. 5594-E/S-23',
    ];

    expect(Carrera::query()->count())->toBe(20)
        ->and(Materia::query()->count())->toBe(469)
        ->and(Carrera::query()->whereNotNull('perfil_profesional')->count())->toBe(20)
        ->and(Carrera::query()->where('nombre', 'like', '%Servicios de Salud%')->exists())->toBeFalse();

    foreach ($resolutions as $slug => $resolution) {
        expect(Carrera::query()->where('slug', $slug)->value('resolucion'))->toBe($resolution);
    }
});

it('can run repeatedly without duplicating careers or subjects', function () {
    $this->seed(CarreraSeeder::class);
    $this->seed(CarreraSeeder::class);

    expect(Carrera::query()->count())->toBe(20)
        ->and(Materia::query()->count())->toBe(469);
});

it('preserves editorial content and subjects added through the cms', function () {
    $this->seed(CarreraSeeder::class);

    $career = Carrera::query()->where('slug', 'enfermeria')->firstOrFail();
    $career->update(['perfil_profesional' => 'Perfil revisado desde el CMS.']);
    Carrera::query()->where('slug', 'farmacia')->update(['perfil_profesional' => '<p><br></p>']);
    $career->materias()->create([
        'nombre' => 'Seminario institucional',
        'anio' => 3,
        'orden' => 99,
    ]);

    $this->seed(CarreraAcademicSeeder::class);

    expect($career->refresh()->perfil_profesional)->toBe('Perfil revisado desde el CMS.')
        ->and(Carrera::query()->where('slug', 'farmacia')->value('perfil_profesional'))->not->toBe('<p><br></p>')
        ->and($career->materias()->where('nombre', 'Seminario institucional')->exists())->toBeTrue()
        ->and(Materia::query()->count())->toBe(470);
});
