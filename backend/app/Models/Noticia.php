<?php

namespace App\Models;

use Database\Factories\NoticiaFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Noticia extends Model
{
    /** @use HasFactory<NoticiaFactory> */
    use HasFactory;

    protected $fillable = [
        'titulo', 'slug', 'contenido', 'categoria', 'fecha_evento',
        'imagen_principal_path', 'video_url', 'esta_publicada', 'publicada_at',
    ];

    protected $attributes = ['categoria' => 'general', 'esta_publicada' => false];

    protected function casts(): array
    {
        return [
            'fecha_evento' => 'date',
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

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
