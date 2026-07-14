<?php

use App\Http\Controllers\Api\CarreraController;
use App\Http\Controllers\Api\ConsultaController;
use App\Http\Controllers\Api\NoticiaController;
use Illuminate\Support\Facades\Route;

Route::get('/carreras', [CarreraController::class, 'index']);
Route::get('/carreras/{slug}', [CarreraController::class, 'show']);

Route::get('/noticias', [NoticiaController::class, 'index']);
Route::get('/noticias/{slug}', [NoticiaController::class, 'show']);

Route::post('/consultas', ConsultaController::class)->middleware('throttle:consultas');
