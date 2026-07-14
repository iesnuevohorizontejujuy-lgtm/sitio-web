<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreConsultaRequest;
use App\Http\Resources\ConsultaResource;
use App\Models\Consulta;
use Illuminate\Http\JsonResponse;

class ConsultaController extends Controller
{
    public function __invoke(StoreConsultaRequest $request): JsonResponse
    {
        $data = $request->safe()->except(['acepta_contacto', 'website']);
        $inquiry = Consulta::create($data);

        return response()->json([
            'message' => 'Recibimos tu consulta. El equipo del instituto se comunicará con vos.',
            'consulta' => new ConsultaResource($inquiry->load('carrera')),
        ], 201);
    }
}
