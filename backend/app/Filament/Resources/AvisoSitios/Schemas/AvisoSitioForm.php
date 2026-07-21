<?php

namespace App\Filament\Resources\AvisoSitios\Schemas;

use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AvisoSitioForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Section::make('Contenido del aviso')
                    ->description('Puede mostrarse como modal, franja superior o banner editorial.')
                    ->columnSpan(2)
                    ->columns(2)
                    ->schema([
                        TextInput::make('titulo')->required()->maxLength(255)->columnSpanFull(),
                        Textarea::make('mensaje')->required()->rows(5)->maxLength(2000)->columnSpanFull(),
                        FileUpload::make('imagen_path')
                            ->label('Imagen o banner')
                            ->disk('public')
                            ->directory('avisos')
                            ->image()
                            ->imageEditor()
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->maxSize(5120)
                            ->columnSpanFull(),
                        TextInput::make('texto_enlace')->label('Texto del botón')->maxLength(80),
                        TextInput::make('url_enlace')->label('Destino del botón')->maxLength(1000)->placeholder('/ingresantes')->helperText('Usá una ruta interna que comience con / o una URL http(s).'),
                    ]),
                Section::make('Presentación')
                    ->columnSpan(1)
                    ->schema([
                        Select::make('presentacion')->required()->native(false)->options([
                            'modal' => 'Modal destacado',
                            'franja' => 'Franja superior',
                            'banner' => 'Banner editorial',
                        ])->default('modal'),
                        Select::make('frecuencia')->required()->native(false)->options([
                            'siempre' => 'En cada visita',
                            'sesion' => 'Una vez por sesión',
                            'una_vez' => 'Una sola vez por navegador',
                        ])->default('sesion'),
                        TextInput::make('prioridad')->numeric()->minValue(0)->maxValue(100)->default(0)->helperText('El número más alto se muestra primero.'),
                    ]),
                Section::make('Páginas donde se muestra')
                    ->columnSpan(2)
                    ->schema([
                        CheckboxList::make('paginas')->required()->columns(2)->options([
                            'todas' => 'Todo el sitio institucional',
                            'inicio' => 'Inicio',
                            'institucion' => 'Institución',
                            'carreras' => 'Carreras y sus detalles',
                            'ingresantes' => 'Ingresantes',
                            'vida_institucional' => 'Vida institucional y publicaciones',
                        ])->default(['todas'])->helperText('Los avisos nunca se muestran dentro del Campus.'),
                    ]),
                Section::make('Programación')
                    ->columnSpan(1)
                    ->schema([
                        Toggle::make('publicado')->label('Publicar aviso')->default(false),
                        DateTimePicker::make('inicia_at')->label('Mostrar desde')->seconds(false),
                        DateTimePicker::make('finaliza_at')->label('Mostrar hasta')->seconds(false)->afterOrEqual('inicia_at'),
                    ]),
            ]);
    }
}
