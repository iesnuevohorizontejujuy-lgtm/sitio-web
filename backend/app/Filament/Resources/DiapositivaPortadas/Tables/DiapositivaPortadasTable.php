<?php

namespace App\Filament\Resources\DiapositivaPortadas\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class DiapositivaPortadasTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('imagen_escritorio_path')->label('Imagen')->disk('public')->square(),
                TextColumn::make('titulo')->label('Título')->searchable()->sortable()->wrap()->weight('bold'),
                TextColumn::make('orden')->label('Orden')->numeric()->sortable(),
                IconColumn::make('imagen_movil_path')->label('Imagen móvil')->boolean(),
                IconColumn::make('publicada')->label('Publicada')->boolean(),
                TextColumn::make('inicia_at')->label('Desde')->dateTime('d/m/Y H:i')->sortable()->placeholder('Sin inicio'),
                TextColumn::make('finaliza_at')->label('Hasta')->dateTime('d/m/Y H:i')->sortable()->placeholder('Sin fin'),
            ])
            ->filters([
                SelectFilter::make('publicada')->label('Estado')->options([
                    1 => 'Publicadas',
                    0 => 'Borradores',
                ]),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('orden');
    }
}
