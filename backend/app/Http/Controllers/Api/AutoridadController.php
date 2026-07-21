<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AutoridadResource;
use App\Models\Autoridad;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AutoridadController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $authorities = Autoridad::query()->publicadas()->orderBy('orden')->orderBy('nombre')->get();

        return AutoridadResource::collection($authorities);
    }
}
