<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConfiguracionPermisoExamenResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $instructions = collect($this->indicaciones)
            ->map(fn (mixed $instruction): string => trim((string) data_get($instruction, 'texto')))
            ->filter()
            ->values()
            ->all();

        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'introduccion' => $this->introduccion,
            'indicaciones' => $instructions,
            'advertencia_titulo' => $this->advertencia_titulo,
            'advertencia' => $this->advertencia,
        ];
    }
}
