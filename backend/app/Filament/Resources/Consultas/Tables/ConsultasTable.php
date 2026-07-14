<?php

namespace App\Filament\Resources\Consultas\Tables;

use App\Models\Consulta;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ConsultasTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('created_at')->label('Recibida')->dateTime('d/m/Y H:i')->sortable(),
                TextColumn::make('nombre')->label('Persona')->searchable()->description(fn (Consulta $record): string => $record->telefono),
                TextColumn::make('carrera.nombre')->label('Carrera')->placeholder('Consulta general')->searchable()->wrap(),
                TextColumn::make('mensaje')->label('Consulta')->limit(70)->wrap(),
                TextColumn::make('estado')->badge()->color(fn (string $state): string => match ($state) {
                    'nueva' => 'danger',
                    'en_gestion' => 'warning',
                    'respondida' => 'success',
                    default => 'gray',
                })->formatStateUsing(fn (string $state): string => match ($state) {
                    'nueva' => 'Nueva',
                    'en_gestion' => 'En gestión',
                    'respondida' => 'Respondida',
                    'archivada' => 'Archivada',
                    default => $state,
                }),
            ])
            ->filters([
                SelectFilter::make('estado')->options([
                    'nueva' => 'Nuevas',
                    'en_gestion' => 'En gestión',
                    'respondida' => 'Respondidas',
                    'archivada' => 'Archivadas',
                ]),
                SelectFilter::make('carrera')->relationship('carrera', 'nombre')->searchable()->preload(),
            ])
            ->recordActions([
                Action::make('whatsapp')->label('Responder')->icon('heroicon-o-chat-bubble-left-right')->color('success')->url(fn (Consulta $record): string => $record->whatsappUrl())->openUrlInNewTab(),
                Action::make('markAnswered')->label('Marcar respondida')->icon('heroicon-o-check')->requiresConfirmation()->action(fn (Consulta $record) => $record->markAsAnswered()),
                EditAction::make()->label('Gestionar'),
            ])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])])
            ->defaultSort('created_at', 'desc');
    }
}
