"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { publicFetch } from "@/lib/public-api";
import { PermisoExamenInfoDialog } from "./components/info";
import { InfoMateriaDialog } from "./components/infoMateria";
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  Loader2,
  CreditCard,
  Download,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

// Componente principal con Suspense por el uso de useSearchParams
export default function FichaPermisoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" />
        </div>
      }
    >
      <FichaPermisoWizard />
    </Suspense>
  );
}

function FichaPermisoWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados de flujo y pasos
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fichaId, setFichaId] = useState(null);
  const [paymentLink, setPaymentLink] = useState("");

  // Estados de datos
  const [carreras, setCarreras] = useState([]);

  const [formData, setFormData] = useState({
    carrera_id: "",
    apellido: "",
    nombres: "",
    dni: "",
    telefono: "",
    turno: "",
  });

  const [materias, setMaterias] = useState([
    {
      num_materia: "",
      nombre: "",
      anio: "",
      condicion: "REGULAR",
      fecha_examen: "",
    },
  ]);

  // Detectar retorno de Mercado Pago
  useEffect(() => {
    const currentStep = searchParams.get("step");
    const id = searchParams.get("ficha_id");

    if (currentStep === "3" && id) {
      setFichaId(id);
      setStep(3);
    }
  }, [searchParams]);

  useEffect(() => {
    publicFetch("/carreras")
      .then((res) => res.json())
      .then((data) => setCarreras(data))
      .catch((err) => console.error("Error cargando carreras:", err));
  }, []);

  const handleMateriaChange = (index, field, value) => {
    const nuevasMaterias = [...materias];
    nuevasMaterias[index][field] = value;
    setMaterias(nuevasMaterias);
  };

  // PASO 1: Envío de datos iniciales
  const handleSubmitDatos = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await publicFetch("/fichas-permiso", {
        method: "POST",
        body: JSON.stringify({ ...formData, materias }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));

        // 409 → el alumno ya tiene un permiso aprobado y pagado
        if (response.status === 409 && err.ficha_id) {
          setFichaId(err.ficha_id);
          setStep(3);
          return;
        }

        throw new Error(err.error || err.message || "Error del servidor");
      }

      const data = await response.json();
      setFichaId(data.ficha_id);
      setPaymentLink(data.init_point);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Error al procesar los datos. Verifique los campos e intente nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  // PASO 3: Funciones de descarga
  const downloadFile = async (endpoint, filename) => {
    setLoading(true);
    try {
      const response = await publicFetch(endpoint);
      if (!response.ok) throw new Error("Respuesta no válida");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert(
        "No se pudo descargar el archivo. Es posible que el pago aún se esté procesando.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-28 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* WIZARD PROGRESS BAR */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-md mx-auto relative">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center z-10 font-bold transition-colors duration-500 ${step >= 1 ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground"}`}
            >
              1
            </div>
            <div
              className={`flex-1 h-1 transition-colors duration-500 ${step >= 2 ? "bg-primary" : "bg-border"}`}
            ></div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center z-10 font-bold transition-colors duration-500 ${step >= 2 ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground"}`}
            >
              2
            </div>
            <div
              className={`flex-1 h-1 transition-colors duration-500 ${step >= 3 ? "bg-primary" : "bg-border"}`}
            ></div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center z-10 font-bold transition-colors duration-500 ${step >= 3 ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground"}`}
            >
              3
            </div>
          </div>
          <div className="flex items-center justify-between max-w-md mx-auto mt-3 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
            <span className={step >= 1 ? "text-primary" : ""}>Datos</span>
            <span className={step >= 2 ? "text-primary" : ""}>Pago</span>
            <span className={step >= 3 ? "text-primary" : ""}>Descarga</span>
          </div>
        </div>

        {/* STEP 1: FORMULARIO */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-start mb-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                className="gap-2"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Volver al inicio
              </Button>
            </div>

            <Card>
              <CardHeader className="border-b border-border pb-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent rounded-lg">
                      <FileText className="text-accent-foreground" size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Paso 1: Inscripción</CardTitle>
                      <CardDescription>Ingresá tus datos académicos y personales.</CardDescription>
                    </div>
                  </div>
                  <PermisoExamenInfoDialog />
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSubmitDatos} className="space-y-8">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* FILA 1: Carrera (ancho completo) */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                      Carrera / Tecnicatura
                    </Label>
                    <select
                      required
                      value={formData.carrera_id}
                      onChange={(e) => setFormData({ ...formData, carrera_id: e.target.value })}
                      className="w-full border border-border bg-background text-foreground px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring shadow-xs transition-all"
                    >
                      <option value="">Seleccioná tu carrera</option>
                      {carreras.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre || c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* FILA 2: Turno */}
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                      ¿En qué turno cursaste/cursás la carrera?
                    </Label>
                    <select
                      required
                      value={formData.turno}
                      onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                      className="w-full border border-border bg-background text-foreground px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring shadow-xs transition-all"
                    >
                      <option value="" disabled hidden>Seleccioná el turno</option>
                      <option value="mañana">Mañana</option>
                      <option value="tarde">Tarde</option>
                      <option value="noche">Noche</option>
                    </select>
                  </div>

                  {/* FILA 3: Datos personales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        placeholder="Apellido"
                        required
                        className="border-border shadow-xs"
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nombres">Nombres</Label>
                      <Input
                        id="nombres"
                        placeholder="Nombres"
                        required
                        className="border-border shadow-xs"
                        onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dni">DNI</Label>
                      <Input
                        id="dni"
                        placeholder="DNI"
                        required
                        className="border-border shadow-xs"
                        onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        placeholder="Teléfono"
                        required
                        className="border-border shadow-xs"
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* MATERIAS */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-black text-muted-foreground uppercase tracking-wider">
                        Materias a Inscribirse
                      </h4>
                      <InfoMateriaDialog />
                    </div>
                    {materias.map((materia, index) => (
                      <div
                        key={index}
                        className="p-5 border border-border bg-muted/30 rounded-xl space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <Badge variant="default">Materia {index + 1}</Badge>
                          {materias.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setMaterias(materias.filter((_, i) => i !== index))}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 size={18} />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input
                            placeholder="N° de Orden"
                            className="border-border shadow-xs"
                            value={materia.num_materia}
                            onChange={(e) => handleMateriaChange(index, "num_materia", e.target.value)}
                          />
                          <Input
                            placeholder="Nombre de materia"
                            className="md:col-span-2 border-border shadow-xs"
                            value={materia.nombre}
                            onChange={(e) => handleMateriaChange(index, "nombre", e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="Año de cursado"
                            className="border-border shadow-xs"
                            value={materia.anio}
                            onChange={(e) => handleMateriaChange(index, "anio", e.target.value)}
                          />
                          <select
                            className="border border-border bg-background text-foreground px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring shadow-xs transition-all"
                            value={materia.condicion}
                            onChange={(e) => handleMateriaChange(index, "condicion", e.target.value)}
                          >
                            <option value="REGULAR">Regular</option>
                            <option value="LIBRE">Libre</option>
                          </select>
                          <div className="md:col-span-2 space-y-1">
                            <Label className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                              Fecha del examen
                            </Label>
                            <Input
                              type="date"
                              required
                              className="border-border shadow-xs"
                              value={materia.fecha_examen}
                              onChange={(e) => handleMateriaChange(index, "fecha_examen", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Añadir materia */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed border-2 hover:border-primary hover:text-primary hover:bg-accent/50"
                      onClick={() =>
                        setMaterias([
                          ...materias,
                          { num_materia: "", nombre: "", anio: "", condicion: "REGULAR", fecha_examen: "" },
                        ])
                      }
                    >
                      <Plus size={18} /> Añadir Materia
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground bg-accent/40 p-4 rounded-xl border border-border flex gap-2">
                    <span className="text-primary font-black">*</span>
                    <span>
                      Consultá el calendario de mesas en la sección de{" "}
                      <strong className="text-foreground">Noticias</strong> para verificar la fecha exacta antes de continuar al pago.
                    </span>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full font-bold tracking-wider active:scale-[0.98]"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "CONTINUAR AL PAGO"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 2: PAGO */}
        {step === 2 && (
          <div className="max-w-xl mx-auto animate-in zoom-in duration-500">
            <Card className="text-center">
              <CardContent className="pt-10 pb-10 space-y-8">
                <div className="w-24 h-24 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto">
                  <CreditCard size={48} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">
                    Paso 2: Arancel
                  </h2>
                  <p className="text-muted-foreground font-medium">
                    Para oficializar la inscripción, abona el derecho de examen.
                  </p>
                </div>
                <div className="bg-accent/50 border border-border p-6 rounded-xl space-y-1">
                  <span className="text-xs font-black text-primary uppercase tracking-widest">
                    Total a pagar
                  </span>
                  <p className="text-4xl font-black text-foreground">$4.000,00</p>
                </div>
                <a
                  href={paymentLink}
                  className="flex items-center justify-center gap-3 w-full bg-primary hover:bg-secondary text-white font-black py-4 rounded-xl transition-all text-lg tracking-wide uppercase"
                >
                  PAGAR AHORA <ExternalLink size={20} />
                </a>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-muted-foreground italic uppercase tracking-tighter text-sm"
                >
                  ← Modificar datos previos
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 3: DESCARGA */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto animate-in fade-in zoom-in duration-700">
            <Card className="text-center">
              <CardContent className="pt-10 pb-10 space-y-10">
                <div className="w-24 h-24 bg-accent text-primary rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck size={54} />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-black text-foreground tracking-tighter">
                    ¡INSCRIPCIÓN EXITOSA!
                  </h2>
                  <p className="text-muted-foreground font-medium leading-relaxed">
                    Tu pago ha sido procesado. Descargá la ficha para presentar ante
                    el preceptor y guardá tu comprobante.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                  <Button
                    variant="default"
                    size="lg"
                    disabled={loading}
                    onClick={() =>
                      downloadFile(
                        `/fichas-permiso/${fichaId}/pdf`,
                        `FichaExamen_${fichaId}.pdf`,
                      )
                    }
                    className="flex flex-col h-auto py-8 gap-3 hover:-translate-y-1 transition-transform"
                  >
                    <Download size={32} />
                    <span className="font-black text-xs uppercase tracking-widest">
                      Descargar Ficha
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    disabled={loading}
                    onClick={() =>
                      downloadFile(
                        `/fichas-permiso/${fichaId}/comprobante`,
                        `ReciboPago_${fichaId}.pdf`,
                      )
                    }
                    className="flex flex-col h-auto py-8 gap-3 hover:-translate-y-1 transition-transform"
                  >
                    <FileText size={32} className="text-primary" />
                    <span className="font-black text-xs uppercase tracking-widest">
                      Recibo de Pago
                    </span>
                  </Button>
                </div>

                <Separator />

                <Button
                  variant="ghost"
                  onClick={() => router.push("/")}
                  className="text-muted-foreground hover:text-primary uppercase text-xs tracking-widest"
                >
                  Finalizar Proceso
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
