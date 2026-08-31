<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DiapositivaPortadaResource;
use App\Models\DiapositivaPortada;
use Illuminate\Http\JsonResponse;

class DiapositivaPortadaController extends Controller
{
    public function index(): JsonResponse
    {
        $slides = DiapositivaPortada::query()
            ->vigentes()
            ->orderBy('orden')
            ->orderByDesc('id')
            ->limit(3)
            ->get();

        return response()->json(DiapositivaPortadaResource::collection($slides)->resolve());
    }
}
