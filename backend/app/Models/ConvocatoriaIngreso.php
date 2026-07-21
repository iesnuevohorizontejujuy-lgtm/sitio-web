<?php

namespace App\Models;

use Database\Factories\ConvocatoriaIngresoFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConvocatoriaIngreso extends Model
{
    /** @use HasFactory<ConvocatoriaIngresoFactory> */
    use HasFactory;

    protected $fillable = [
        'titulo', 'ciclo_lectivo', 'estado', 'bajada', 'fecha_inicio', 'fecha_fin',
        'requisitos', 'documentos', 'preguntas_frecuentes', 'esta_publicada', 'publicada_at',
    ];

    protected $attributes = [
        'estado' => 'proximamente',
        'esta_publicada' => false,
    ];

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date',
            'requisitos' => 'array',
            'documentos' => 'array',
            'preguntas_frecuentes' => 'array',
            'esta_publicada' => 'boolean',
            'publicada_at' => 'datetime',
        ];
    }

    public function scopePublicadas(Builder $query): Builder
    {
        return $query
            ->where('esta_publicada', true)
            ->where(fn (Builder $query) => $query
                ->whereNull('publicada_at')
                ->orWhere('publicada_at', '<=', now()));
    }
}
