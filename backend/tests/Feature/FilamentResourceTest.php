<?php

use App\Filament\Resources\Autoridads\Pages\ListAutoridads;
use App\Filament\Resources\AvisoSitios\Pages\ListAvisoSitios;
use App\Filament\Resources\Carreras\Pages\ListCarreras;
use App\Filament\Resources\Consultas\Pages\ListConsultas;
use App\Filament\Resources\ConvocatoriaIngresos\Pages\ListConvocatoriaIngresos;
use App\Models\Autoridad;
use App\Models\AvisoSitio;
use App\Models\Carrera;
use App\Models\Consulta;
use App\Models\ConvocatoriaIngreso;
use App\Models\User;
use Livewire\Livewire;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    actingAs(User::factory()->admin()->create());
});

it('lists careers in the CMS', function () {
    $careers = Carrera::factory()->count(3)->create();

    Livewire::test(ListCarreras::class)
        ->assertCanSeeTableRecords($careers)
        ->assertTableColumnExists('nombre')
        ->assertTableColumnExists('resolucion');
});

it('lists inquiries and can mark one as answered', function () {
    $inquiry = Consulta::factory()->create(['estado' => 'nueva']);

    Livewire::test(ListConsultas::class)
        ->assertCanSeeTableRecords([$inquiry])
        ->assertTableActionVisible('whatsapp', $inquiry)
        ->callTableAction('markAnswered', $inquiry);

    expect($inquiry->fresh())
        ->estado->toBe('respondida')
        ->respondida_at->not->toBeNull();
});

it('lists admissions calls in the CMS', function () {
    $calls = ConvocatoriaIngreso::factory()->count(2)->create();

    Livewire::test(ListConvocatoriaIngresos::class)
        ->assertCanSeeTableRecords($calls)
        ->assertTableColumnExists('titulo')
        ->assertTableColumnExists('estado')
        ->assertTableColumnExists('esta_publicada');
});

it('lists authorities in the CMS', function () {
    $authorities = Autoridad::factory()->count(2)->create();

    Livewire::test(ListAutoridads::class)
        ->assertCanSeeTableRecords($authorities)
        ->assertTableColumnExists('nombre')
        ->assertTableColumnExists('cargo')
        ->assertTableColumnExists('publicada');
});

it('lists site notices in the CMS', function () {
    $notices = AvisoSitio::factory()->count(2)->create();

    Livewire::test(ListAvisoSitios::class)
        ->assertCanSeeTableRecords($notices)
        ->assertTableColumnExists('titulo')
        ->assertTableColumnExists('presentacion')
        ->assertTableColumnExists('publicado');
});
