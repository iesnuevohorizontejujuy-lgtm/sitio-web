<?php

namespace App\Filament\Resources\Consultas\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ConsultaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->columns(3)->components([
            Section::make('Consulta recibida')->columnSpan(2)->columns(2)->schema([
                TextInput::make('nombre')->disabled(),
                TextInput::make('telefono')->disabled(),
                TextInput::make('email')->disabled(),
                TextInput::make('carrera.nombre')->label('Carrera')->disabled(),
                TextInput::make('asunto')->disabled()->columnSpanFull(),
                Textarea::make('mensaje')->disabled()->rows(8)->columnSpanFull(),
                TextInput::make('horario_preferido')->label('Horario preferido')->disabled(),
                TextInput::make('pagina_origen')->label('Página de origen')->disabled()->columnSpanFull(),
            ]),
            Section::make('Seguimiento')->columnSpan(1)->schema([
                Select::make('estado')->required()->native(false)->options([
                    'nueva' => 'Nueva',
                    'en_gestion' => 'En gestión',
                    'respondida' => 'Respondida',
                    'archivada' => 'Archivada',
                ]),
                DateTimePicker::make('respondida_at')->label('Fecha de respuesta')->seconds(false),
                Textarea::make('notas_internas')->label('Notas internas')->rows(8),
            ]),
        ]);
    }
}
