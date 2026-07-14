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
        Schema::create('consultas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('carrera_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nombre');
            $table->string('telefono');
            $table->string('email')->nullable();
            $table->string('asunto')->nullable();
            $table->text('mensaje');
            $table->string('horario_preferido')->nullable();
            $table->text('pagina_origen')->nullable();
            $table->string('estado')->default('nueva')->index();
            $table->text('notas_internas')->nullable();
            $table->timestamp('respondida_at')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultas');
    }
};
