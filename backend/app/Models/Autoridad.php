<?php

namespace App\Models;

use Database\Factories\AutoridadFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Autoridad extends Model
{
    /** @use HasFactory<AutoridadFactory> */
    use HasFactory;

    protected $table = 'autoridades';

    protected $fillable = [
        'nombre', 'cargo', 'descripcion', 'imagen_path', 'publicada', 'orden',
    ];

    protected $attributes = [
        'publicada' => false,
        'orden' => 0,
    ];

    protected function casts(): array
    {
        return ['publicada' => 'boolean'];
    }

    public function scopePublicadas(Builder $query): Builder
    {
        return $query->where('publicada', true);
    }
}
