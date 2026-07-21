<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AvisoSitioResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $safeUrl = filled($this->url_enlace)
            && Str::startsWith($this->url_enlace, ['/', 'http://', 'https://'])
            ? $this->url_enlace
            : null;

        return [
            'id' => $this->id,
            'titulo' => $this->titulo,
            'mensaje' => $this->mensaje,
            'imagen' => $this->imagen_path ? url(Storage::disk('public')->url($this->imagen_path)) : null,
            'presentacion' => $this->presentacion,
            'paginas' => $this->paginas ?? ['todas'],
            'texto_enlace' => $safeUrl ? $this->texto_enlace : null,
            'url_enlace' => $safeUrl,
            'frecuencia' => $this->frecuencia,
            'prioridad' => $this->prioridad,
        ];
    }
}
