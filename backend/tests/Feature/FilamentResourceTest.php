<?php

use App\Filament\Resources\Carreras\Pages\ListCarreras;
use App\Filament\Resources\Consultas\Pages\ListConsultas;
use App\Models\Carrera;
use App\Models\Consulta;
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
