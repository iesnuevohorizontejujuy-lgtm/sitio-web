"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

interface CareerInquiryFormProps {
  careerId: number | null;
  careerTitle: string;
}

export function CareerInquiryForm({ careerId, careerTitle }: CareerInquiryFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch(`${API_BASE_URL}/consultas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          carrera_id: careerId,
          asunto: `Consulta sobre ${careerTitle}`,
          pagina_origen: window.location.href,
          acepta_contacto: data.acepta_contacto === "on",
        }),
      });
      const payload = (await response.json()) as { message?: string; errors?: Record<string, string[]> };

      if (!response.ok) {
        throw new Error(payload.errors ? Object.values(payload.errors)[0]?.[0] : payload.message);
      }

      setStatus("success");
      setMessage(payload.message || "Recibimos tu consulta.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error && error.message ? error.message : "No pudimos enviar la consulta. Intentá nuevamente.");
    }
  }

  if (status === "success") {
    return <div className="rounded-xl border border-[#9DD7C0] bg-[#F0FBF6] p-8 text-center"><CheckCircle2 className="mx-auto size-11 text-[#18794E]" /><h3 className="mt-4 text-2xl font-semibold text-[#0A496C]">Consulta recibida</h3><p className="mt-3 text-[#52606D]">{message}</p><button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm font-semibold text-[#0A496C] underline">Enviar otra consulta</button></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="grid gap-2 text-sm font-semibold text-[#0A496C]">Nombre y apellido<input name="nombre" required maxLength={120} className="min-h-12 rounded-lg border border-[#AFC4D8] bg-white px-4 font-normal text-[#121C28] outline-none focus:border-[#0A496C] focus:ring-2 focus:ring-[#2CBEE7]/30" /></label>
      <label className="grid gap-2 text-sm font-semibold text-[#0A496C]">WhatsApp<input name="telefono" required type="tel" maxLength={30} placeholder="+54 9 388..." className="min-h-12 rounded-lg border border-[#AFC4D8] bg-white px-4 font-normal text-[#121C28] outline-none focus:border-[#0A496C] focus:ring-2 focus:ring-[#2CBEE7]/30" /></label>
      <label className="grid gap-2 text-sm font-semibold text-[#0A496C]">Correo electrónico <span className="font-normal text-[#64748B]">(opcional)</span><input name="email" type="email" maxLength={255} className="min-h-12 rounded-lg border border-[#AFC4D8] bg-white px-4 font-normal text-[#121C28] outline-none focus:border-[#0A496C] focus:ring-2 focus:ring-[#2CBEE7]/30" /></label>
      <label className="grid gap-2 text-sm font-semibold text-[#0A496C]">Horario preferido <span className="font-normal text-[#64748B]">(opcional)</span><input name="horario_preferido" maxLength={120} placeholder="Por ejemplo: de 16 a 20 h" className="min-h-12 rounded-lg border border-[#AFC4D8] bg-white px-4 font-normal text-[#121C28] outline-none focus:border-[#0A496C] focus:ring-2 focus:ring-[#2CBEE7]/30" /></label>
      <label className="grid gap-2 text-sm font-semibold text-[#0A496C] sm:col-span-2">¿En qué podemos ayudarte?<textarea name="mensaje" required minLength={10} maxLength={3000} rows={5} className="rounded-lg border border-[#AFC4D8] bg-white px-4 py-3 font-normal text-[#121C28] outline-none focus:border-[#0A496C] focus:ring-2 focus:ring-[#2CBEE7]/30" /></label>
      <label className="flex items-start gap-3 text-sm leading-6 text-[#52606D] sm:col-span-2"><input name="acepta_contacto" type="checkbox" required className="mt-1 size-4 accent-[#0A496C]" />Autorizo al IES Nuevo Horizonte a contactarme por WhatsApp o correo para responder esta consulta.</label>
      {status === "error" && <p role="alert" className="text-sm font-semibold text-red-700 sm:col-span-2">{message}</p>}
      <button type="submit" disabled={status === "sending"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0A496C] px-6 py-3 text-sm font-semibold text-white hover:bg-[#073A57] disabled:cursor-wait disabled:opacity-70 sm:col-span-2 sm:justify-self-start">{status === "sending" && <LoaderCircle className="size-4 animate-spin" />}{status === "sending" ? "Enviando..." : "Enviar consulta"}</button>
    </form>
  );
}
