import { MessageCircleMore } from "lucide-react";
import { CareerInquiryForm } from "@/components/institutional/CareerInquiryForm";
import type { Career } from "@/types/career";

export function CareerAdmissionSection({ career, shortTitle }: { career: Career; shortTitle: string }) {
  return (
    <section id="inscripcion" aria-labelledby="admission-heading" className="scroll-mt-56 bg-[#073A57] px-5 py-16 text-white lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8CDDF3]">Tu próximo paso</p>
            <h2 id="admission-heading" className="mt-3 text-balance text-4xl font-semibold tracking-[-0.035em] md:text-5xl">Empezá tu camino en {shortTitle}</h2>
            <p className="mt-5 max-w-xl text-pretty leading-7 text-white/75">Dejanos tus datos y el equipo del instituto te contactará por WhatsApp para orientarte con la inscripción y responder tus consultas.</p>

            <div className="mt-9 border-t border-white/20 pt-7">
              <MessageCircleMore className="size-7 text-[#8CDDF3]" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold">Una consulta específica</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">El mensaje quedará asociado automáticamente a {career.title} para que el equipo pueda darte una respuesta precisa.</p>
            </div>
          </div>

          <div id="formulario-inscripcion" className="scroll-mt-56 rounded-2xl bg-white p-6 text-[#121C28] sm:p-9 lg:col-span-7">
            <h3 className="text-2xl font-semibold text-[#0A496C]">Quiero recibir información</h3>
            <p className="mt-2 text-sm leading-6 text-[#52606D]">Completá el formulario y nos comunicaremos con vos.</p>
            <div className="mt-7">
              <CareerInquiryForm careerId={career.id} careerTitle={career.title} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CareerMobileAdmissionBar({ shortTitle }: { shortTitle: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#C6D7E5] bg-white/96 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(3,29,44,0.14)] backdrop-blur md:hidden">
      <a href="#inscripcion" className="flex min-h-12 items-center justify-center rounded-lg bg-[#0A496C] px-5 py-3 text-center text-sm font-semibold text-white">
        Inscribirme en {shortTitle}
      </a>
    </div>
  );
}
