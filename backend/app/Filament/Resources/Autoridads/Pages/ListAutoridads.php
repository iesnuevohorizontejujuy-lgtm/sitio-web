<?php

namespace App\Filament\Resources\Autoridads\Pages;

use App\Filament\Resources\Autoridads\AutoridadResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAutoridads extends ListRecords
{
    protected static string $resource = AutoridadResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
