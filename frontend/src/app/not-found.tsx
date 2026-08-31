import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { PageState } from "@/components/institutional/PageState";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <PageState
      eyebrow="Página no encontrada"
      code="404"
      title="No encontramos la página que buscabas"
      description="Es posible que el contenido haya cambiado de dirección o que el enlace esté incompleto. Podés volver al inicio o continuar explorando nuestra oferta académica."
      actions={
        <>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0A496C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#073A57] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/30"
          >
            <Home className="size-4" aria-hidden="true" />
            Volver al inicio
          </Link>
          <Link
            href="/carreras"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#0A496C] px-6 py-3 text-sm font-semibold text-[#0A496C] transition-colors hover:bg-[#E0ECF8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/30"
          >
            Ver carreras
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </>
      }
      note="Si llegaste desde un enlace del sitio, podés avisarnos desde la sección Contacto para que lo revisemos."
    />
  );
}
