"use client";

import { type FormEvent, useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Barcode as BarcodeIcon,
  CalendarDays,
  Download,
  FileCheck2,
  FileText,
  Hash,
  Inbox,
  Loader2,
  MapPin,
  Search,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Barcode from "react-barcode";
import { InstitutionalFeedbackError } from "@/components/institutional/InstitutionalFeedback";
import { InstitutionalPageMasthead } from "@/components/institutional/InstitutionalPageMasthead";
import { InstitutionalPageNav } from "@/components/institutional/InstitutionalPageNav";
import { InstitutionalSectionHeading } from "@/components/institutional/InstitutionalSectionHeading";
import { publicFetch } from "@/lib/public-api";

type ExpedienteMovement = {
  fojas?: string | number | null;
  fecha?: string | null;
  hora?: string | null;
  origen?: string | null;
  destino?: string | null;
  enviado_por?: string | null;
  recibido_por?: string | null;
  observaciones?: string | null;
};

type Expediente = {
  codigo: string;
  cantidad_fojas: string | number;
  asunto: string;
  iniciado_por: string;
  fecha_inicio: string;
  estado: string;
  archivo_digital_url?: string | null;
  historial?: ExpedienteMovement[];
};

type NHDocsClientProps = {
  initialCode: string;
  siteUrl: string;
};

const querySteps = [
  {
    icon: Hash,
    title: "Ingresá el código",
    description: "Escribilo tal como aparece en la constancia de inicio del trámite.",
  },
  {
    icon: FileCheck2,
    title: "Verificá los datos",
    description: "Consultá el asunto, la fecha de creación y el estado administrativo.",
  },
  {
    icon: ShieldCheck,
    title: "Seguí los movimientos",
    description: "Revisá las dependencias y responsables que intervinieron en el expediente.",
  },
] as const;

export function NHDocsClient({ initialCode, siteUrl }: NHDocsClientProps) {
  const normalizedInitialCode = initialCode.trim().toUpperCase();
  const [code, setCode] = useState(normalizedInitialCode);
  const [result, setResult] = useState<Expediente | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchExpediente = useCallback(async (requestedCode: string) => {
    const normalizedCode = requestedCode.trim().toUpperCase();
    if (!normalizedCode) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await publicFetch(`/expediente/${encodeURIComponent(normalizedCode)}`);
      if (!response.ok) throw new Error("Expediente no encontrado");
      setResult((await response.json()) as Expediente);
    } catch {
      setError("No encontramos un expediente con ese código. Revisá que esté escrito correctamente e intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (normalizedInitialCode) void searchExpediente(normalizedInitialCode);
  }, [normalizedInitialCode, searchExpediente]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void searchExpediente(code);
  }

  const validationUrl = result
    ? `${siteUrl.replace(/\/$/, "")}/nhdocs?codigo=${encodeURIComponent(result.codigo)}`
    : "";
  const movements = result?.historial ?? [];

  return (
    <main className="institutional-shell text-[#121C28]">
      <InstitutionalPageMasthead
        eyebrow="Gestión documental"
        title="Consultá el estado de tu expediente"
        description="Accedé a la información pública del trámite, verificá su estado actual y conocé sus movimientos administrativos."
      >
        <aside className="border-l-4 border-[#2CBEE7] bg-white p-5">
          <div className="flex items-center gap-3"><FileText className="size-6 text-[#0A6F94]" aria-hidden="true" /><h2 className="font-semibold text-[#0A496C]">¿Dónde encuentro el código?</h2></div>
          <p className="mt-3 text-sm leading-6 text-[#52606D]">Está indicado en la constancia entregada por Mesa de Entradas. Puede contener números, letras y guiones bajos.</p>
        </aside>
      </InstitutionalPageMasthead>

      <InstitutionalPageNav items={[{ href: "#consulta", label: "Consultar expediente" }, result ? { href: "#resultado", label: "Resultado" } : { href: "#como-funciona", label: "Cómo funciona" }]} />

      <section id="consulta" className="institutional-surface-brand border-b border-[#C6D7E5]">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#B7CADB] bg-white p-6 md:p-9" aria-label="Consulta pública de expedientes">
            <div className="grid items-end gap-4 md:grid-cols-[1fr_auto]">
              <div>
                <label htmlFor="expediente-code" className="text-sm font-semibold text-[#0A496C]">
                  Código del expediente
                </label>
                <div className="relative mt-2">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#64748B]" aria-hidden="true" />
                  <input
                    id="expediente-code"
                    name="codigo"
                    type="text"
                    required
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    placeholder="Por ejemplo: 0001_REC_26…"
                    value={code}
                    onChange={(event) => setCode(event.target.value.toUpperCase())}
                    className="min-h-14 w-full rounded-lg border border-[#9EB6C9] bg-[#F7FAFC] py-3 pl-12 pr-4 font-mono text-base font-semibold uppercase text-[#121C28] placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:text-[#7A8794] focus:border-[#0A496C] focus:outline-none focus:ring-4 focus:ring-[#2CBEE7]/25"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-14 touch-manipulation items-center justify-center gap-2 rounded-lg bg-[#0A496C] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#073A57] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/35 disabled:cursor-wait disabled:opacity-65"
              >
                {loading ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Search className="size-5" aria-hidden="true" />}
                {loading ? "Consultando…" : "Consultar expediente"}
              </button>
            </div>
            {error ? (
              <InstitutionalFeedbackError className="mt-5" title="No encontramos el expediente" description={error} />
            ) : null}
          </form>
        </div>
      </section>

      {result ? (
        <ExpedienteResult result={result} movements={movements} validationUrl={validationUrl} />
      ) : (
        <section id="como-funciona" className="institutional-surface-muted py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <InstitutionalSectionHeading
              eyebrow="Cómo funciona"
              title="Una consulta simple y verificable"
              description="Usá el código de tu constancia para acceder a la información pública y seguir el recorrido administrativo."
            />
            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[#CBD5E1] bg-[#CBD5E1] md:grid-cols-3">
              {querySteps.map(({ icon: Icon, title, description }, index) => (
                <article key={title} className="bg-white p-7 md:p-8">
                  <div className="flex items-center justify-between">
                    <Icon className="size-7 text-[#0A496C]" aria-hidden="true" />
                    <span className="font-mono text-sm text-[#7A8794]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-7 text-xl font-semibold text-[#0A496C]">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#52606D]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

type ExpedienteResultProps = {
  result: Expediente;
  movements: ExpedienteMovement[];
  validationUrl: string;
};

function ExpedienteResult({ result, movements, validationUrl }: ExpedienteResultProps) {
  return (
    <div id="resultado" aria-live="polite">
      <section className="institutional-surface-muted border-b border-[#D8E1E8] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">Expediente localizado</p>
              <h2 className="mt-3 font-mono text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">{result.codigo}</h2>
            </div>
            <span className="inline-flex w-fit rounded-lg bg-[#0A496C] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
              {result.estado}
            </span>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-12">
            <article className="rounded-2xl border border-[#CBD5E1] bg-white p-7 lg:col-span-8 md:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">Asunto del trámite</p>
              <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#0A496C]">{result.asunto}</h3>
              <dl className="mt-8 grid gap-6 border-t border-[#D8E1E8] pt-7 sm:grid-cols-3">
                <DetailItem icon={UserRound} label="Titular o iniciador" value={result.iniciado_por} />
                <DetailItem icon={CalendarDays} label="Fecha de creación" value={result.fecha_inicio} />
                <DetailItem icon={FileText} label="Documentación" value={`${result.cantidad_fojas} fojas`} />
              </dl>
              {result.archivo_digital_url ? (
                <a
                  href={result.archivo_digital_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#0A496C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#073A57] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2CBEE7]/35"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Ver documento digital
                </a>
              ) : null}
            </article>

            <aside className="grid gap-5 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
              <div className="flex items-center justify-between rounded-2xl border border-[#B7CADB] bg-white p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">Validación QR</p>
                  <p className="mt-2 text-sm text-[#52606D]">Acceso directo a esta consulta</p>
                </div>
                <div className="rounded-lg border border-[#D8E1E8] bg-white p-2">
                  <QRCodeSVG value={validationUrl} size={72} bgColor="#ffffff" fgColor="#0A496C" />
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl bg-[#0A496C] p-6 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#9CE5F8]">
                  <BarcodeIcon className="size-4" aria-hidden="true" /> Código de barras
                </div>
                <div className="mt-5 overflow-hidden rounded-lg bg-white px-3 py-2">
                  <Barcode value={result.codigo} width={1.35} height={42} displayValue={false} margin={0} background="#ffffff" lineColor="#0A496C" />
                </div>
                <p className="mt-3 break-all font-mono text-sm font-semibold">{result.codigo}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="institutional-surface-canvas py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">Trazabilidad</p>
          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.025em] text-[#0A496C]">Historial de movimientos</h2>
              <p className="mt-3 max-w-2xl leading-7 text-[#52606D]">Dependencias, responsables y observaciones registradas durante el trámite.</p>
            </div>
            <span className="text-sm font-semibold text-[#64748B]">{movements.length} {movements.length === 1 ? "movimiento" : "movimientos"}</span>
          </div>

          {movements.length > 0 ? (
            <ol className="mt-10 space-y-5">
              {movements.map((movement, index) => (
                <MovementItem key={`${movement.fecha ?? "sin-fecha"}-${movement.hora ?? "sin-hora"}-${index}`} movement={movement} index={index} />
              ))}
            </ol>
          ) : (
            <div className="mt-10 border-l-4 border-[#2CBEE7] bg-white p-7">
              <Inbox className="size-7 text-[#0A496C]" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-[#0A496C]">Todavía no hay movimientos registrados</h3>
              <p className="mt-2 text-sm leading-6 text-[#52606D]">El expediente se encuentra en su dependencia de origen.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

type DetailItemProps = {
  icon: typeof UserRound;
  label: string;
  value: string;
};

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">
        <Icon className="size-4 text-[#0A496C]" aria-hidden="true" /> {label}
      </dt>
      <dd className="mt-2 text-sm font-semibold leading-6 text-[#121C28]">{value}</dd>
    </div>
  );
}

type MovementItemProps = {
  movement: ExpedienteMovement;
  index: number;
};

function MovementItem({ movement, index }: MovementItemProps) {
  return (
    <li className="grid overflow-hidden rounded-2xl border border-[#CBD5E1] bg-white md:grid-cols-[170px_1fr]">
      <div className="bg-[#E0ECF8] p-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#0A496C]">Movimiento {String(index + 1).padStart(2, "0")}</p>
        <p className="mt-4 font-semibold text-[#0A496C]">{movement.fecha || "Fecha no informada"}</p>
        {movement.hora ? <p className="mt-1 font-mono text-sm text-[#52606D]">{movement.hora}</p> : null}
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Fojas</p>
        <p className="mt-1 text-lg font-semibold text-[#0A496C]">{movement.fojas || "—"}</p>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Origen</p>
            <p className="mt-2 font-semibold text-[#121C28]">{movement.origen || "Sin información"}</p>
          </div>
          <ArrowRight className="size-5 rotate-90 text-[#2CBEE7] sm:rotate-0" aria-hidden="true" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]">Destino</p>
            <p className="mt-2 font-semibold text-[#0A496C]">{movement.destino || "Sin información"}</p>
          </div>
        </div>

        <dl className="mt-7 grid gap-5 border-t border-[#D8E1E8] pt-6 sm:grid-cols-2">
          <div>
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]"><Send className="size-4" aria-hidden="true" /> Entregó</dt>
            <dd className="mt-2 text-sm font-medium text-[#334155]">{movement.enviado_por || "No informado"}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#64748B]"><MapPin className="size-4" aria-hidden="true" /> Recibió</dt>
            <dd className="mt-2 text-sm font-medium text-[#334155]">{movement.recibido_por || "No informado"}</dd>
          </div>
        </dl>

        {movement.observaciones ? (
          <p className="mt-6 border-l-4 border-[#2CBEE7] bg-[#F4F7F9] p-4 text-sm leading-6 text-[#52606D]">{movement.observaciones}</p>
        ) : null}
      </div>
    </li>
  );
}
