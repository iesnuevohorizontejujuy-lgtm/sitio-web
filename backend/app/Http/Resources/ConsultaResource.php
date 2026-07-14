<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConsultaResource extends JsonResource
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
            'estado' => $this->estado,
            'carrera' => $this->whenLoaded('carrera', fn (): ?array => $this->carrera ? [
                'id' => $this->carrera->id,
                'nombre' => $this->carrera->nombre,
            ] : null),
            'created_at' => $this->created_at,
        ];
    }
}
