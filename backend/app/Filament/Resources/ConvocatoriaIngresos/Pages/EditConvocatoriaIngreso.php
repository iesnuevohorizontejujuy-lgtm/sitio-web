<?php

namespace App\Filament\Resources\ConvocatoriaIngresos\Pages;

use App\Filament\Resources\ConvocatoriaIngresos\ConvocatoriaIngresoResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditConvocatoriaIngreso extends EditRecord
{
    protected static string $resource = ConvocatoriaIngresoResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
