<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CarreraResource extends JsonResource
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
            'title' => $this->nombre,
            'nombre' => $this->nombre,
            'short_title' => $this->nombre_corto,
            'slug' => $this->slug,
            'area' => $this->area,
            'description' => $this->descripcion_corta,
            'content' => $this->perfil_profesional ?: $this->descripcion,
            'perfil_profesional' => $this->perfil_profesional,
            'duracion' => $this->duracion_anios.' años',
            'modalidad' => $this->modalidad,
            'titulo_otorgado' => $this->titulo_otorgado,
            'resolution_code' => $this->resolucion,
            'capabilities' => $this->capacidades ?? [],
            'employment' => $this->salida_laboral ?? [],
            'image' => $this->publicUrl($this->imagen_portada_path),
            'image_thumb' => $this->publicUrl($this->imagen_portada_path),
            'plan_estudio' => $this->publicUrl($this->plan_estudio_path),
            'resolucion' => $this->publicUrl($this->resolucion_path),
            'subjects' => $this->materias->map(fn ($subject): array => [
                'id' => $subject->id,
                'name' => $subject->nombre,
                'year' => $subject->anio,
                'order' => $subject->orden,
            ])->values(),
            'gallery' => $this->imagenes->map(fn ($image): array => [
                'id' => $image->id,
                'url' => $this->publicUrl($image->path),
                'alt' => $image->texto_alternativo,
                'caption' => $image->epigrafe,
            ])->values(),
            'featured' => $this->destacada,
        ];
    }

    private function publicUrl(?string $path): ?string
    {
        return $path ? url(Storage::disk('public')->url($path)) : null;
    }
}
