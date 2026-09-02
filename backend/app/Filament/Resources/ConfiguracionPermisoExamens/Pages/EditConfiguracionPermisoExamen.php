<?php

namespace App\Filament\Resources\ConfiguracionPermisoExamens\Pages;

use App\Filament\Resources\ConfiguracionPermisoExamens\ConfiguracionPermisoExamenResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditConfiguracionPermisoExamen extends EditRecord
{
    protected static string $resource = ConfiguracionPermisoExamenResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
