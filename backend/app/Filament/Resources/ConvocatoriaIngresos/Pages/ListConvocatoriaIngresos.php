<?php

namespace App\Filament\Resources\ConvocatoriaIngresos\Pages;

use App\Filament\Resources\ConvocatoriaIngresos\ConvocatoriaIngresoResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListConvocatoriaIngresos extends ListRecords
{
    protected static string $resource = ConvocatoriaIngresoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
