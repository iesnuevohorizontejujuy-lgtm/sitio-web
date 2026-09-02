"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  CalendarDays,
  CreditCard,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InstitutionalFeedbackError,
  InstitutionalFeedbackLoading,
  InstitutionalFeedbackNotice,
  InstitutionalFeedbackPending,
  InstitutionalFeedbackSuccess,
} from "@/components/institutional/InstitutionalFeedback";

type UnknownRecord = Record<string, unknown>;

type CareerOption = {
  id: number;
  name: string;
  allowsManualSubjects: boolean;
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

type ManualSubjectSelection = SubjectSelection & {
  id: number;
  name: string;
  year: string;
};

type PersonalData = {
  surname: string;
  names: string;
  dni: string;
  phone: string;
};

type PaymentStatus = string | null;

type CallOption = {
  value: "1er Llamado" | "2do Llamado";
  label: string;
};

type ShiftOption = {
  value: string;
  label: string;
};

type ExamPermitPayload = {
  carrera_id: number;
  turno: string;
  apellido: string;
  nombres: string;
  dni: string;
  telefono: string;
  fecha: string;
  llamado: string;
  materias: Array<Record<string, string | number>>;
};

type ReviewSubject = {
  name: string;
  condition: SubjectSelection["condition"];
  examDate: string;
};

type ExamPermitConfiguration = {
  isOpen: boolean;
  state: string;
  name: string;
  startsAt: string | null;
  endsAt: string | null;
  durationDays: number | null;
  amount: number | null;
  currencyId: string;
  calls: CallOption[];
  message: string;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const failedPaymentStatuses = new Set([
  "rejected",
  "cancelled",
  "refunded",
  "charged_back",
  "payment_error",
  "payment_mismatch",
]);

const normalizeConfiguration = (payload: UnknownRecord): ExamPermitConfiguration => ({
  isOpen: payload.is_open === true,
  state: String(payload.state ?? "disabled"),
  name: String(payload.name ?? "Inscripción a permisos de examen"),
  startsAt: payload.starts_at ? String(payload.starts_at) : null,
  endsAt: payload.ends_at ? String(payload.ends_at) : null,
  durationDays: payload.duration_days ? Number(payload.duration_days) : null,
  amount: payload.amount !== undefined ? Number(payload.amount) : null,
  currencyId: String(payload.currency_id ?? "ARS"),
  calls: Array.isArray(payload.calls)
    ? payload.calls
        .filter((item): item is UnknownRecord => Boolean(item) && typeof item === "object")
        .map((item) => ({
          value: String(item.value) as CallOption["value"],
          label: String(item.label ?? item.value),
        }))
        .filter((item) => item.value === "1er Llamado" || item.value === "2do Llamado")
    : [],
  message: String(payload.message ?? ""),
});

const formatDateTime = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("es-AR", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(value))
    : "A confirmar";

const formatAmount = (amount: number | null, currencyId: string) =>
  amount === null
    ? "A confirmar"
    : new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: currencyId,
        minimumFractionDigits: 0,
      }).format(amount);

const formatDni = (value: string) => value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const formatExamDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(new Date(year, month - 1, day));
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
      allowsManualSubjects: item.permite_materias_manuales === true,
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

const normalizeShifts = (payload: unknown): ShiftOption[] => {
  if (!payload || typeof payload !== "object" || !("turnos" in payload)) return [];
  const shifts = (payload as { turnos?: unknown }).turnos;
  if (!Array.isArray(shifts)) return [];

  return shifts
    .filter((item): item is UnknownRecord => Boolean(item) && typeof item === "object")
    .map((item) => ({
      value: String(item.value ?? "").trim(),
      label: String(item.label ?? item.value ?? "").trim(),
    }))
    .filter((item) => item.value.length > 0 && item.label.length > 0);
};

const responseMessage = async (response: Response, fallback: string) => {
  const data = (await response.json().catch(() => null)) as UnknownRecord | null;
  return String(data?.message ?? data?.error ?? fallback);
};

const previewCareers: CareerOption[] = [
  { id: 1, name: "Tecnicatura Superior en Enfermería", allowsManualSubjects: false },
  { id: 2, name: "Tecnicatura Superior en Desarrollo de Software", allowsManualSubjects: false },
];

