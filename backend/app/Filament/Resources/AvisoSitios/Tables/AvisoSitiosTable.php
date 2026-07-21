<?php

namespace App\Filament\Resources\AvisoSitios\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class AvisoSitiosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('imagen_path')->label('Imagen')->disk('public')->square(),
                TextColumn::make('titulo')->label('Título')->searchable()->sortable()->wrap()->weight('bold'),
                TextColumn::make('presentacion')->label('Formato')->badge()->formatStateUsing(fn (string $state): string => match ($state) {
                    'franja' => 'Franja superior',
                    'banner' => 'Banner editorial',
                    default => 'Modal',
                }),
                TextColumn::make('paginas')->label('Páginas')->badge()->separator(','),
                TextColumn::make('prioridad')->sortable(),
                IconColumn::make('publicado')->label('Publicado')->boolean(),
                TextColumn::make('inicia_at')->label('Desde')->dateTime('d/m/Y H:i')->sortable(),
                TextColumn::make('finaliza_at')->label('Hasta')->dateTime('d/m/Y H:i')->sortable(),
            ])
            ->filters([
                SelectFilter::make('presentacion')->label('Formato')->options([
                    'modal' => 'Modal',
                    'franja' => 'Franja superior',
                    'banner' => 'Banner editorial',
                ]),
                SelectFilter::make('publicado')->label('Estado')->options([
                    1 => 'Publicados',
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
            ->defaultSort('prioridad', 'desc');
    }
}
