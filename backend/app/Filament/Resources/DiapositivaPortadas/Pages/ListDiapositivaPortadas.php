<?php

namespace App\Filament\Resources\DiapositivaPortadas\Pages;

use App\Filament\Resources\DiapositivaPortadas\DiapositivaPortadaResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDiapositivaPortadas extends ListRecords
{
    protected static string $resource = DiapositivaPortadaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
