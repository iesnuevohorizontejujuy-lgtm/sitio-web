<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NoticiaResource;
use App\Models\Noticia;
use Illuminate\Http\JsonResponse;

class NoticiaController extends Controller
{
    public function index(): JsonResponse
    {
        $news = Noticia::query()->publicadas()->latest('publicada_at')->latest()->get();
        $featured = $news
            ->where('destacada', true)
            ->sortBy(fn (Noticia $item): array => [$item->orden_destacado ?? PHP_INT_MAX, -$item->id])
            ->values();
        $agenda = $news
            ->filter(fn (Noticia $item): bool => $item->fecha_evento?->isToday() || $item->fecha_evento?->isFuture())
            ->sortBy('fecha_evento')
            ->values();
        $agendaIds = $agenda->modelKeys();
        $editorialNews = $news->whereNotIn('id', $agendaIds)->values();

        return response()->json([
            'destacadas' => NoticiaResource::collection($featured)->resolve(),
            'noticias' => NoticiaResource::collection($editorialNews)->resolve(),
            'agenda' => NoticiaResource::collection($agenda)->resolve(),
            'fechas_importantes' => NoticiaResource::collection(
                $news->where('categoria', 'fecha_importante')->values(),
            )->resolve(),
            'generales' => NoticiaResource::collection(
                $news->where('categoria', '!=', 'fecha_importante')->values(),
            )->resolve(),
        ]);
    }

    public function show(string $slug): NoticiaResource
    {
        $newsItem = Noticia::query()
            ->publicadas()
            ->where('slug', $slug)
            ->firstOrFail();

        return new NoticiaResource($newsItem);
    }
}
