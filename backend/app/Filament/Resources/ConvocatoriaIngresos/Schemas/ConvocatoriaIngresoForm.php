<?php

namespace App\Filament\Resources\ConvocatoriaIngresos\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ConvocatoriaIngresoForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Section::make('Convocatoria')
                    ->description('Información pública del período de ingreso vigente.')
                    ->columnSpan(2)
                    ->columns(2)
                    ->schema([
                        TextInput::make('titulo')->required()->maxLength(255),
                        TextInput::make('ciclo_lectivo')->label('Ciclo lectivo')->required()->maxLength(20),
                        Select::make('estado')->required()->native(false)->options([
                            'proximamente' => 'Próximamente',
                            'abiertas' => 'Inscripciones abiertas',
                            'cerradas' => 'Inscripciones cerradas',
                        ]),
                        DatePicker::make('fecha_inicio')->label('Fecha de apertura')->native(false)->displayFormat('d/m/Y'),
                        DatePicker::make('fecha_fin')->label('Fecha de cierre')->native(false)->displayFormat('d/m/Y')->afterOrEqual('fecha_inicio'),
                        Textarea::make('bajada')->label('Mensaje principal')->rows(4)->maxLength(1000)->columnSpanFull(),
                    ]),
                Section::make('Publicación')
                    ->columnSpan(1)
                    ->schema([
                        Toggle::make('esta_publicada')->label('Mostrar en el sitio')->default(false),
                        DateTimePicker::make('publicada_at')->label('Publicar desde')->seconds(false)->helperText('Opcional. La convocatoria más reciente será la visible.'),
                    ]),
                Section::make('Requisitos')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('requisitos')
                            ->label('Documentación y condiciones')
                            ->schema([
                                TextInput::make('texto')->required()->maxLength(500),
                            ])
                            ->addActionLabel('Agregar requisito')
                            ->reorderable()
                            ->collapsible()
                            ->maxItems(20),
                    ]),
                Section::make('Documentos descargables')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('documentos')
                            ->schema([
                                TextInput::make('nombre')->required()->maxLength(255),
                                FileUpload::make('archivo')
                                    ->required()
                                    ->disk('public')
                                    ->directory('ingresantes/documentos')
                                    ->acceptedFileTypes(['application/pdf'])
                                    ->maxSize(10240),
                            ])
                            ->columns(2)
                            ->addActionLabel('Agregar documento')
                            ->reorderable()
                            ->collapsible()
                            ->maxItems(10),
                    ]),
                Section::make('Preguntas frecuentes')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('preguntas_frecuentes')
                            ->schema([
                                TextInput::make('pregunta')->required()->maxLength(255),
                                Textarea::make('respuesta')->required()->rows(3)->maxLength(1500),
                            ])
                            ->addActionLabel('Agregar pregunta')
                            ->reorderable()
                            ->collapsible()
                            ->maxItems(20),
                    ]),
            ]);
    }
}
