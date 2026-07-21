<?php

namespace App\Filament\Resources\Autoridads;

use App\Filament\Resources\Autoridads\Pages\CreateAutoridad;
use App\Filament\Resources\Autoridads\Pages\EditAutoridad;
use App\Filament\Resources\Autoridads\Pages\ListAutoridads;
use App\Filament\Resources\Autoridads\Schemas\AutoridadForm;
use App\Filament\Resources\Autoridads\Tables\AutoridadsTable;
use App\Models\Autoridad;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class AutoridadResource extends Resource
{
    protected static ?string $model = Autoridad::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUserGroup;

    protected static string|\UnitEnum|null $navigationGroup = 'Contenido del sitio';

    protected static ?string $navigationLabel = 'Autoridades';

    protected static ?string $modelLabel = 'autoridad';

    protected static ?string $pluralModelLabel = 'autoridades';

    protected static ?string $recordTitleAttribute = 'nombre';

    public static function form(Schema $schema): Schema
    {
        return AutoridadForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AutoridadsTable::configure($table);
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
            'index' => ListAutoridads::route('/'),
            'create' => CreateAutoridad::route('/create'),
            'edit' => EditAutoridad::route('/{record}/edit'),
        ];
    }
}
