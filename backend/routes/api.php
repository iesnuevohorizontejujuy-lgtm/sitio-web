<?php

use App\Http\Controllers\Api\AutoridadController;
use App\Http\Controllers\Api\CarreraController;
use App\Http\Controllers\Api\ConsultaController;
use App\Http\Controllers\Api\ConvocatoriaIngresoController;
use App\Http\Controllers\Api\NoticiaController;
use Illuminate\Support\Facades\Route;

Route::get('/carreras', [CarreraController::class, 'index']);
Route::get('/carreras/{slug}', [CarreraController::class, 'show']);

Route::get('/noticias', [NoticiaController::class, 'index']);
Route::get('/noticias/{slug}', [NoticiaController::class, 'show']);

Route::get('/ingresantes', [ConvocatoriaIngresoController::class, 'index']);
Route::get('/autoridades', [AutoridadController::class, 'index']);

Route::post('/consultas', ConsultaController::class)->middleware('throttle:consultas');
