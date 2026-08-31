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
        Schema::create('diapositiva_portadas', function (Blueprint $table) {
            $table->id();
            $table->string('etiqueta');
            $table->string('titulo');
            $table->text('bajada');
            $table->string('imagen_escritorio_path');
            $table->string('imagen_movil_path')->nullable();
            $table->string('imagen_alt');
            $table->string('texto_boton', 80);
            $table->string('url_boton', 1000);
            $table->string('texto_boton_secundario', 80)->nullable();
            $table->string('url_boton_secundario', 1000)->nullable();
            $table->unsignedSmallInteger('orden')->default(0)->index();
            $table->boolean('publicada')->default(false)->index();
            $table->timestamp('inicia_at')->nullable()->index();
            $table->timestamp('finaliza_at')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diapositiva_portadas');
    }
};
