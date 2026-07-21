<?php

namespace App\Http\Resources;

use App\Support\InstitutionalHtmlSanitizer;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class NoticiaResource extends JsonResource
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
            'slug' => $this->slug,
            'contenido' => (new InstitutionalHtmlSanitizer)->sanitize($this->contenido),
            'categoria' => $this->categoria,
            'created_at' => $this->created_at,
            'publicada_at' => $this->publicada_at,
            'fecha_evento' => $this->fecha_evento?->toDateString(),
            'video_url' => $this->video_url,
            'imagen_principal' => $this->imagen_principal_path
                ? url(Storage::disk('public')->url($this->imagen_principal_path))
                : null,
            'imagen_thumb' => $this->imagen_principal_path
                ? url(Storage::disk('public')->url($this->imagen_principal_path))
                : null,
        ];
    }
}
