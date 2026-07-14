<?php

namespace App\Models;

use Database\Factories\MateriaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Materia extends Model
{
    /** @use HasFactory<MateriaFactory> */
    use HasFactory;

    protected $fillable = ['carrera_id', 'nombre', 'anio', 'orden'];

    protected $attributes = ['orden' => 0];

    public function carrera(): BelongsTo
    {
        return $this->belongsTo(Carrera::class);
    }
}
