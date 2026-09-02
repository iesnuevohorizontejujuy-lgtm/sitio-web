<?php

namespace App\Filament\Resources\ConfiguracionPermisoExamens;

use App\Filament\Resources\ConfiguracionPermisoExamens\Pages\CreateConfiguracionPermisoExamen;
use App\Filament\Resources\ConfiguracionPermisoExamens\Pages\EditConfiguracionPermisoExamen;
use App\Filament\Resources\ConfiguracionPermisoExamens\Pages\ListConfiguracionPermisoExamens;
use App\Filament\Resources\ConfiguracionPermisoExamens\Schemas\ConfiguracionPermisoExamenForm;
use App\Filament\Resources\ConfiguracionPermisoExamens\Tables\ConfiguracionPermisoExamensTable;
use App\Models\ConfiguracionPermisoExamen;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ConfiguracionPermisoExamenResource extends Resource
{
    protected static ?string $model = ConfiguracionPermisoExamen::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentCheck;

    protected static string|\UnitEnum|null $navigationGroup = 'Contenido del sitio';

    protected static ?string $navigationLabel = 'Permisos de examen';

    protected static ?string $modelLabel = 'contenido de permisos';

    protected static ?string $pluralModelLabel = 'contenidos de permisos';

    protected static ?string $recordTitleAttribute = 'titulo';

    public static function form(Schema $schema): Schema
    {
        return ConfiguracionPermisoExamenForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ConfiguracionPermisoExamensTable::configure($table);
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
            'index' => ListConfiguracionPermisoExamens::route('/'),
            'create' => CreateConfiguracionPermisoExamen::route('/create'),
            'edit' => EditConfiguracionPermisoExamen::route('/{record}/edit'),
        ];
    }
}
