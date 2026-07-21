<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AvisoSitioResource;
use App\Models\AvisoSitio;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AvisoSitioController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $notices = AvisoSitio::query()
            ->vigentes()
            ->orderByDesc('prioridad')
            ->latest('id')
            ->limit(10)
            ->get();

        return AvisoSitioResource::collection($notices);
    }
}
