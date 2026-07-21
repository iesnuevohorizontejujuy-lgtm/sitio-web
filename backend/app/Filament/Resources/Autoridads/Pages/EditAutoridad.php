<?php

namespace App\Filament\Resources\Autoridads\Pages;

use App\Filament\Resources\Autoridads\AutoridadResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditAutoridad extends EditRecord
{
    protected static string $resource = AutoridadResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
