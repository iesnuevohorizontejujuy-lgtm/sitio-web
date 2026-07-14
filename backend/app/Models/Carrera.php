<?php

namespace App\Models;

use Database\Factories\CarreraFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Carrera extends Model
{
    /** @use HasFactory<CarreraFactory> */
    use HasFactory;

    protected $fillable = [
        'nombre', 'slug', 'nombre_corto', 'area', 'duracion_anios', 'modalidad',
        'titulo_otorgado', 'resolucion', 'descripcion_corta', 'descripcion',
        'perfil_profesional', 'capacidades', 'salida_laboral', 'imagen_portada_path',
        'plan_estudio_path', 'resolucion_path', 'destacada', 'publicada', 'orden',
    ];

    protected $attributes = [
        'duracion_anios' => 3,
        'modalidad' => 'Presencial',
        'destacada' => false,
        'publicada' => false,
        'orden' => 0,
    ];

    protected function casts(): array
    {
        return [
            'capacidades' => 'array',
            'salida_laboral' => 'array',
            'destacada' => 'boolean',
            'publicada' => 'boolean',
        ];
    }

    public function materias(): HasMany
    {
        return $this->hasMany(Materia::class)->orderBy('anio')->orderBy('orden');
    }

    public function consultas(): HasMany
    {
        return $this->hasMany(Consulta::class);
    }

    public function imagenes(): HasMany
    {
        return $this->hasMany(CarreraImagen::class)->orderBy('orden');
    }

    public function scopePublicadas(Builder $query): Builder
    {
        return $query->where('publicada', true);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
