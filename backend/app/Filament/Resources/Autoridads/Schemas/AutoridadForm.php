<?php

namespace App\Filament\Resources\Autoridads\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AutoridadForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Section::make('Información pública')
                    ->columnSpan(2)
                    ->columns(2)
                    ->schema([
                        TextInput::make('nombre')->required()->maxLength(255),
                        TextInput::make('cargo')->required()->maxLength(255),
                        Textarea::make('descripcion')->label('Presentación breve')->rows(4)->maxLength(1000)->columnSpanFull(),
                    ]),
                Section::make('Publicación')
                    ->columnSpan(1)
                    ->schema([
                        FileUpload::make('imagen_path')->label('Fotografía')->disk('public')->directory('institucion/autoridades')->image()->imageEditor()->maxSize(5120),
                        TextInput::make('orden')->numeric()->minValue(0)->default(0),
                        Toggle::make('publicada')->label('Mostrar en el sitio')->default(false),
                    ]),
            ]);
    }
}
