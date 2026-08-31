<?php

namespace App\Filament\Resources\DiapositivaPortadas\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class DiapositivaPortadaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->columns(3)
            ->components([
                Section::make('Mensaje de campaña')->columnSpan(2)->columns(2)->schema([
                    TextInput::make('etiqueta')->label('Etiqueta superior')->required()->maxLength(120)->columnSpanFull(),
                    TextInput::make('titulo')->label('Título')->required()->maxLength(255)->columnSpanFull(),
                    Textarea::make('bajada')->label('Descripción')->required()->rows(4)->maxLength(600)->columnSpanFull(),
                    TextInput::make('texto_boton')->label('Texto del botón principal')->required()->maxLength(80),
                    TextInput::make('url_boton')->label('Destino principal')->required()->maxLength(1000)->rules(['regex:/^(\/(?!\/)|https?:\/\/)/i'])->placeholder('/carreras'),
                    TextInput::make('texto_boton_secundario')->label('Texto del botón secundario')->maxLength(80),
                    TextInput::make('url_boton_secundario')->label('Destino secundario')->maxLength(1000)->rules(['nullable', 'regex:/^(\/(?!\/)|https?:\/\/)/i'])->placeholder('/ingresantes'),
                ]),
                Section::make('Publicación')->columnSpan(1)->schema([
                    TextInput::make('orden')->numeric()->integer()->minValue(0)->maxValue(99)->default(0)->required()->helperText('0 aparece antes que 1. Se muestran hasta tres diapositivas.'),
                    Toggle::make('publicada')->label('Publicar en el inicio')->default(false),
                    DateTimePicker::make('inicia_at')->label('Mostrar desde')->native(false)->seconds(false),
                    DateTimePicker::make('finaliza_at')->label('Mostrar hasta')->native(false)->seconds(false)->afterOrEqual('inicia_at'),
                ]),
                Section::make('Imágenes')->description('Usá fotografías institucionales autorizadas y sin texto incrustado.')->columnSpanFull()->columns(2)->schema([
                    FileUpload::make('imagen_escritorio_path')->label('Imagen de escritorio')->disk('public')->directory('portada')->image()->imageEditor()->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])->maxSize(8192)->required()->helperText('Recomendado: formato horizontal 16:9.'),
                    FileUpload::make('imagen_movil_path')->label('Imagen para celular (opcional)')->disk('public')->directory('portada')->image()->imageEditor()->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])->maxSize(8192)->helperText('Recomendado: formato vertical 4:5. Si falta, se usa la imagen de escritorio.'),
                    TextInput::make('imagen_alt')->label('Descripción accesible de la imagen')->required()->maxLength(255)->columnSpanFull()->helperText('Describí brevemente lo que se ve, sin empezar con “imagen de”.'),
                ]),
            ]);
    }
}
