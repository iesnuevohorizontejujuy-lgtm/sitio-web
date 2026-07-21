<?php

namespace App\Filament\Resources\ConvocatoriaIngresos;

use App\Filament\Resources\ConvocatoriaIngresos\Pages\CreateConvocatoriaIngreso;
use App\Filament\Resources\ConvocatoriaIngresos\Pages\EditConvocatoriaIngreso;
use App\Filament\Resources\ConvocatoriaIngresos\Pages\ListConvocatoriaIngresos;
use App\Filament\Resources\ConvocatoriaIngresos\Schemas\ConvocatoriaIngresoForm;
use App\Filament\Resources\ConvocatoriaIngresos\Tables\ConvocatoriaIngresosTable;
use App\Models\ConvocatoriaIngreso;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ConvocatoriaIngresoResource extends Resource
{
    protected static ?string $model = ConvocatoriaIngreso::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedAcademicCap;

    protected static string|\UnitEnum|null $navigationGroup = 'Contenido del sitio';

    protected static ?string $navigationLabel = 'Ingresantes';

    protected static ?string $modelLabel = 'convocatoria de ingreso';

    protected static ?string $pluralModelLabel = 'convocatorias de ingreso';

    protected static ?string $recordTitleAttribute = 'titulo';

    public static function form(Schema $schema): Schema
    {
        return ConvocatoriaIngresoForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ConvocatoriaIngresosTable::configure($table);
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
            'index' => ListConvocatoriaIngresos::route('/'),
            'create' => CreateConvocatoriaIngreso::route('/create'),
            'edit' => EditConvocatoriaIngreso::route('/{record}/edit'),
        ];
    }
}
