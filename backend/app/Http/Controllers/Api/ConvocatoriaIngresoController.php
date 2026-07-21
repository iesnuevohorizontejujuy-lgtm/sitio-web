<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ConvocatoriaIngresoResource;
use App\Models\ConvocatoriaIngreso;

class ConvocatoriaIngresoController extends Controller
{
    public function index(): ConvocatoriaIngresoResource
    {
        $convocatoria = ConvocatoriaIngreso::query()
            ->publicadas()
            ->latest('publicada_at')
            ->latest()
            ->firstOrFail();

        return new ConvocatoriaIngresoResource($convocatoria);
    }
}
