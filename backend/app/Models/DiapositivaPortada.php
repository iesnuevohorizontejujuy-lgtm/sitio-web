<?php

namespace App\Models;

use Database\Factories\DiapositivaPortadaFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiapositivaPortada extends Model
{
    /** @use HasFactory<DiapositivaPortadaFactory> */
    use HasFactory;

    protected $fillable = [
        'etiqueta', 'titulo', 'bajada', 'imagen_escritorio_path', 'imagen_movil_path',
        'imagen_alt', 'texto_boton', 'url_boton', 'texto_boton_secundario',
        'url_boton_secundario', 'orden', 'publicada', 'inicia_at', 'finaliza_at',
    ];

    protected $attributes = [
        'orden' => 0,
        'publicada' => false,
    ];

    protected function casts(): array
    {
        return [
            'orden' => 'integer',
            'publicada' => 'boolean',
            'inicia_at' => 'datetime',
            'finaliza_at' => 'datetime',
        ];
    }

    public function scopeVigentes(Builder $query): Builder
    {
        return $query
            ->where('publicada', true)
            ->where(fn (Builder $query) => $query
                ->whereNull('inicia_at')
                ->orWhere('inicia_at', '<=', now()))
            ->where(fn (Builder $query) => $query
                ->whereNull('finaliza_at')
                ->orWhere('finaliza_at', '>=', now()));
    }
}
