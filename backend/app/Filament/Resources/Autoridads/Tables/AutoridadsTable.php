<?php

namespace App\Filament\Resources\Autoridads\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AutoridadsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('imagen_path')->label('Foto')->disk('public')->circular(),
                TextColumn::make('nombre')->searchable()->sortable()->weight('bold'),
                TextColumn::make('cargo')->searchable()->sortable()->wrap(),
                TextColumn::make('orden')->sortable(),
                IconColumn::make('publicada')->label('Visible')->boolean(),
            ])
            ->filters([
                //
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
