"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UnknownRecord = Record<string, unknown>;

type CareerOption = {
  id: number;
  name: string;
};

type SubjectOption = {
  id: number;
  name: string;
  year: number;
  order: string;
};

type SubjectSelection = {
  condition: "REGULAR" | "LIBRE";
  examDate: string;
};

type PersonalData = {
  surname: string;
  names: string;
  dni: string;
  phone: string;
};

const inputClassName =
  "h-11 rounded-lg border-[#CBD5E1] bg-white shadow-none focus-visible:border-[#2CBEE7] focus-visible:ring-[#2CBEE7]/20";

const selectClassName =
  "h-11 w-full rounded-lg border border-[#CBD5E1] bg-white px-3 text-sm text-[#243746] outline-none transition focus:border-[#2CBEE7] focus:ring-3 focus:ring-[#2CBEE7]/20 disabled:cursor-not-allowed disabled:bg-[#F1F5F9] disabled:text-[#94A3B8]";

const unwrapCollection = (payload: unknown): UnknownRecord[] => {
  if (Array.isArray(payload)) return payload.filter((item): item is UnknownRecord => Boolean(item) && typeof item === "object");
  if (payload && typeof payload === "object" && "data" in payload) {
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) return data.filter((item): item is UnknownRecord => Boolean(item) && typeof item === "object");
  }
  return [];
};

const normalizeCareers = (payload: unknown): CareerOption[] =>
  unwrapCollection(payload)
    .map((item) => ({
      id: Number(item.id ?? 0),
      name: String(item.nombre ?? item.title ?? "").trim(),
    }))
    .filter((item) => item.id > 0 && item.name.length > 0);

const normalizeSubjects = (payload: unknown): SubjectOption[] =>
  unwrapCollection(payload)
    .map((item) => ({
      id: Number(item.id ?? 0),
      name: String(item.nombre ?? item.name ?? "").trim(),
      year: Number(item.anio ?? item.year ?? 0),
      order: String(item.num_materia ?? item.orden ?? item.order ?? item.codigo ?? "").trim(),
    }))
    .filter((item) => item.id > 0 && item.name.length > 0)
    .sort((left, right) => left.year - right.year || left.name.localeCompare(right.name, "es"));

const responseMessage = async (response: Response, fallback: string) => {
  const data = (await response.json().catch(() => null)) as UnknownRecord | null;
  return String(data?.message ?? data?.error ?? fallback);
};

