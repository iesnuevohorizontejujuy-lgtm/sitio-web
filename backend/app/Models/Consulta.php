<?php

namespace App\Models;

use Database\Factories\ConsultaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Consulta extends Model
{
    /** @use HasFactory<ConsultaFactory> */
    use HasFactory;

    protected $fillable = [
        'carrera_id', 'nombre', 'telefono', 'email', 'asunto', 'mensaje',
        'horario_preferido', 'pagina_origen', 'estado', 'notas_internas', 'respondida_at',
    ];

    protected $attributes = ['estado' => 'nueva'];

    protected function casts(): array
    {
        return ['respondida_at' => 'datetime'];
    }

    public function carrera(): BelongsTo
    {
        return $this->belongsTo(Carrera::class);
    }

    public function whatsappUrl(): string
    {
        $phone = Str::of($this->telefono)->replaceMatches('/\D+/', '')->toString();
        $message = 'Hola '.$this->nombre.', te respondemos desde el IES Nuevo Horizonte';

        if ($this->carrera) {
            $message .= ' por tu consulta sobre '.$this->carrera->nombre;
        }

        return 'https://wa.me/'.$phone.'?text='.rawurlencode($message.'.');
    }

    public function markAsAnswered(): void
    {
        $this->update([
            'estado' => 'respondida',
            'respondida_at' => now(),
        ]);
    }
}
