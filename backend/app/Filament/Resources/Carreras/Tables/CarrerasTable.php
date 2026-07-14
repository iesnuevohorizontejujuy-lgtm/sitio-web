<?php

namespace App\Filament\Resources\Carreras\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class CarrerasTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('imagen_portada_path')->label('Portada')->disk('public')->square(),
                TextColumn::make('nombre')->label('Carrera')->searchable()->sortable()->wrap(),
                TextColumn::make('area')->label('Área')->badge()->sortable(),
                TextColumn::make('duracion_anios')->label('Duración')->suffix(' años')->sortable(),
                TextColumn::make('resolucion')->label('Resolución')->searchable(),
                IconColumn::make('destacada')->label('Destacada')->boolean(),
                IconColumn::make('publicada')->label('Publicada')->boolean(),
                TextColumn::make('updated_at')->label('Actualizada')->dateTime('d/m/Y H:i')->sortable()->toggleable(),
            ])
            ->filters([
                SelectFilter::make('area')->options([
                    'Salud' => 'Salud',
                    'Tecnología' => 'Tecnología',
                    'Gestión' => 'Gestión',
                    'Sociedad y comunicación' => 'Sociedad y comunicación',
                    'Actividad física' => 'Actividad física',
                ]),
                SelectFilter::make('publicada')->options([1 => 'Publicadas', 0 => 'Borradores']),
            ])
            ->recordActions([EditAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])])
            ->defaultSort('orden');
    }
}
