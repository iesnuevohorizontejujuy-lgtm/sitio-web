<?php

namespace App\Models;

use Database\Factories\CarreraImagenFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CarreraImagen extends Model
{
    /** @use HasFactory<CarreraImagenFactory> */
    use HasFactory;

    protected $table = 'carrera_imagenes';

    protected $fillable = ['carrera_id', 'path', 'texto_alternativo', 'epigrafe', 'orden'];

    protected $attributes = ['orden' => 0];

    public function carrera(): BelongsTo
    {
        return $this->belongsTo(Carrera::class);
    }
}
