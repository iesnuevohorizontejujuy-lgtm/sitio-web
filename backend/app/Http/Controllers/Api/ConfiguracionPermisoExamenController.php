<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ConfiguracionPermisoExamenResource;
use App\Models\ConfiguracionPermisoExamen;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ConfiguracionPermisoExamenController extends Controller
{
    public function __invoke(): JsonResponse|Response
    {
        $configuration = ConfiguracionPermisoExamen::query()
            ->publicada()
            ->latest('updated_at')
            ->first();

        if (! $configuration) {
            return response()->noContent();
        }

        return response()->json(
            (new ConfiguracionPermisoExamenResource($configuration))->resolve()
        );
    }
}
