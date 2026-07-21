<?php

namespace App\Filament\Resources\AvisoSitios;

use App\Filament\Resources\AvisoSitios\Pages\CreateAvisoSitio;
use App\Filament\Resources\AvisoSitios\Pages\EditAvisoSitio;
use App\Filament\Resources\AvisoSitios\Pages\ListAvisoSitios;
use App\Filament\Resources\AvisoSitios\Schemas\AvisoSitioForm;
use App\Filament\Resources\AvisoSitios\Tables\AvisoSitiosTable;
use App\Models\AvisoSitio;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class AvisoSitioResource extends Resource
{
    protected static ?string $model = AvisoSitio::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMegaphone;

    protected static string|\UnitEnum|null $navigationGroup = 'Contenido del sitio';

    protected static ?string $navigationLabel = 'Avisos del sitio';

    protected static ?string $modelLabel = 'aviso';

    protected static ?string $pluralModelLabel = 'avisos del sitio';

    protected static ?string $recordTitleAttribute = 'titulo';

    public static function form(Schema $schema): Schema
    {
        return AvisoSitioForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AvisoSitiosTable::configure($table);
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
            'index' => ListAvisoSitios::route('/'),
            'create' => CreateAvisoSitio::route('/create'),
            'edit' => EditAvisoSitio::route('/{record}/edit'),
        ];
    }
}
