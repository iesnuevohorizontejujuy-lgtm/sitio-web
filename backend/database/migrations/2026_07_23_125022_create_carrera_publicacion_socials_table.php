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
        Schema::create('carrera_publicaciones_sociales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('carrera_id')->constrained()->cascadeOnDelete();
            $table->string('plataforma', 30)->default('instagram');
            $table->string('tipo_contenido', 30)->default('reel');
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->string('url', 2048);
            $table->string('cuenta', 120)->nullable();
            $table->date('fecha_publicacion')->nullable();
            $table->string('texto_boton', 80)->default('Ver en Instagram');
            $table->string('imagen_previsualizacion_path')->nullable();
            $table->string('imagen_previsualizacion_alt')->nullable();
            $table->boolean('uso_institucional_autorizado')->default(false);
            $table->boolean('publicada')->default(false);
            $table->unsignedSmallInteger('orden')->default(0);
            $table->timestamps();

            $table->index(['carrera_id', 'publicada', 'orden']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carrera_publicaciones_sociales');
    }
};
