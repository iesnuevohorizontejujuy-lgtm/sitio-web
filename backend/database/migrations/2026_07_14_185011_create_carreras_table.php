<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('carreras', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('slug')->unique();
            $table->string('nombre_corto')->nullable();
            $table->string('area')->index();
            $table->unsignedTinyInteger('duracion_anios')->default(3);
            $table->string('modalidad')->default('Presencial');
            $table->string('titulo_otorgado')->nullable();
            $table->string('resolucion')->nullable();
            $table->text('descripcion_corta')->nullable();
            $table->longText('descripcion')->nullable();
            $table->longText('perfil_profesional')->nullable();
            $table->json('capacidades')->nullable();
            $table->json('salida_laboral')->nullable();
            $table->string('imagen_portada_path')->nullable();
            $table->string('plan_estudio_path')->nullable();
            $table->string('resolucion_path')->nullable();
            $table->boolean('destacada')->default(false)->index();
            $table->boolean('publicada')->default(false)->index();
            $table->unsignedSmallInteger('orden')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carreras');
    }
};
