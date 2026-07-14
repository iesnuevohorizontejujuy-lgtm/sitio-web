<?php

namespace App\Filament\Resources\Consultas;

use App\Filament\Resources\Consultas\Pages\CreateConsulta;
use App\Filament\Resources\Consultas\Pages\EditConsulta;
use App\Filament\Resources\Consultas\Pages\ListConsultas;
use App\Filament\Resources\Consultas\Schemas\ConsultaForm;
use App\Filament\Resources\Consultas\Tables\ConsultasTable;
use App\Models\Consulta;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ConsultaResource extends Resource
{
    protected static ?string $model = Consulta::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;

    protected static string|\UnitEnum|null $navigationGroup = 'Atención';

    protected static ?string $navigationLabel = 'Consultas recibidas';

    protected static ?string $recordTitleAttribute = 'nombre';

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getNavigationBadge(): ?string
    {
        $count = static::getModel()::query()->where('estado', 'nueva')->count();

        return $count > 0 ? (string) $count : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'danger';
    }

    public static function form(Schema $schema): Schema
    {
        return ConsultaForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ConsultasTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListConsultas::route('/'),
            'create' => CreateConsulta::route('/create'),
            'edit' => EditConsulta::route('/{record}/edit'),
        ];
    }
}