export function ExamPermitForm() {
  const searchParams = useSearchParams();
  const returnedPermitId = searchParams.get("ficha_id");
  const returnedFromPayment = searchParams.get("step") === "3" && /^\d+$/.test(returnedPermitId ?? "");

  const [careers, setCareers] = useState<CareerOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [careerId, setCareerId] = useState("");
  const [call, setCall] = useState("1er Llamado");
  const [personalData, setPersonalData] = useState<PersonalData>({
    surname: "",
    names: "",
    dni: "",
    phone: "",
  });
  const [selections, setSelections] = useState<Record<number, SubjectSelection>>({});
  const [accepted, setAccepted] = useState(false);
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [formError, setFormError] = useState("");
  const [permitId, setPermitId] = useState<string | null>(returnedFromPayment ? returnedPermitId : null);

  const selectedSubjects = useMemo(
    () => subjects.filter((subject) => selections[subject.id]),
    [selections, subjects],
  );

  const subjectsByYear = useMemo(() => {
    const groups = new Map<number, SubjectOption[]>();
    subjects.forEach((subject) => {
      const year = subject.year > 0 ? subject.year : 0;
      groups.set(year, [...(groups.get(year) ?? []), subject]);
    });
    return [...groups.entries()];
  }, [subjects]);

  const loadCareers = async () => {
    setLoadingCareers(true);
    setCatalogError("");
    try {
      const response = await fetch("/api/permisos-examen/catalogo", { cache: "no-store" });
      if (!response.ok) throw new Error(await responseMessage(response, "No se pudieron cargar las carreras."));
      setCareers(normalizeCareers(await response.json()));
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : "No se pudieron cargar las carreras.");
    } finally {
      setLoadingCareers(false);
    }
  };

  useEffect(() => {
    void loadCareers();
  }, []);

  useEffect(() => {
    if (!careerId) {
      setSubjects([]);
      setSelections({});
      return;
    }

    const loadSubjects = async () => {
      setLoadingSubjects(true);
      setCatalogError("");
      setSelections({});
      try {
        const response = await fetch(`/api/permisos-examen/catalogo?carrera_id=${careerId}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error(await responseMessage(response, "No se pudieron cargar las materias."));
        setSubjects(normalizeSubjects(await response.json()));
      } catch (error) {
        setSubjects([]);
        setCatalogError(error instanceof Error ? error.message : "No se pudieron cargar las materias.");
      } finally {
        setLoadingSubjects(false);
      }
    };

    void loadSubjects();
  }, [careerId]);

  const toggleSubject = (subjectId: number, checked: boolean) => {
    setFormError("");
    setSelections((current) => {
      if (!checked) {
        const next = { ...current };
        delete next[subjectId];
        return next;
      }
      if (Object.keys(current).length >= 8) {
        setFormError("Podés seleccionar hasta ocho materias por permiso.");
        return current;
      }
      return {
        ...current,
        [subjectId]: { condition: "REGULAR", examDate: "" },
      };
    });
  };

  const updateSelection = (subjectId: number, patch: Partial<SubjectSelection>) => {
    setSelections((current) => ({
      ...current,
      [subjectId]: { ...current[subjectId], ...patch },
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (selectedSubjects.length === 0) {
      setFormError("Seleccioná al menos una materia para continuar.");
      return;
    }
    if (selectedSubjects.some((subject) => !selections[subject.id]?.examDate)) {
      setFormError("Indicá la fecha de examen de cada materia seleccionada.");
      return;
    }
    if (!accepted) {
      setFormError("Tenés que aceptar la declaración antes de continuar.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/permisos-examen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carrera_id: Number(careerId),
          apellido: personalData.surname.trim(),
          nombres: personalData.names.trim(),
          dni: personalData.dni.replace(/\D/g, ""),
          telefono: personalData.phone.trim(),
          fecha: new Date().toISOString().slice(0, 10),
          llamado: call,
          materias: selectedSubjects.map((subject, index) => ({
            materia_id: subject.id,
            num_materia: subject.order || String(index + 1),
            nombre: subject.name,
            anio: subject.year || "",
            condicion: selections[subject.id].condition,
            fecha_examen: selections[subject.id].examDate,
            llamado: call,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(await responseMessage(response, "No pudimos registrar el permiso."));
      }

      const data = (await response.json()) as UnknownRecord;
      const paymentUrl = String(data.init_point ?? "");
      const newPermitId = String(data.ficha_id ?? "");

      if (paymentUrl) {
        window.location.assign(paymentUrl);
        return;
      }

      if (newPermitId) setPermitId(newPermitId);
      else setFormError("El permiso fue recibido, pero no obtuvimos el enlace de pago.");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "No pudimos registrar el permiso.");
    } finally {
      setSubmitting(false);
    }
  };

  if (permitId) {
    return (
      <div className="rounded-2xl border border-[#B9D6C2] bg-[#F3FAF5] p-7 md:p-10">
        <div className="flex size-14 items-center justify-center rounded-full bg-[#DDF2E3] text-[#176B3A]">
          <CheckCircle2 className="size-7" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#176B3A]">Solicitud registrada</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#123A50]">Estamos verificando tu pago</h2>
        <p className="mt-4 max-w-2xl leading-7 text-[#52606D]">
          Mercado Pago notificará al sistema académico. Cuando el pago figure aprobado podrás descargar la ficha y el comprobante.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Button asChild className="h-12 bg-[#0A496C] hover:bg-[#073A57]">
            <a href={`/api/permisos-examen/${permitId}/pdf`}><Download /> Descargar ficha</a>
          </Button>
          <Button asChild variant="outline" className="h-12 border-[#0A496C] text-[#0A496C]">
            <a href={`/api/permisos-examen/${permitId}/comprobante`}><FileText /> Descargar comprobante</a>
          </Button>
        </div>
        <p className="mt-4 text-sm text-[#64748B]">Si el pago todavía está pendiente, esperá unos minutos y volvé a intentar.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-[#D8E1E8] bg-white p-6 md:p-8">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E0ECF8] font-semibold text-[#0A496C]">1</span>
          <div>
            <h2 className="text-xl font-semibold text-[#123A50]">Datos del estudiante</h2>
            <p className="mt-1 text-sm leading-6 text-[#64748B]">Completá los datos tal como figuran en tu documentación académica.</p>
          </div>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="permit-surname">Apellido</Label>
            <Input id="permit-surname" required autoComplete="family-name" className={inputClassName} value={personalData.surname} onChange={(event) => setPersonalData({ ...personalData, surname: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="permit-names">Nombres</Label>
            <Input id="permit-names" required autoComplete="given-name" className={inputClassName} value={personalData.names} onChange={(event) => setPersonalData({ ...personalData, names: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="permit-dni">DNI</Label>
            <Input id="permit-dni" required inputMode="numeric" pattern="[0-9]{7,9}" maxLength={9} placeholder="Sin puntos" className={inputClassName} value={personalData.dni} onChange={(event) => setPersonalData({ ...personalData, dni: event.target.value.replace(/\D/g, "") })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="permit-phone">Teléfono</Label>
            <Input id="permit-phone" required type="tel" autoComplete="tel" className={inputClassName} value={personalData.phone} onChange={(event) => setPersonalData({ ...personalData, phone: event.target.value })} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#D8E1E8] bg-white p-6 md:p-8">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E0ECF8] font-semibold text-[#0A496C]">2</span>
          <div>
            <h2 className="text-xl font-semibold text-[#123A50]">Carrera y llamado</h2>
            <p className="mt-1 text-sm leading-6 text-[#64748B]">La oferta se obtiene directamente del sistema académico.</p>
          </div>
        </div>

        {catalogError && !careerId && (
          <div className="mt-6 flex items-start justify-between gap-4 rounded-xl border border-[#F2C7C7] bg-[#FFF7F7] p-4 text-sm text-[#8B2C2C]">
            <span className="flex gap-2"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {catalogError}</span>
            <button type="button" onClick={() => void loadCareers()} className="flex shrink-0 items-center gap-1 font-semibold"><RefreshCw className="size-4" /> Reintentar</button>
          </div>
        )}

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="permit-career">Carrera</Label>
            <select id="permit-career" required className={selectClassName} value={careerId} disabled={loadingCareers || careers.length === 0} onChange={(event) => setCareerId(event.target.value)}>
              <option value="">{loadingCareers ? "Cargando carreras…" : "Seleccioná tu carrera"}</option>
              {careers.map((career) => <option key={career.id} value={career.id}>{career.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="permit-call">Instancia</Label>
            <select id="permit-call" required className={selectClassName} value={call} onChange={(event) => setCall(event.target.value)}>
              <option value="1er Llamado">Primer llamado</option>
              <option value="2do Llamado">Segundo llamado</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#D8E1E8] bg-white p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E0ECF8] font-semibold text-[#0A496C]">3</span>
            <div>
              <h2 className="text-xl font-semibold text-[#123A50]">Materias a rendir</h2>
              <p className="mt-1 text-sm leading-6 text-[#64748B]">Seleccioná entre una y ocho materias.</p>
            </div>
          </div>
          <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-semibold text-[#52606D]">{selectedSubjects.length}/8</span>
        </div>

        {loadingSubjects && <div className="mt-8 flex items-center justify-center gap-2 py-8 text-sm text-[#64748B]"><Loader2 className="size-4 animate-spin" /> Cargando materias…</div>}
        {!loadingSubjects && careerId && subjects.length === 0 && (
          <div className="mt-7 rounded-xl border border-[#F2D6A2] bg-[#FFF9ED] p-4 text-sm leading-6 text-[#7A5420]">
            {catalogError || "Esta carrera todavía no tiene materias disponibles para el permiso de examen."}
          </div>
        )}
        {!careerId && <div className="mt-7 rounded-xl bg-[#F7FAFC] p-5 text-sm text-[#64748B]">Primero seleccioná una carrera para consultar sus materias.</div>}

        <div className="mt-7 space-y-6">
          {subjectsByYear.map(([year, yearSubjects]) => (
            <div key={year}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">{year > 0 ? `${year}.º año` : "Otros espacios"}</h3>
              <div className="grid gap-2 md:grid-cols-2">
                {yearSubjects.map((subject) => {
                  const checked = Boolean(selections[subject.id]);
                  return (
                    <label key={subject.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${checked ? "border-[#2CBEE7] bg-[#F1FBFE]" : "border-[#D8E1E8] hover:border-[#9ECFE0]"}`}>
                      <Checkbox checked={checked} onCheckedChange={(value) => toggleSubject(subject.id, value === true)} aria-label={`Seleccionar ${subject.name}`} />
                      <span>
                        <span className="block text-sm font-medium leading-5 text-[#243746]">{subject.name}</span>
                        {subject.order && <span className="mt-1 block text-xs text-[#64748B]">Orden {subject.order}</span>}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {selectedSubjects.length > 0 && (
          <div className="mt-8 border-t border-[#E2E8F0] pt-7">
            <h3 className="text-base font-semibold text-[#123A50]">Detalle de las materias seleccionadas</h3>
            <div className="mt-4 space-y-3">
              {selectedSubjects.map((subject) => (
                <div key={subject.id} className="grid gap-4 rounded-xl bg-[#F7FAFC] p-4 md:grid-cols-[1fr_170px_180px] md:items-end">
                  <div>
                    <p className="font-medium text-[#243746]">{subject.name}</p>
                    <p className="mt-1 text-xs text-[#64748B]">{subject.year > 0 ? `${subject.year}.º año` : "Año a confirmar"}</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`condition-${subject.id}`} className="text-xs">Condición</Label>
                    <select id={`condition-${subject.id}`} className={selectClassName} value={selections[subject.id].condition} onChange={(event) => updateSelection(subject.id, { condition: event.target.value as SubjectSelection["condition"] })}>
                      <option value="REGULAR">Regular</option>
                      <option value="LIBRE">Libre</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`date-${subject.id}`} className="text-xs">Fecha del examen</Label>
                    <Input id={`date-${subject.id}`} type="date" required className={inputClassName} value={selections[subject.id].examDate} onChange={(event) => updateSelection(subject.id, { examDate: event.target.value })} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-[#073A57] p-6 text-white md:p-8">
        <div className="flex items-start gap-4">
          <ShieldCheck className="mt-0.5 size-6 shrink-0 text-[#2CBEE7]" />
          <div>
            <h2 className="text-lg font-semibold">Declaración y pago</h2>
            <p className="mt-2 text-sm leading-6 text-white/75">La inscripción queda sujeta al régimen de correlatividades y se confirma cuando Mercado Pago informa la acreditación.</p>
            <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6">
              <Checkbox checked={accepted} onCheckedChange={(value) => setAccepted(value === true)} className="mt-1 border-white/50 data-[state=checked]:border-[#2CBEE7] data-[state=checked]:bg-[#2CBEE7]" />
              <span>Declaro que los datos ingresados son correctos y acepto que el instituto valide las condiciones académicas informadas.</span>
            </label>
          </div>
        </div>
      </section>

      {formError && <div role="alert" className="flex items-start gap-2 rounded-xl border border-[#F2C7C7] bg-[#FFF7F7] p-4 text-sm text-[#8B2C2C]"><AlertCircle className="mt-0.5 size-4 shrink-0" /> {formError}</div>}

      <Button type="submit" disabled={submitting || loadingCareers || loadingSubjects || careers.length === 0 || selectedSubjects.length === 0} className="h-14 w-full rounded-xl bg-[#0A496C] text-base font-semibold hover:bg-[#073A57]">
        {submitting ? <><Loader2 className="animate-spin" /> Registrando permiso…</> : <><CreditCard /> Continuar al pago</>}
      </Button>
      <p className="flex items-center justify-center gap-2 text-center text-xs text-[#64748B]"><CalendarDays className="size-4" /> Verificá las fechas publicadas por el instituto antes de enviar el permiso.</p>
    </form>
  );
}
