<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreConsultaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'carrera_id' => ['nullable', 'integer', Rule::exists('carreras', 'id')->where('publicada', true)],
            'nombre' => ['required', 'string', 'max:120'],
            'telefono' => ['required', 'string', 'max:30', 'regex:/^[0-9+()\s-]{8,30}$/'],
            'email' => ['nullable', 'email:rfc', 'max:255'],
            'asunto' => ['nullable', 'string', 'max:180'],
            'mensaje' => ['required', 'string', 'min:10', 'max:3000'],
            'horario_preferido' => ['nullable', 'string', 'max:120'],
            'pagina_origen' => ['nullable', 'url', 'max:1000'],
            'acepta_contacto' => ['accepted'],
            'website' => ['prohibited'],
        ];
    }

    public function messages(): array
    {
        return [
            'acepta_contacto.accepted' => 'Necesitamos tu autorización para responder la consulta.',
            'telefono.regex' => 'Ingresá un número de teléfono válido.',
            'website.prohibited' => 'No pudimos validar el envío. Recargá la página e intentá nuevamente.',
        ];
    }
}
