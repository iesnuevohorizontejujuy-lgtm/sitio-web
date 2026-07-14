<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CarreraResource;
use App\Models\Carrera;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CarreraController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $careers = Carrera::query()
            ->publicadas()
            ->with(['materias', 'imagenes'])
            ->orderBy('orden')
            ->orderBy('nombre')
            ->get();

        return CarreraResource::collection($careers);
    }

    public function show(string $slug): CarreraResource
    {
        $career = Carrera::query()
            ->publicadas()
            ->with(['materias', 'imagenes'])
            ->where('slug', $slug)
            ->firstOrFail();

        return new CarreraResource($career);
    }
}
