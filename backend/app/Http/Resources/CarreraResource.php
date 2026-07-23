<?php

namespace App\Http\Resources;

use App\Support\InstitutionalHtmlSanitizer;
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
        $htmlSanitizer = new InstitutionalHtmlSanitizer;

        return [
            'id' => $this->id,
            'title' => $this->nombre,
            'nombre' => $this->nombre,
            'short_title' => $this->nombre_corto,
            'slug' => $this->slug,
            'area' => $this->area,
            'description' => $this->descripcion_corta,
            'content' => $htmlSanitizer->sanitize($this->perfil_profesional ?: $this->descripcion),
            'perfil_profesional' => $htmlSanitizer->sanitize($this->perfil_profesional),
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
            'gallery' => $this->imagenes->take(8)->map(fn ($image): array => [
                'id' => $image->id,
                'url' => $this->publicUrl($image->path),
                'alt' => $image->texto_alternativo,
                'caption' => $image->epigrafe,
            ])->values(),
            'social_posts' => $this->publicacionesSociales
                ->filter(fn ($post): bool => $post->canonicalUrl() !== null)
                ->take(3)
                ->map(fn ($post): array => [
                    'id' => $post->id,
                    'platform' => $post->plataforma,
                    'type' => $post->tipo_contenido,
                    'title' => $post->titulo,
                    'description' => $post->descripcion,
                    'url' => $post->canonicalUrl(),
                    'account' => $post->cuenta,
                    'published_at' => $post->fecha_publicacion?->toDateString(),
                    'button_label' => $post->texto_boton,
                    'preview_image' => $this->publicUrl($post->imagen_previsualizacion_path),
                    'preview_alt' => $post->imagen_previsualizacion_alt,
                ])->values(),
            'featured' => $this->destacada,
        ];
    }

    private function publicUrl(?string $path): ?string
    {
        return $path ? url(Storage::disk('public')->url($path)) : null;
    }
}
