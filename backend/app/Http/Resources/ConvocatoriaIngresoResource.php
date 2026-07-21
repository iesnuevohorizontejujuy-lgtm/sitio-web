<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ConvocatoriaIngresoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'ciclo_lectivo' => $this->ciclo_lectivo,
            'estado' => $this->estado,
            'bajada' => $this->bajada,
            'fecha_inicio' => $this->fecha_inicio?->toDateString(),
            'fecha_fin' => $this->fecha_fin?->toDateString(),
            'requisitos' => collect($this->requisitos)->pluck('texto')->filter()->values(),
            'documentos' => collect($this->documentos)->map(fn (array $documento): array => [
                'nombre' => $documento['nombre'] ?? 'Documento',
                'url' => filled($documento['archivo'] ?? null)
                    ? url(Storage::disk('public')->url($documento['archivo']))
                    : null,
            ])->filter(fn (array $documento): bool => filled($documento['url']))->values(),
            'preguntas_frecuentes' => collect($this->preguntas_frecuentes)->map(fn (array $pregunta): array => [
                'pregunta' => $pregunta['pregunta'] ?? '',
                'respuesta' => $pregunta['respuesta'] ?? '',
            ])->filter(fn (array $pregunta): bool => filled($pregunta['pregunta']) && filled($pregunta['respuesta']))->values(),
        ];
    }
}
