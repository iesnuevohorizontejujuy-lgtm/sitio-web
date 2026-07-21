<?php

namespace App\Filament\Resources\AvisoSitios\Pages;

use App\Filament\Resources\AvisoSitios\AvisoSitioResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAvisoSitios extends ListRecords
{
    protected static string $resource = AvisoSitioResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
