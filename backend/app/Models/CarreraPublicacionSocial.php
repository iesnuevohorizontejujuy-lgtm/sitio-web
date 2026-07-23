<?php

namespace App\Models;

use Database\Factories\CarreraPublicacionSocialFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarreraPublicacionSocial extends Model
{
    /** @use HasFactory<CarreraPublicacionSocialFactory> */
    use HasFactory;

    protected $table = 'carrera_publicaciones_sociales';

    protected $fillable = [
        'carrera_id', 'plataforma', 'tipo_contenido', 'titulo', 'descripcion', 'url',
        'cuenta', 'fecha_publicacion', 'texto_boton', 'imagen_previsualizacion_path',
        'imagen_previsualizacion_alt', 'uso_institucional_autorizado', 'publicada', 'orden',
    ];

    protected $attributes = [
        'plataforma' => 'instagram',
        'tipo_contenido' => 'reel',
        'texto_boton' => 'Ver en Instagram',
        'uso_institucional_autorizado' => false,
        'publicada' => false,
        'orden' => 0,
    ];

    protected function casts(): array
    {
        return [
            'fecha_publicacion' => 'date',
            'uso_institucional_autorizado' => 'boolean',
            'publicada' => 'boolean',
        ];
    }

    public function carrera(): BelongsTo
    {
        return $this->belongsTo(Carrera::class);
    }

    public function scopePublicadas(Builder $query): Builder
    {
        return $query
            ->where('publicada', true)
            ->where('uso_institucional_autorizado', true);
    }

    public function canonicalUrl(): ?string
    {
        $parts = parse_url($this->url);
        $host = strtolower($parts['host'] ?? '');
        $path = $parts['path'] ?? '';

        if (($parts['scheme'] ?? '') !== 'https') {
            return null;
        }

        $supportedHosts = match ($this->plataforma) {
            'instagram' => ['instagram.com', 'www.instagram.com'],
            'youtube' => ['youtube.com', 'www.youtube.com', 'youtu.be'],
            'facebook' => ['facebook.com', 'www.facebook.com', 'fb.watch'],
            'tiktok' => ['tiktok.com', 'www.tiktok.com'],
            default => [],
        };

        if (! in_array($host, $supportedHosts, true) || $path === '') {
            return null;
        }

        if ($this->plataforma === 'instagram') {
            if (! preg_match('#^/(reel|p|tv)/[^/]+/?$#', $path)) {
                return null;
            }

            return 'https://'.$host.'/'.trim($path, '/').'/';
        }

        return filter_var($this->url, FILTER_VALIDATE_URL) ? $this->url : null;
    }
}
