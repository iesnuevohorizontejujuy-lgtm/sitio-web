<?php

namespace App\Filament\Resources\AvisoSitios\Pages;

use App\Filament\Resources\AvisoSitios\AvisoSitioResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAvisoSitio extends EditRecord
{
    protected static string $resource = AvisoSitioResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
