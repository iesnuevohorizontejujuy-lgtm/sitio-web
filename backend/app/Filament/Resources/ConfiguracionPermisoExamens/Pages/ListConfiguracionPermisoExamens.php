<?php

namespace App\Filament\Resources\ConfiguracionPermisoExamens\Pages;

use App\Filament\Resources\ConfiguracionPermisoExamens\ConfiguracionPermisoExamenResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListConfiguracionPermisoExamens extends ListRecords
{
    protected static string $resource = ConfiguracionPermisoExamenResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
