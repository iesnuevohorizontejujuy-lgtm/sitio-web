<?php

namespace App\Models;

use Database\Factories\AvisoSitioFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvisoSitio extends Model
{
    /** @use HasFactory<AvisoSitioFactory> */
    use HasFactory;

    protected $table = 'avisos_sitio';

    protected $fillable = [
        'titulo', 'mensaje', 'imagen_path', 'presentacion', 'paginas', 'texto_enlace',
        'url_enlace', 'frecuencia', 'prioridad', 'publicado', 'inicia_at', 'finaliza_at',
    ];

    protected $attributes = [
        'presentacion' => 'modal',
        'frecuencia' => 'sesion',
        'prioridad' => 0,
        'publicado' => false,
    ];

    protected function casts(): array
    {
        return [
            'paginas' => 'array',
            'prioridad' => 'integer',
            'publicado' => 'boolean',
            'inicia_at' => 'datetime',
            'finaliza_at' => 'datetime',
        ];
    }

    public function scopeVigentes(Builder $query): Builder
    {
        return $query
            ->where('publicado', true)
            ->where(fn (Builder $query) => $query
                ->whereNull('inicia_at')
                ->orWhere('inicia_at', '<=', now()))
            ->where(fn (Builder $query) => $query
                ->whereNull('finaliza_at')
                ->orWhere('finaliza_at', '>=', now()));
    }
}
