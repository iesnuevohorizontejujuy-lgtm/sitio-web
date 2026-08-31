<?php

namespace App\Filament\Resources\DiapositivaPortadas\Pages;

use App\Filament\Resources\DiapositivaPortadas\DiapositivaPortadaResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditDiapositivaPortada extends EditRecord
{
    protected static string $resource = DiapositivaPortadaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
