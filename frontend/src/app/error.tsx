"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";
import { PageState } from "@/components/institutional/PageState";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageState
      eyebrow="Error inesperado"
      code="500"
      title="No pudimos cargar esta página"
      description="Ocurrió un inconveniente temporal. Podés intentar nuevamente sin perder tu lugar o regresar al inicio del sitio."
      actions={
        <>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 touch-manipulation items-center justify-center gap-2 rounded-lg bg-[#0A496C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#073A57] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/30"
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Intentar nuevamente
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#0A496C] px-6 py-3 text-sm font-semibold text-[#0A496C] transition-colors hover:bg-[#E0ECF8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/30"
          >
            <Home className="size-4" aria-hidden="true" />
            Volver al inicio
          </Link>
        </>
      }
      note={error.digest ? `Referencia del error: ${error.digest}` : undefined}
    />
  );
}
