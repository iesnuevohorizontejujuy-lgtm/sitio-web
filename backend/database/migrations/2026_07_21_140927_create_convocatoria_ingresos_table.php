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
        Schema::create('convocatoria_ingresos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('ciclo_lectivo', 20);
            $table->string('estado', 30)->default('proximamente');
            $table->text('bajada')->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->json('requisitos')->nullable();
            $table->json('documentos')->nullable();
            $table->json('preguntas_frecuentes')->nullable();
            $table->boolean('esta_publicada')->default(false);
            $table->timestamp('publicada_at')->nullable();
            $table->timestamps();

            $table->index(['esta_publicada', 'publicada_at']);
            $table->index(['estado', 'fecha_inicio']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('convocatoria_ingresos');
    }
};
