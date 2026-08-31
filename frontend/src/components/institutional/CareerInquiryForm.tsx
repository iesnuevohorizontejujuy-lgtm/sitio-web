"use client";

import { type FormEvent, useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { InstitutionalFeedbackError, InstitutionalFeedbackSuccess } from "@/components/institutional/InstitutionalFeedback";
import { publicFetch } from "@/lib/public-api";

interface CareerInquiryFormProps {
  careerId: number | null;
  careerTitle: string;
}

const fieldClassName = "min-h-12 rounded-lg border border-[#AFC4D8] bg-[#F7FAFC] px-4 font-normal text-[#121C28] outline-none transition-colors placeholder:text-[#7A8794] focus:border-[#0A496C] focus:bg-white focus:ring-4 focus:ring-[#2CBEE7]/20";

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
      const response = await publicFetch("/consultas", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          carrera_id: careerId,
          asunto: `Consulta sobre ${careerTitle}`,
          pagina_origen: window.location.href,
          acepta_contacto: data.acepta_contacto === "on",
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { message?: string; errors?: Record<string, string[]> };

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
    return (
      <InstitutionalFeedbackSuccess eyebrow="Mensaje enviado" title="Consulta recibida" description={message}>
        <button type="button" onClick={() => setStatus("idle")} className="min-h-11 rounded-lg border border-[#0A496C] px-5 py-2.5 text-sm font-semibold text-[#0A496C] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/30">
          Enviar otra consulta
        </button>
      </InstitutionalFeedbackSuccess>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2" aria-busy={status === "sending"}>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label htmlFor="inquiry-name" className="grid gap-2 text-sm font-semibold text-[#0A496C]"><span>Nombre y apellido</span><input id="inquiry-name" name="nombre" required maxLength={120} autoComplete="name" className={fieldClassName} /></label>
      <label htmlFor="inquiry-phone" className="grid gap-2 text-sm font-semibold text-[#0A496C]"><span>WhatsApp</span><input id="inquiry-phone" name="telefono" required type="tel" inputMode="tel" autoComplete="tel" maxLength={30} placeholder="+54 9 388…" className={fieldClassName} /></label>
      <label htmlFor="inquiry-email" className="grid gap-2 text-sm font-semibold text-[#0A496C] sm:col-span-2"><span>Correo electrónico <span className="font-normal text-[#64748B]">(opcional)</span></span><input id="inquiry-email" name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} maxLength={255} className={fieldClassName} /></label>
      <label htmlFor="inquiry-message" className="grid gap-2 text-sm font-semibold text-[#0A496C] sm:col-span-2"><span>¿En qué podemos ayudarte?</span><textarea id="inquiry-message" name="mensaje" required minLength={10} maxLength={3000} rows={5} className={`${fieldClassName} py-3`} /></label>
      <label htmlFor="inquiry-consent" className="flex min-h-11 cursor-pointer items-start gap-3 text-sm leading-6 text-[#52606D] sm:col-span-2"><input id="inquiry-consent" name="acepta_contacto" type="checkbox" required className="mt-1 size-5 shrink-0 accent-[#0A496C]" />Autorizo al IES Nuevo Horizonte a contactarme por WhatsApp o correo para responder esta consulta.</label>
      {status === "error" ? <InstitutionalFeedbackError className="sm:col-span-2" title="No pudimos enviar la consulta" description={message} /> : null}
      <button type="submit" disabled={status === "sending"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0A496C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#073A57] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/35 disabled:cursor-wait disabled:opacity-70 sm:col-span-2 sm:justify-self-start">
        {status === "sending" ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
        {status === "sending" ? "Enviando…" : "Enviar consulta"}
      </button>
    </form>
  );
}
