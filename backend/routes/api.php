<?php

use App\Http\Controllers\Api\AutoridadController;
use App\Http\Controllers\Api\AvisoSitioController;
use App\Http\Controllers\Api\CarreraController;
use App\Http\Controllers\Api\ConfiguracionPermisoExamenController;
use App\Http\Controllers\Api\ConsultaController;
use App\Http\Controllers\Api\ConvocatoriaIngresoController;
use App\Http\Controllers\Api\DiapositivaPortadaController;
use App\Http\Controllers\Api\NoticiaController;
use Illuminate\Support\Facades\Route;

Route::get('/carreras', [CarreraController::class, 'index']);
Route::get('/carreras/{slug}', [CarreraController::class, 'show']);

Route::get('/noticias', [NoticiaController::class, 'index']);
Route::get('/noticias/{slug}', [NoticiaController::class, 'show']);

Route::get('/ingresantes', [ConvocatoriaIngresoController::class, 'index']);
Route::get('/autoridades', [AutoridadController::class, 'index']);
Route::get('/avisos', [AvisoSitioController::class, 'index'])->name('api.avisos.index');
Route::get('/portada/diapositivas', [DiapositivaPortadaController::class, 'index'])->name('api.portada.diapositivas.index');
Route::get('/permisos-examen/contenido', ConfiguracionPermisoExamenController::class)->name('api.permisos-examen.contenido');

Route::post('/consultas', ConsultaController::class)->middleware('throttle:consultas');
