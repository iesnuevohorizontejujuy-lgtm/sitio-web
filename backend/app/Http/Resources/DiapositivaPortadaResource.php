<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DiapositivaPortadaResource extends JsonResource
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
            'etiqueta' => $this->etiqueta,
            'titulo' => $this->titulo,
            'bajada' => $this->bajada,
            'imagen_escritorio' => url(Storage::disk('public')->url($this->imagen_escritorio_path)),
            'imagen_movil' => $this->imagen_movil_path
                ? url(Storage::disk('public')->url($this->imagen_movil_path))
                : null,
            'imagen_alt' => $this->imagen_alt,
            'texto_boton' => $this->texto_boton,
            'url_boton' => $this->url_boton,
            'texto_boton_secundario' => $this->texto_boton_secundario,
            'url_boton_secundario' => $this->url_boton_secundario,
        ];
    }
}
