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

        return response()->json([
            'fechas_importantes' => NoticiaResource::collection(
                $news->where('categoria', 'fecha_importante')->values(),
            )->resolve(),
            'generales' => NoticiaResource::collection(
                $news->where('categoria', 'general')->values(),
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
