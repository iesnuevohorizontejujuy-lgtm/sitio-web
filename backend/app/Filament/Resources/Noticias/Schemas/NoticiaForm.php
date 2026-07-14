<?php

namespace App\Filament\Resources\Noticias\Schemas;

use App\Models\Noticia;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class NoticiaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->columns(3)->components([
            Section::make('Contenido')->columnSpan(2)->columns(2)->schema([
                TextInput::make('titulo')->required()->maxLength(255)->live(onBlur: true)
                    ->afterStateUpdated(fn (?string $state, callable $set) => $set('slug', Str::slug((string) $state))),
                TextInput::make('slug')->required()->unique(Noticia::class, 'slug', ignoreRecord: true),
                RichEditor::make('contenido')->required()->columnSpanFull(),
                FileUpload::make('imagen_principal_path')->label('Imagen principal')->disk('public')->directory('noticias')->image()->imageEditor()->maxSize(5120)->columnSpanFull(),
                TextInput::make('video_url')->label('Video de YouTube o Vimeo')->url()->maxLength(1000)->columnSpanFull(),
            ]),
            Section::make('Publicación')->columnSpan(1)->schema([
                Select::make('categoria')->label('Tipo')->required()->native(false)->options([
                    'general' => 'Noticia o actividad',
                    'fecha_importante' => 'Fecha importante',
                ]),
                DatePicker::make('fecha_evento')->label('Fecha de la actividad'),
                Toggle::make('esta_publicada')->label('Publicar en el sitio')->default(false),
                DateTimePicker::make('publicada_at')->label('Publicar desde')->seconds(false)->helperText('Opcional: permite programar la publicación.'),
            ]),
        ]);
    }
}
