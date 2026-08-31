<?php

namespace App\Filament\Resources\DiapositivaPortadas;

use App\Filament\Resources\DiapositivaPortadas\Pages\CreateDiapositivaPortada;
use App\Filament\Resources\DiapositivaPortadas\Pages\EditDiapositivaPortada;
use App\Filament\Resources\DiapositivaPortadas\Pages\ListDiapositivaPortadas;
use App\Filament\Resources\DiapositivaPortadas\Schemas\DiapositivaPortadaForm;
use App\Filament\Resources\DiapositivaPortadas\Tables\DiapositivaPortadasTable;
use App\Models\DiapositivaPortada;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class DiapositivaPortadaResource extends Resource
{
    protected static ?string $model = DiapositivaPortada::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Contenido del sitio';

    protected static ?string $navigationLabel = 'Diapositivas de portada';

    protected static ?string $modelLabel = 'diapositiva';

    protected static ?string $pluralModelLabel = 'diapositivas de portada';

    protected static ?string $recordTitleAttribute = 'titulo';

    public static function form(Schema $schema): Schema
    {
        return DiapositivaPortadaForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DiapositivaPortadasTable::configure($table);
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
            'index' => ListDiapositivaPortadas::route('/'),
            'create' => CreateDiapositivaPortada::route('/create'),
            'edit' => EditDiapositivaPortada::route('/{record}/edit'),
        ];
    }
}
