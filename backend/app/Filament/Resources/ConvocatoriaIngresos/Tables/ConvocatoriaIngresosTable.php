<?php

namespace App\Filament\Resources\ConvocatoriaIngresos\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ConvocatoriaIngresosTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('titulo')->label('Título')->searchable()->sortable()->weight('bold'),
                TextColumn::make('ciclo_lectivo')->label('Ciclo')->searchable()->sortable(),
                TextColumn::make('estado')->label('Estado')->badge()->formatStateUsing(fn (string $state): string => match ($state) {
                    'abiertas' => 'Inscripciones abiertas',
                    'cerradas' => 'Inscripciones cerradas',
                    default => 'Próximamente',
                })->color(fn (string $state): string => match ($state) {
                    'abiertas' => 'success',
                    'cerradas' => 'danger',
                    default => 'warning',
                }),
                TextColumn::make('fecha_inicio')->label('Apertura')->date('d/m/Y')->sortable(),
                TextColumn::make('fecha_fin')->label('Cierre')->date('d/m/Y')->sortable(),
                IconColumn::make('esta_publicada')->label('Visible')->boolean(),
                TextColumn::make('publicada_at')->label('Publicación')->dateTime('d/m/Y H:i')->sortable()->toggleable(),
            ])
            ->filters([
                SelectFilter::make('estado')->options([
                    'proximamente' => 'Próximamente',
                    'abiertas' => 'Inscripciones abiertas',
                    'cerradas' => 'Inscripciones cerradas',
                ]),
                SelectFilter::make('esta_publicada')->label('Visibilidad')->options([
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
            ->defaultSort('publicada_at', 'desc');
    }
}
