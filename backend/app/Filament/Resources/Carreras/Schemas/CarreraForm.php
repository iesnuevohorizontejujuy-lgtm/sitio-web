<?php

namespace App\Filament\Resources\Carreras\Schemas;

use App\Models\Carrera;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CarreraForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                Section::make('Información principal')
                    ->columnSpan(2)
                    ->columns(2)
                    ->schema([
                        TextInput::make('nombre')->required()->maxLength(255)->live(onBlur: true)
                            ->afterStateUpdated(fn (?string $state, callable $set) => $set('slug', Str::slug((string) $state))),
                        TextInput::make('slug')->required()->maxLength(255)
                            ->unique(Carrera::class, 'slug', ignoreRecord: true),
                        TextInput::make('nombre_corto')->label('Nombre corto')->maxLength(120),
                        Select::make('area')->required()->native(false)->options([
                            'Salud' => 'Salud',
                            'Tecnología' => 'Tecnología',
                            'Gestión' => 'Gestión',
                            'Sociedad y comunicación' => 'Sociedad y comunicación',
                            'Actividad física' => 'Actividad física',
                        ]),
                        TextInput::make('duracion_anios')->label('Duración en años')->numeric()->minValue(1)->maxValue(6)->required(),
                        Select::make('modalidad')->required()->native(false)->options([
                            'Presencial' => 'Presencial',
                            'Semipresencial' => 'Semipresencial',
                            'Virtual' => 'Virtual',
                        ]),
                        TextInput::make('titulo_otorgado')->label('Título otorgado')->maxLength(255),
                        TextInput::make('resolucion')->label('Código de resolución')->placeholder('Res. 2730-E-22')->maxLength(120),
                        Textarea::make('descripcion_corta')->label('Descripción breve')->rows(3)->maxLength(500)->columnSpanFull(),
                        RichEditor::make('descripcion')->label('Descripción de la carrera')->columnSpanFull(),
                        RichEditor::make('perfil_profesional')->label('Perfil profesional')->columnSpanFull(),
                        TagsInput::make('capacidades')->label('Capacidades profesionales')->columnSpanFull(),
                        TagsInput::make('salida_laboral')->label('Salida laboral')->columnSpanFull(),
                    ]),
                Section::make('Publicación')
                    ->columnSpan(1)
                    ->schema([
                        Toggle::make('publicada')->label('Visible en el sitio')->default(false),
                        Toggle::make('destacada')->label('Destacar en Inicio')->default(false),
                        TextInput::make('orden')->numeric()->minValue(0)->default(0),
                        FileUpload::make('imagen_portada_path')->label('Imagen de portada')->disk('public')->directory('carreras/portadas')->image()->imageEditor()->maxSize(5120),
                        FileUpload::make('plan_estudio_path')->label('Plan de estudios (PDF)')->disk('public')->directory('carreras/planes')->acceptedFileTypes(['application/pdf'])->maxSize(10240)->downloadable()->openable(),
                        FileUpload::make('resolucion_path')->label('Resolución (PDF)')->disk('public')->directory('carreras/resoluciones')->acceptedFileTypes(['application/pdf'])->maxSize(10240)->downloadable()->openable(),
                    ]),
                Section::make('Plan de estudios')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('materias')->relationship()->orderColumn('orden')->reorderable()->addActionLabel('Agregar materia')->schema([
                            TextInput::make('nombre')->required()->maxLength(255),
                            Select::make('anio')->label('Año')->required()->native(false)->options([1 => '1.º año', 2 => '2.º año', 3 => '3.º año', 4 => '4.º año']),
                        ])->columns(2)->collapsible(),
                    ]),
                Section::make('Galería de la carrera')
                    ->description('Hasta 8 fotos reales de estudiantes y actividades. El texto alternativo describe cada imagen para accesibilidad.')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('imagenes')->relationship()->orderColumn('orden')->reorderable()->addActionLabel('Agregar fotografía')->schema([
                            FileUpload::make('path')->label('Fotografía')->disk('public')->directory('carreras/galerias')->image()->imageEditor()->maxSize(5120)->required(),
                            TextInput::make('texto_alternativo')->label('Texto alternativo')->required()->maxLength(255),
                            TextInput::make('epigrafe')->label('Epígrafe')->maxLength(255),
                        ])->columns(3)->collapsible()->maxItems(8),
                    ]),
                Section::make('Contenido social de la carrera')
                    ->description('Publicaciones reales vinculadas con la carrera. En el sitio se muestran como máximo las primeras 3 que estén publicadas y autorizadas.')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('publicacionesSociales')
                            ->label('Publicaciones sociales')
                            ->relationship()
                            ->orderColumn('orden')
                            ->reorderable()
                            ->addActionLabel('Agregar publicación social')
                            ->schema([
                                Select::make('plataforma')
                                    ->required()
                                    ->native(false)
                                    ->default('instagram')
                                    ->options([
                                        'instagram' => 'Instagram',
                                        'youtube' => 'YouTube',
                                        'facebook' => 'Facebook',
                                        'tiktok' => 'TikTok',
                                    ]),
                                Select::make('tipo_contenido')
                                    ->label('Tipo de contenido')
                                    ->required()
                                    ->native(false)
                                    ->default('reel')
                                    ->options([
                                        'reel' => 'Reel',
                                        'publicacion' => 'Publicación',
                                        'video' => 'Video',
                                        'actividad' => 'Actividad institucional',
                                    ]),
                                TextInput::make('cuenta')
                                    ->label('Cuenta o autor')
                                    ->placeholder('@iesnuevohorizonte')
                                    ->maxLength(120),
                                TextInput::make('titulo')
                                    ->label('Título editorial')
                                    ->required()
                                    ->maxLength(255)
                                    ->columnSpan(2),
                                DatePicker::make('fecha_publicacion')
                                    ->label('Fecha de publicación')
                                    ->native(false)
                                    ->displayFormat('d/m/Y'),
                                Textarea::make('descripcion')
                                    ->label('Descripción')
                                    ->rows(3)
                                    ->maxLength(1000)
                                    ->columnSpanFull(),
                                TextInput::make('url')
                                    ->label('Enlace público')
                                    ->placeholder('https://www.instagram.com/reel/.../')
                                    ->helperText('Debe ser un enlace HTTPS público de la plataforma seleccionada. No pegues el código HTML del embed.')
                                    ->required()
                                    ->url()
                                    ->rules(['starts_with:https://'])
                                    ->regex('/^https:\/\/(?:(?:www\.)?(?:instagram\.com|youtube\.com|facebook\.com|tiktok\.com)|youtu\.be|fb\.watch)\/.+/i')
                                    ->maxLength(2048)
                                    ->columnSpanFull(),
                                FileUpload::make('imagen_previsualizacion_path')
                                    ->label('Portada opcional')
                                    ->helperText('Se muestra antes de cargar la publicación externa.')
                                    ->disk('public')
                                    ->directory('carreras/publicaciones-sociales')
                                    ->image()
                                    ->imageEditor()
                                    ->maxSize(5120),
                                TextInput::make('imagen_previsualizacion_alt')
                                    ->label('Texto alternativo de la portada')
                                    ->maxLength(255),
                                TextInput::make('texto_boton')
                                    ->label('Texto del botón')
                                    ->default('Ver en Instagram')
                                    ->required()
                                    ->maxLength(80),
                                Toggle::make('uso_institucional_autorizado')
                                    ->label('Uso institucional autorizado')
                                    ->helperText('Confirmá que el instituto puede difundir este contenido.')
                                    ->default(false),
                                Toggle::make('publicada')
                                    ->label('Visible en el sitio')
                                    ->default(false),
                            ])
                            ->columns(3)
                            ->collapsible()
                            ->maxItems(8),
                    ]),
            ]);
    }
}
