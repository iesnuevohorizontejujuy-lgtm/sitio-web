<?php

namespace App\Models;

use Database\Factories\ConfiguracionPermisoExamenFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConfiguracionPermisoExamen extends Model
{
    /** @use HasFactory<ConfiguracionPermisoExamenFactory> */
    use HasFactory;

    protected $table = 'configuraciones_permiso_examen';

    protected $fillable = [
        'titulo', 'introduccion', 'indicaciones', 'advertencia_titulo', 'advertencia', 'publicada',
    ];

    protected $attributes = [
        'publicada' => false,
    ];

    protected function casts(): array
    {
        return [
            'indicaciones' => 'array',
            'publicada' => 'boolean',
        ];
    }

    public function scopePublicada(Builder $query): Builder
    {
        return $query->where('publicada', true);
    }
}
