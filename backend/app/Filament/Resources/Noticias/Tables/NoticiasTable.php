<?php

namespace App\Filament\Resources\Noticias\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class NoticiasTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('imagen_principal_path')->label('Imagen')->disk('public')->square(),
                TextColumn::make('titulo')->label('Título')->searchable()->sortable()->wrap(),
                TextColumn::make('categoria')->label('Tipo')->badge()->formatStateUsing(fn (string $state): string => match ($state) {
                    'actividad' => 'Actividad',
                    'jornada' => 'Jornada',
                    'practica' => 'Práctica profesional',
                    'convenio' => 'Convenio',
                    'fecha_importante' => 'Fecha importante',
                    default => 'Noticia general',
                }),
                TextColumn::make('fecha_evento')->label('Fecha actividad')->date('d/m/Y')->sortable(),
                IconColumn::make('esta_publicada')->label('Publicada')->boolean(),
                TextColumn::make('publicada_at')->label('Publicación')->dateTime('d/m/Y H:i')->sortable(),
            ])
            ->filters([
                SelectFilter::make('categoria')->options([
                    'general' => 'Noticias generales',
                    'actividad' => 'Actividades institucionales',
                    'jornada' => 'Jornadas',
                    'practica' => 'Prácticas profesionales',
                    'convenio' => 'Convenios',
                    'fecha_importante' => 'Fechas importantes',
                ]),
                SelectFilter::make('esta_publicada')->options([1 => 'Publicadas', 0 => 'Borradores']),
            ])
            ->recordActions([EditAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])])
            ->defaultSort('created_at', 'desc');
    }
}
