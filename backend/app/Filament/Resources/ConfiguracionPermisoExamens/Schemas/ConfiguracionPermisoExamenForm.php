<?php

namespace App\Filament\Resources\ConfiguracionPermisoExamens\Schemas;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ConfiguracionPermisoExamenForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->columns(3)
            ->components([
                Section::make('Mensaje para estudiantes')
                    ->description('Este contenido se presenta en bloques legibles antes del formulario de permisos.')
                    ->columnSpan(2)
                    ->schema([
                        TextInput::make('titulo')
                            ->label('Título')
                            ->required()
                            ->maxLength(180),
                        Textarea::make('introduccion')
                            ->label('Introducción')
                            ->required()
                            ->rows(4)
                            ->maxLength(800),
                        Repeater::make('indicaciones')
                            ->label('Indicaciones paso a paso')
                            ->schema([
                                TextInput::make('texto')
                                    ->label('Indicación')
                                    ->required()
                                    ->maxLength(300),
                            ])
                            ->minItems(1)
                            ->maxItems(8)
                            ->defaultItems(3)
                            ->reorderable()
                            ->addActionLabel('Agregar indicación'),
                        TextInput::make('advertencia_titulo')
                            ->label('Título de la advertencia')
                            ->maxLength(120)
                            ->placeholder('Importante'),
                        Textarea::make('advertencia')
                            ->label('Advertencia final')
                            ->rows(4)
                            ->maxLength(800),
                    ]),
                Section::make('Publicación')
                    ->columnSpan(1)
                    ->schema([
                        Toggle::make('publicada')
                            ->label('Mostrar en permisos de examen')
                            ->default(false)
                            ->helperText('Se utiliza el contenido publicado que haya sido actualizado más recientemente.'),
                    ]),
            ]);
    }
}