const previewSubjects: SubjectOption[] = [
  { id: 101, name: "Enfermería del Adulto", year: 2, order: "12" },
  { id: 102, name: "Enfermería Materno Infantil", year: 2, order: "14" },
  { id: 103, name: "Práctica Profesionalizante II", year: 2, order: "18" },
];

const previewShifts: ShiftOption[] = [
  { value: "Tarde", label: "Turno tarde" },
  { value: "Noche", label: "Turno noche" },
];

const previewConfiguration: ExamPermitConfiguration = {
  isOpen: true,
  state: "open",
  name: "Mesa de examen · Vista previa",
  startsAt: "2026-08-25T08:00:00-03:00",
  endsAt: "2026-09-05T23:59:00-03:00",
  durationDays: 12,
  amount: 12000,
  currencyId: "ARS",
  calls: [
    { value: "1er Llamado", label: "1.er llamado" },
    { value: "2do Llamado", label: "2.º llamado" },
  ],
  message: "Inscripciones habilitadas para esta demostración.",
};

export function ExamPermitForm({ hasEditorialContent = false }: { hasEditorialContent?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const previewMode = process.env.NODE_ENV !== "production" && searchParams.get("preview") === "1";
  const returnedPermitToken = searchParams.get("permit");
  const returnedFromPayment = uuidPattern.test(returnedPermitToken ?? "");

  const [careers, setCareers] = useState<CareerOption[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [shifts, setShifts] = useState<ShiftOption[]>([]);
  const [careerId, setCareerId] = useState("");
  const [shift, setShift] = useState("");
  const [call, setCall] = useState("");
  const [personalData, setPersonalData] = useState<PersonalData>({
    surname: "",
    names: "",
    dni: "",
    phone: "",
  });
  const [selections, setSelections] = useState<Record<number, SubjectSelection>>({});
  const [manualSubjects, setManualSubjects] = useState<ManualSubjectSelection[]>([]);
  const [accepted, setAccepted] = useState(false);
  const [loadingConfiguration, setLoadingConfiguration] = useState(true);
  const [configuration, setConfiguration] = useState<ExamPermitConfiguration | null>(null);
  const [configurationError, setConfigurationError] = useState("");
  const [loadingCareers, setLoadingCareers] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [formError, setFormError] = useState("");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<ExamPermitPayload | null>(null);
  const [permitToken, setPermitToken] = useState<string | null>(returnedFromPayment ? returnedPermitToken : null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(returnedFromPayment ? "checking" : null);
  const [statusError, setStatusError] = useState("");

  const selectedSubjects = useMemo(
    () => subjects.filter((subject) => selections[subject.id]),
    [selections, subjects],
  );
  const selectedCareer = useMemo(
    () => careers.find((career) => String(career.id) === careerId) ?? null,
    [careerId, careers],
  );
  const usesManualSubjects = selectedCareer?.allowsManualSubjects === true;
  const subjectCount = usesManualSubjects ? manualSubjects.length : selectedSubjects.length;
  const selectedShiftLabel = shifts.find((option) => option.value === shift)?.label ?? shift;
  const selectedCallLabel = configuration?.calls.find((option) => option.value === call)?.label ?? call;
  const reviewSubjects = useMemo<ReviewSubject[]>(
    () => usesManualSubjects
      ? manualSubjects.map((subject) => ({ name: subject.name.trim(), condition: subject.condition, examDate: subject.examDate }))
      : selectedSubjects.map((subject) => ({ name: subject.name, condition: selections[subject.id].condition, examDate: selections[subject.id].examDate })),
    [manualSubjects, selectedSubjects, selections, usesManualSubjects],
  );

  const subjectsByYear = useMemo(() => {
    const groups = new Map<number, SubjectOption[]>();
    subjects.forEach((subject) => {
      const year = subject.year > 0 ? subject.year : 0;
      groups.set(year, [...(groups.get(year) ?? []), subject]);
    });
    return [...groups.entries()];
  }, [subjects]);

  const loadCareers = useCallback(async () => {
    setLoadingCareers(true);
    setCatalogError("");
    try {
      if (previewMode) {
        setCareers(previewCareers);
        return;
      }
      const response = await fetch("/api/permisos-examen/catalogo", { cache: "no-store" });
      if (!response.ok) throw new Error(await responseMessage(response, "No se pudieron cargar las carreras."));
      setCareers(normalizeCareers(await response.json()));
    } catch (error) {
      setCatalogError(error instanceof Error ? error.message : "No se pudieron cargar las carreras.");
    } finally {
      setLoadingCareers(false);
    }
  }, [previewMode]);

  useEffect(() => {
    const loadConfiguration = async () => {
      setLoadingConfiguration(true);
      setConfigurationError("");

      try {
        if (previewMode) {
          setConfiguration(previewConfiguration);
          setCall(previewConfiguration.calls[0]?.value ?? "");
          return;
        }
        const response = await fetch("/api/permisos-examen/configuracion", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(await responseMessage(response, "No pudimos consultar la convocatoria."));
        }

        const nextConfiguration = normalizeConfiguration((await response.json()) as UnknownRecord);
        setConfiguration(nextConfiguration);
        setCall(nextConfiguration.calls[0]?.value ?? "");
      } catch (error) {
        setConfigurationError(error instanceof Error ? error.message : "No pudimos consultar la convocatoria.");
      } finally {
        setLoadingConfiguration(false);
      }
    };

    void loadConfiguration();
  }, [previewMode]);

  useEffect(() => {
    if (configuration?.isOpen) {
      void loadCareers();
    }
  }, [configuration?.isOpen, loadCareers]);

  useEffect(() => {
    if (!permitToken) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const pollPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/permisos-examen/${permitToken}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(await responseMessage(response, "No pudimos consultar el estado del pago."));
        }

        const data = (await response.json()) as UnknownRecord;
        const status = String(data.payment_status ?? "pending");

        if (cancelled) return;
        setPaymentStatus(status);
        setStatusError("");

        if (status !== "approved" && !failedPaymentStatuses.has(status)) {
          timer = setTimeout(pollPaymentStatus, 2500);
        }
      } catch (error) {
        if (cancelled) return;
        setStatusError(error instanceof Error ? error.message : "No pudimos consultar el estado del pago.");
        timer = setTimeout(pollPaymentStatus, 5000);
      }
    };

    void pollPaymentStatus();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [permitToken]);

  useEffect(() => {
    if (!careerId) {
      setSubjects([]);
      setShifts([]);
      setShift("");
      setSelections({});
      setManualSubjects([]);
      return;
    }

    setSubjects([]);
    setSelections({});
    setShifts([]);
    setShift("");

    if (usesManualSubjects) {
      setManualSubjects([{ id: Date.now(), name: "", year: "", condition: "REGULAR", examDate: "" }]);
    } else {
      setManualSubjects([]);
    }

    const loadSubjects = async () => {
      setLoadingSubjects(true);
      setCatalogError("");
      setSelections({});
      try {
        if (previewMode) {
          setSubjects(usesManualSubjects ? [] : previewSubjects);
          setShifts(previewShifts);
          setShift("");
          return;
        }
        const response = await fetch(`/api/permisos-examen/catalogo?carrera_id=${careerId}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error(await responseMessage(response, "No se pudieron cargar las materias."));
        const payload = await response.json();
        const nextShifts = normalizeShifts(payload);
        setSubjects(usesManualSubjects ? [] : normalizeSubjects(payload));
        setShifts(nextShifts);
        setShift("");
      } catch (error) {
        setSubjects([]);
        setShifts([]);
        setShift("");
        setCatalogError(error instanceof Error ? error.message : "No se pudieron cargar las materias.");
      } finally {
        setLoadingSubjects(false);
      }
    };

    void loadSubjects();
  }, [careerId, previewMode, usesManualSubjects]);

  const addManualSubject = () => {
    if (manualSubjects.length >= 8) {
      setFormError("Podés cargar hasta ocho espacios curriculares por permiso.");
      return;
    }
    setManualSubjects((current) => [...current, { id: Date.now(), name: "", year: "", condition: "REGULAR", examDate: "" }]);
  };

  const updateManualSubject = (id: number, patch: Partial<ManualSubjectSelection>) => {
    setManualSubjects((current) => current.map((subject) => subject.id === id ? { ...subject, ...patch } : subject));
  };

  const removeManualSubject = (id: number) => {
    setManualSubjects((current) => current.filter((subject) => subject.id !== id));
  };

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
        [subjectId]: { condition: "REGULAR", examDate: previewMode ? "2026-09-10" : "" },
      };
    });
  };

  const updateSelection = (subjectId: number, patch: Partial<SubjectSelection>) => {
    setSelections((current) => ({
      ...current,
      [subjectId]: { ...current[subjectId], ...patch },
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (subjectCount === 0) {
      setFormError("Seleccioná al menos una materia para continuar.");
      return;
    }
    if (!shift) {
      setFormError("Seleccioná el turno en el que cursás la carrera.");
      return;
    }
    if (personalData.surname.trim().length < 2 || personalData.names.trim().length < 2) {
      setFormError("Ingresá tu apellido y todos tus nombres tal como figuran en tu DNI.");
      return;
    }
    if (usesManualSubjects && manualSubjects.some((subject) => !subject.name.trim() || !subject.year || !subject.examDate)) {
      setFormError("Completá el nombre, año y fecha de examen de cada espacio curricular.");
      return;
    }
    if (!usesManualSubjects && selectedSubjects.some((subject) => !selections[subject.id]?.examDate)) {
      setFormError("Indicá la fecha de examen de cada materia seleccionada.");
      return;
    }
    if (!accepted) {
      setFormError("Tenés que aceptar la declaración antes de continuar.");
      return;
    }

    setPendingPayload({
      carrera_id: Number(careerId),
      turno: shift,
      apellido: personalData.surname.trim(),
      nombres: personalData.names.trim(),
      dni: personalData.dni.replace(/\D/g, ""),
      telefono: personalData.phone.trim(),
      fecha: new Date().toISOString().slice(0, 10),
      llamado: call,
      materias: usesManualSubjects ? manualSubjects.map((subject) => ({
        nombre: subject.name.trim(),
        anio: Number(subject.year),
        condicion: subject.condition,
        fecha_examen: subject.examDate,
      })) : selectedSubjects.map((subject) => ({
        materia_id: subject.id,
        condicion: selections[subject.id].condition,
        fecha_examen: selections[subject.id].examDate,
      })),
    });
    setReviewDialogOpen(true);
  };

  const submitPayment = async () => {
    if (!pendingPayload || submitting) return;

    if (previewMode) {
      setReviewDialogOpen(false);
      setFormError("Vista previa local: no se registró el permiso ni se inició ningún pago.");
      return;
    }

    setReviewDialogOpen(false);
    setSubmitting(true);
    try {
      const response = await fetch("/api/permisos-examen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingPayload),
      });

      if (!response.ok) {
        throw new Error(await responseMessage(response, "No pudimos registrar el permiso."));
      }

      const data = (await response.json()) as UnknownRecord;
      const paymentUrl = String(data.init_point ?? "");
      const newPermitToken = String(data.permit_token ?? "");

      if (paymentUrl) {
        window.location.assign(paymentUrl);
        return;
      }

      if (uuidPattern.test(newPermitToken)) {
        setPermitToken(newPermitToken);
        setPaymentStatus(String(data.payment_status ?? "pending"));
      }
      else setFormError("El permiso fue recibido, pero no obtuvimos el enlace de pago.");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "No pudimos registrar el permiso.");
    } finally {
      setSubmitting(false);
    }
  };

  if (permitToken) {
    const approved = paymentStatus === "approved";
    const failed = paymentStatus ? failedPaymentStatuses.has(paymentStatus) : false;
    const PaymentFeedback = approved
      ? InstitutionalFeedbackSuccess
      : failed
        ? InstitutionalFeedbackError
        : InstitutionalFeedbackPending;

    return (
      <PaymentFeedback
        eyebrow={approved ? "Pago acreditado" : failed ? "Pago no acreditado" : "Solicitud registrada"}
        title={approved ? "Tu permiso está disponible" : failed ? "No pudimos confirmar el pago" : "Estamos verificando tu pago"}
        description={approved
            ? "Mercado Pago confirmó la acreditación. Ya podés descargar la ficha y el comprobante."
            : failed
              ? "La operación fue rechazada, cancelada o no coincide con el importe esperado. Podés iniciar una nueva solicitud."
              : "Mercado Pago notificará al sistema académico. Esta pantalla se actualiza automáticamente cuando llega la acreditación."}
      >
        {approved && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Button asChild className="h-12 bg-[#0A496C] hover:bg-[#073A57]">
              <a href={`/api/permisos-examen/${permitToken}/pdf`}><Download /> Descargar ficha</a>
            </Button>
            <Button asChild variant="outline" className="h-12 border-[#0A496C] text-[#0A496C]">
              <a href={`/api/permisos-examen/${permitToken}/comprobante`}><FileText /> Descargar comprobante</a>
            </Button>
          </div>
        )}
        {failed && (
          <Button type="button" className="h-12 bg-[#0A496C] hover:bg-[#073A57]" onClick={() => router.push("/permisos-examen")}>
            Iniciar una nueva solicitud
          </Button>
        )}
        {statusError ? <p role="alert" className="mt-5 border-t border-current/15 pt-5 text-sm text-[#8B2C2C]">{statusError}</p> : null}
        {!approved && !failed ? <p className="text-sm text-[#64748B]">Podés dejar esta pestaña abierta; la verificación continuará automáticamente.</p> : null}
      </PaymentFeedback>
    );
  }

  if (loadingConfiguration) {
    return (
      <InstitutionalFeedbackLoading
        eyebrow="Conectando con el sistema académico"
        title="Consultando la convocatoria"
        description="Estamos verificando las fechas, llamados y condiciones vigentes."
      />
    );
  }

  if (configurationError || !configuration) {
    return (
      <InstitutionalFeedbackError
        eyebrow="Servicio no disponible"
        title="No pudimos consultar las inscripciones"
        description={configurationError || "Intentá nuevamente en unos minutos."}
      >
        <Button type="button" className="bg-[#0A496C]" onClick={() => window.location.reload()}>
          <RefreshCw /> Reintentar
        </Button>
      </InstitutionalFeedbackError>
    );
  }

  if (!configuration.isOpen) {
    const scheduled = configuration.state === "programada";

    return (
      <InstitutionalFeedbackNotice
        eyebrow={scheduled ? "Próxima convocatoria" : "Inscripciones cerradas"}
        title={configuration.name}
        description={configuration.message || (scheduled
            ? `El formulario se habilitará el ${formatDateTime(configuration.startsAt)}.`
            : "En este momento no hay una convocatoria habilitada para solicitar permisos de examen.")}
      >
        {configuration.endsAt && (
          <p className="text-sm font-medium text-[#64748B]">
            Vigencia programada: {formatDateTime(configuration.startsAt)} al {formatDateTime(configuration.endsAt)}.
          </p>
        )}
      </InstitutionalFeedbackNotice>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-2xl border border-[#B8D8E8] bg-[#F3FAFC] p-6 md:p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0A496C]">Convocatoria abierta</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#123A50]">{configuration.name}</h2>
            <p className="mt-2 text-sm leading-6 text-[#52606D]">
              Disponible hasta el {formatDateTime(configuration.endsAt)}
              {configuration.durationDays ? ` · Duración: ${configuration.durationDays} días` : ""}
            </p>
            {!hasEditorialContent && configuration.message ? (
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#52606D]">{configuration.message}</p>
            ) : null}
          </div>
          <div className="shrink-0 rounded-xl bg-white px-5 py-4 text-right shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#64748B]">Arancel</p>
            <p className="mt-1 text-2xl font-semibold text-[#0A496C]">{formatAmount(configuration.amount, configuration.currencyId)}</p>
          </div>
        </div>
      </section>
      <section className="rounded-2xl border border-[#D8E1E8] bg-white p-6 md:p-8">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E0ECF8] font-semibold text-[#0A496C]">1</span>
          <div>
            <h2 className="text-xl font-semibold text-[#123A50]">Datos del estudiante</h2>
            <p className="mt-1 text-sm leading-6 text-[#64748B]">Completá los datos tal como figuran en tu documentación académica.</p>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-[#B8D8E8] bg-[#F3FAFC] p-4 text-sm leading-6 text-[#244A5E]">
          <strong>Importante:</strong> escribí tu apellido y todos tus nombres completos, sin iniciales ni abreviaturas. Los datos incorrectos pueden invalidar el permiso.
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="permit-surname">Apellido</Label>
            <Input id="permit-surname" name="apellido" required autoComplete="family-name" placeholder="Ej.: Pérez González" className={inputClassName} value={personalData.surname} onChange={(event) => setPersonalData({ ...personalData, surname: event.target.value })} />
            <p className="text-xs text-[#64748B]">Ingresá todos tus apellidos como figuran en el DNI.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="permit-names">Nombres</Label>
            <Input id="permit-names" name="nombres" required autoComplete="given-name" placeholder="Ej.: Ana María" className={inputClassName} value={personalData.names} onChange={(event) => setPersonalData({ ...personalData, names: event.target.value })} />
            <p className="text-xs text-[#64748B]">Ingresá todos tus nombres, no solamente el primero.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="permit-dni">DNI</Label>
            <Input id="permit-dni" name="dni" required inputMode="numeric" autoComplete="off" pattern="[0-9]{7,9}" maxLength={9} placeholder="Sin puntos" className={inputClassName} value={personalData.dni} onChange={(event) => setPersonalData({ ...personalData, dni: event.target.value.replace(/\D/g, "") })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="permit-phone">Teléfono</Label>
            <Input id="permit-phone" name="telefono" required type="tel" inputMode="tel" autoComplete="tel" className={inputClassName} value={personalData.phone} onChange={(event) => setPersonalData({ ...personalData, phone: event.target.value })} />
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

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="permit-career">Carrera</Label>
            <select id="permit-career" name="carrera" autoComplete="off" required className={selectClassName} value={careerId} disabled={loadingCareers || careers.length === 0} onChange={(event) => setCareerId(event.target.value)}>
              <option value="">{loadingCareers ? "Cargando carreras…" : "Seleccioná tu carrera"}</option>
              {careers.map((career) => <option key={career.id} value={career.id}>{career.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="permit-shift">Turno</Label>
            <select id="permit-shift" name="turno" autoComplete="off" required className={selectClassName} value={shift} disabled={!careerId || loadingSubjects || shifts.length === 0} onChange={(event) => setShift(event.target.value)}>
              <option value="">{loadingSubjects ? "Cargando turnos…" : "Seleccioná tu turno"}</option>
              {shifts.map((shiftOption) => <option key={shiftOption.value} value={shiftOption.value}>{shiftOption.label}</option>)}
            </select>
            <p className="text-xs text-[#64748B]">Elegí el turno en el que cursás, no el horario del examen.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="permit-call">Instancia</Label>
            <select id="permit-call" name="llamado" autoComplete="off" required className={selectClassName} value={call} onChange={(event) => setCall(event.target.value)}>
              {configuration.calls.map((callOption) => (
                <option key={callOption.value} value={callOption.value}>{callOption.label}</option>
              ))}
            </select>
          </div>
        </div>
        {careerId && !loadingSubjects && shifts.length === 0 ? (
          <div className="mt-5 rounded-xl border border-[#F2D6A2] bg-[#FFF9ED] p-4 text-sm text-[#7A5420]">
            Esta carrera no tiene turnos habilitados. Comunicate con Preceptoría antes de completar el permiso.
          </div>
        ) : null}
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
          <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-semibold text-[#52606D]">{subjectCount}/8</span>
        </div>

        {usesManualSubjects && (
          <div className="mt-7 space-y-4">
            <div className="rounded-xl border border-[#F2D6A2] bg-[#FFF9ED] p-4 text-sm leading-6 text-[#7A5420]">
              <span className="font-semibold">Esta carrera todavía no tiene el plan de estudios cargado.</span>{" "}
              Escribí el nombre de cada espacio curricular tal como figura en tu documentación.
            </div>
            {manualSubjects.map((subject, index) => (
              <div key={subject.id} className="grid gap-4 rounded-xl border border-[#D8E1E8] bg-[#F7FAFC] p-4 md:grid-cols-[1fr_120px_150px_180px_auto] md:items-end">
                <div className="space-y-1.5">
                  <Label htmlFor={`manual-name-${subject.id}`} className="text-xs">Espacio curricular {index + 1}</Label>
                  <Input id={`manual-name-${subject.id}`} name={`materia_${subject.id}`} autoComplete="off" required maxLength={160} className={inputClassName} value={subject.name} onChange={(event) => updateManualSubject(subject.id, { name: event.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`manual-year-${subject.id}`} className="text-xs">Año</Label>
                  <select id={`manual-year-${subject.id}`} name={`anio_${subject.id}`} autoComplete="off" required className={selectClassName} value={subject.year} onChange={(event) => updateManualSubject(subject.id, { year: event.target.value })}>
                    <option value="">Elegir</option>
                    {[1, 2, 3].map((year) => <option key={year} value={year}>{year}.º</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`manual-condition-${subject.id}`} className="text-xs">Condición</Label>
                  <select id={`manual-condition-${subject.id}`} name={`condicion_${subject.id}`} autoComplete="off" className={selectClassName} value={subject.condition} onChange={(event) => updateManualSubject(subject.id, { condition: event.target.value as SubjectSelection["condition"] })}>
                    <option value="REGULAR">Regular</option>
                    <option value="LIBRE">Libre</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`manual-date-${subject.id}`} className="text-xs">Fecha del examen</Label>
                  <Input id={`manual-date-${subject.id}`} name={`fecha_${subject.id}`} type="date" autoComplete="off" required className={inputClassName} value={subject.examDate} onChange={(event) => updateManualSubject(subject.id, { examDate: event.target.value })} />
                </div>
                <Button type="button" variant="outline" size="icon" disabled={manualSubjects.length === 1} onClick={() => removeManualSubject(subject.id)} aria-label={`Quitar espacio curricular ${index + 1}`}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" disabled={manualSubjects.length >= 8} onClick={addManualSubject} className="border-[#0A496C] text-[#0A496C]">
              <Plus className="size-4" /> Agregar otro espacio curricular
            </Button>
          </div>
        )}

        {!usesManualSubjects && <>
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
                    <select id={`condition-${subject.id}`} name={`condicion_${subject.id}`} autoComplete="off" className={selectClassName} value={selections[subject.id].condition} onChange={(event) => updateSelection(subject.id, { condition: event.target.value as SubjectSelection["condition"] })}>
                      <option value="REGULAR">Regular</option>
                      <option value="LIBRE">Libre</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`date-${subject.id}`} className="text-xs">Fecha del examen</Label>
                    <Input id={`date-${subject.id}`} name={`fecha_${subject.id}`} type="date" autoComplete="off" required className={inputClassName} value={selections[subject.id].examDate} onChange={(event) => updateSelection(subject.id, { examDate: event.target.value })} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </>}
      </section>

      <section className="rounded-2xl bg-[#073A57] p-6 text-white md:p-8">
        <div className="flex items-start gap-4">
          <ShieldCheck className="mt-0.5 size-6 shrink-0 text-[#2CBEE7]" />
          <div>
            <h2 className="text-lg font-semibold">Declaración y pago</h2>
            <p className="mt-2 text-sm leading-6 text-white/75">La inscripción queda sujeta al régimen de correlatividades y se confirma cuando Mercado Pago informa la acreditación.</p>
            <p className="mt-3 rounded-lg border border-white/20 bg-white/10 p-3 text-sm leading-6 text-white/90">
              Después de pagar, esperá a que Mercado Pago te redirija automáticamente a esta página. No cierres la pestaña: al regresar podrás consultar la acreditación y descargar el comprobante.
            </p>
            <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6">
              <Checkbox checked={accepted} onCheckedChange={(value) => setAccepted(value === true)} className="mt-1 border-white/50 data-[state=checked]:border-[#2CBEE7] data-[state=checked]:bg-[#2CBEE7]" />
              <span>Declaro que los datos ingresados son correctos y acepto que el instituto valide las condiciones académicas informadas.</span>
            </label>
          </div>
        </div>
      </section>

      {formError ? <InstitutionalFeedbackError title="No pudimos registrar el permiso" description={formError} /> : null}

      <Button type="submit" disabled={submitting || loadingCareers || loadingSubjects || careers.length === 0 || shifts.length === 0 || subjectCount === 0} className="h-14 w-full rounded-xl bg-[#0A496C] text-base font-semibold hover:bg-[#073A57]">
        {submitting ? <><Loader2 className="animate-spin" /> Registrando permiso…</> : <><CreditCard /> Continuar al pago</>}
      </Button>
      <p className="flex items-center justify-center gap-2 text-center text-xs text-[#64748B]"><CalendarDays className="size-4" /> Verificá las fechas publicadas por el instituto antes de enviar el permiso.</p>

      <AlertDialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <AlertDialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto border-[#B7CADB] bg-white sm:max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogMedia className="rounded-full bg-[#E0ECF8] text-[#0A496C]">
              <CreditCard className="size-7" aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle className="text-2xl tracking-[-0.025em] text-[#0A496C]">Revisá tus datos antes de pagar</AlertDialogTitle>
            <AlertDialogDescription className="text-left leading-6 text-[#52606D]">
              Confirmá que toda la información coincida con tu documentación. Después de esta instancia se registrará el permiso y continuarás en Mercado Pago.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <section className="rounded-xl border border-[#D8E1E8] bg-[#F7FAFC] p-4" aria-labelledby="review-student-title">
              <h3 id="review-student-title" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6F94]">Datos del estudiante</h3>
              <dl className="mt-4 space-y-3 text-[#52606D]">
                <div><dt className="text-xs text-[#64748B]">Apellido y nombres</dt><dd className="mt-1 font-semibold text-[#123A50]">{personalData.surname.trim()}, {personalData.names.trim()}</dd></div>
                <div><dt className="text-xs text-[#64748B]">DNI</dt><dd className="mt-1 font-semibold text-[#123A50]">{formatDni(personalData.dni)}</dd></div>
                <div><dt className="text-xs text-[#64748B]">WhatsApp</dt><dd className="mt-1 font-semibold text-[#123A50]">{personalData.phone.trim()}</dd></div>
              </dl>
            </section>

            <section className="rounded-xl border border-[#D8E1E8] bg-[#F7FAFC] p-4" aria-labelledby="review-exam-title">
              <h3 id="review-exam-title" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6F94]">Inscripción</h3>
              <dl className="mt-4 space-y-3 text-[#52606D]">
                <div><dt className="text-xs text-[#64748B]">Carrera</dt><dd className="mt-1 font-semibold text-[#123A50]">{selectedCareer?.name}</dd></div>
                <div><dt className="text-xs text-[#64748B]">Turno</dt><dd className="mt-1 font-semibold text-[#123A50]">{selectedShiftLabel}</dd></div>
                <div><dt className="text-xs text-[#64748B]">Llamado</dt><dd className="mt-1 font-semibold text-[#123A50]">{selectedCallLabel}</dd></div>
              </dl>
            </section>
          </div>

          <section className="rounded-xl border border-[#D8E1E8] p-4" aria-labelledby="review-subjects-title">
            <div className="flex items-center justify-between gap-4">
              <h3 id="review-subjects-title" className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6F94]">Materias seleccionadas</h3>
              <span className="text-xs font-semibold text-[#64748B]">{reviewSubjects.length} {reviewSubjects.length === 1 ? "materia" : "materias"}</span>
            </div>
            <ul className="mt-3 divide-y divide-[#E2E8F0]">
              {reviewSubjects.map((subject, index) => (
                <li key={`${subject.name}-${index}`} className="flex flex-col justify-between gap-1 py-3 text-sm sm:flex-row sm:items-center sm:gap-5">
                  <span className="font-semibold text-[#123A50]">{subject.name}</span>
                  <span className="shrink-0 text-xs text-[#64748B]">{subject.condition === "REGULAR" ? "Regular" : "Libre"} · {formatExamDate(subject.examDate)}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex gap-3 rounded-xl border border-[#F2D6A2] bg-[#FFF9ED] p-4 text-sm leading-6 text-[#6F4B17]">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p><strong>No cierres la pestaña después de pagar.</strong> Esperá a que Mercado Pago te redirija automáticamente al sitio institucional; al regresar podremos verificar la acreditación y habilitar la ficha y el comprobante.</p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Volver a revisar</AlertDialogCancel>
            <AlertDialogAction onClick={() => void submitPayment()} className="bg-[#0A496C] hover:bg-[#073A57]">
              Confirmar e ir a Mercado Pago
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
