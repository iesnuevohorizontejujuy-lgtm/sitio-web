import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  MessageCircleQuestion,
  Search,
} from "lucide-react";
import { CareerInquiryForm } from "@/components/institutional/CareerInquiryForm";
import { MotionReveal } from "@/components/institutional/MotionReveal";
import { formatAdmissionDate, getAdmissionCall } from "@/lib/admissions";
import { getCareers } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Ingresantes | IES Nuevo Horizonte",
  description: "Orientación para elegir una carrera, consultar disponibilidad y conocer el proceso de inscripción al IES Nuevo Horizonte.",
};

const steps = [
  {
    icon: Search,
    title: "Explorá las carreras",
    text: "Compará áreas, duración, modalidad, perfil profesional y plan de estudios.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Consultá disponibilidad",
    text: "Escribinos para confirmar el próximo ingreso de la carrera que te interesa.",
  },
  {
    icon: ClipboardCheck,
    title: "Recibí los requisitos",
    text: "El equipo te informará la documentación y las fechas vigentes para tu caso.",
  },
  {
    icon: BadgeCheck,
    title: "Completá tu inscripción",
    text: "Presentá la documentación indicada y confirmá el alta con el instituto.",
  },
] as const;

const fallbackFaqs = [
  {
    question: "¿Cómo sé si una carrera tiene inscripciones disponibles?",
    answer: "Completá el formulario de orientación o consultá desde la ficha de la carrera. El equipo del instituto confirmará la disponibilidad del próximo ingreso.",
  },
  {
    question: "¿Qué documentación tengo que presentar?",
    answer: "La documentación y sus condiciones pueden actualizarse. Para evitar información desactualizada, el equipo te enviará el listado oficial vigente antes de que inicies el trámite.",
  },
  {
    question: "¿Dónde encuentro la modalidad y duración?",
    answer: "Cada ficha de carrera muestra su modalidad, duración, resolución, plan de estudios y documentación publicada por el instituto.",
  },
  {
    question: "¿Este formulario completa mi inscripción?",
    answer: "No. El formulario inicia una consulta de orientación. La inscripción queda confirmada únicamente cuando el instituto valida el proceso y la documentación correspondiente.",
  },
] as const;

export default async function AdmissionsPage() {
  const [careers, admissionCall] = await Promise.all([
    getCareers(),
    getAdmissionCall(),
  ]);
  const areas = [...new Set(careers.map((career) => career.area))];
  const faqs = admissionCall?.preguntas_frecuentes.length
    ? admissionCall.preguntas_frecuentes.map((faq) => ({
        question: faq.pregunta,
        answer: faq.respuesta,
      }))
    : fallbackFaqs;
  const statusLabel = admissionCall
    ? {
        abiertas: "Inscripciones abiertas",
        cerradas: "Inscripciones cerradas",
        proximamente: "Próximamente",
      }[admissionCall.estado]
    : null;

  return (
    <main className="institutional-shell bg-white text-[#121C28]">
      <section className="border-b border-[#D8E1E8]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-12 lg:px-8 lg:py-24">
          <MotionReveal className="lg:col-span-5">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0A496C]"><span className="h-0.5 w-9 bg-[#2CBEE7]" />Ingreso y orientación</p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-[#0A496C] sm:text-5xl lg:text-6xl">Tu camino empieza con una buena elección</h1>
            <p className="mt-7 text-lg leading-8 text-[#52606D]">Conocé la oferta académica y recibí acompañamiento para consultar requisitos, disponibilidad y próximos pasos.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/carreras" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#2CBEE7] px-6 py-3 text-sm font-semibold text-[#073A57] transition hover:bg-[#51D5FF]">Explorar carreras <ArrowRight className="size-4" /></Link>
              <a href="#orientacion" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#0A496C] px-6 py-3 text-sm font-semibold text-[#0A496C] hover:bg-[#E0ECF8]">Quiero orientación</a>
            </div>
            <div className="mt-9 grid grid-cols-3 gap-4 border-t border-[#D8E1E8] pt-6">
              <div><p className="text-xl font-semibold text-[#0A496C]">{careers.length}</p><p className="mt-1 text-xs text-[#64748B]">Carreras publicadas</p></div>
              <div><GraduationCap className="size-6 text-[#0A496C]" /><p className="mt-2 text-xs text-[#64748B]">Títulos oficiales</p></div>
              <div><BookOpenCheck className="size-6 text-[#0A496C]" /><p className="mt-2 text-xs text-[#64748B]">Planes de estudio</p></div>
            </div>
          </MotionReveal>

          <MotionReveal className="relative lg:col-span-7" delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#B7CADB] bg-[#E0ECF8]">
              <Image src="/institutional/students-collaboration.png" alt="Estudiantes del IES Nuevo Horizonte compartiendo una actividad" fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
            </div>
            <div className="absolute bottom-5 left-5 max-w-[270px] border-l-4 border-[#2CBEE7] bg-white p-5 shadow-[0_4px_20px_rgba(10,73,108,0.12)] sm:bottom-7 sm:left-7">
              <p className="font-semibold text-[#0A496C]">No estás solo para elegir</p>
              <p className="mt-1 text-sm leading-5 text-[#52606D]">Nuestro equipo puede orientarte antes de comenzar el proceso.</p>
            </div>
          </MotionReveal>
        </div>
      </section>

      {admissionCall && (
        <section className="border-b border-[#D8E1E8] bg-white py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <MotionReveal className="grid overflow-hidden rounded-2xl border border-[#B7CADB] lg:grid-cols-12">
              <div className="bg-[#0A496C] p-7 text-white md:p-10 lg:col-span-5">
                <span className="inline-flex rounded-md bg-[#2CBEE7] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#073A57]">{statusLabel}</span>
                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-[#2CBEE7]">Información oficial publicada</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em]">{admissionCall.titulo}</h2>
                {admissionCall.bajada && <p className="mt-5 leading-7 text-white/75">{admissionCall.bajada}</p>}
                <div className="mt-8 grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-white/55">Ciclo lectivo</p>
                    <p className="mt-1 font-semibold">{admissionCall.ciclo_lectivo}</p>
                  </div>
                  {(admissionCall.fecha_inicio || admissionCall.fecha_fin) && (
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-white/55">Período informado</p>
                      <p className="mt-1 text-sm font-semibold leading-6">
                        {admissionCall.fecha_inicio && formatAdmissionDate(admissionCall.fecha_inicio)}
                        {admissionCall.fecha_inicio && admissionCall.fecha_fin && " — "}
                        {admissionCall.fecha_fin && formatAdmissionDate(admissionCall.fecha_fin)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-8 p-7 md:p-10 lg:col-span-7">
                {admissionCall.requisitos.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 text-[#0A496C]"><FileCheck2 className="size-6" /><h3 className="text-xl font-semibold">Requisitos publicados</h3></div>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {admissionCall.requisitos.map((requirement) => (
                        <li key={requirement} className="flex gap-3 text-sm leading-6 text-[#52606D]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-[#2CBEE7]" />{requirement}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {admissionCall.documentos.length > 0 && (
                  <div className="border-t border-[#D8E1E8] pt-7">
                    <div className="flex items-center gap-3 text-[#0A496C]"><CalendarDays className="size-6" /><h3 className="text-xl font-semibold">Documentación para descargar</h3></div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      {admissionCall.documentos.map((document) => (
                        <a key={document.url} href={document.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#B7CADB] px-4 py-3 text-sm font-semibold text-[#0A496C] hover:bg-[#E0ECF8]">{document.nombre}<Download className="size-4" /></a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </MotionReveal>
          </div>
        </section>
      )}

      <section className="border-b border-[#D8E1E8] bg-[#F7F9FB] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <MotionReveal className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">Paso a paso</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Cómo iniciar tu ingreso</h2>
            <p className="mt-5 text-lg leading-8 text-[#52606D]">Un recorrido sencillo para informarte primero y completar el trámite con datos actualizados.</p>
          </MotionReveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#CBD5E1] bg-[#CBD5E1] md:grid-cols-2 xl:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <MotionReveal key={title} className="h-full bg-white p-7 md:p-8" delay={index * 0.06}>
                <div className="flex items-start justify-between gap-5">
                  <Icon className="size-8 text-[#0A496C]" />
                  <span className="text-3xl font-semibold text-[#D7E2EC]">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-7 text-xl font-semibold text-[#0A496C]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#52606D]">{text}</p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 lg:grid-cols-12 lg:px-8">
          <MotionReveal className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">Oferta académica</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Encontrá un área que conecte con vos</h2>
            <p className="mt-5 leading-7 text-[#52606D]">La oferta publicada se organiza en áreas para que puedas explorarla según tus intereses.</p>
            <Link href="/carreras" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#0A496C] underline underline-offset-4">Ver todas las carreras <ArrowRight className="size-4" /></Link>
          </MotionReveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-[#CBD5E1] bg-[#CBD5E1] sm:grid-cols-2 lg:col-span-7">
            {areas.map((area, index) => (
              <MotionReveal key={area} className="bg-white p-6" delay={index * 0.05}>
                <Link href="/carreras" className="group flex items-center justify-between gap-5 font-semibold text-[#0A496C]">{area}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0A496C] py-20 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:px-8">
          <MotionReveal className="lg:col-span-5">
            <HelpCircle className="size-9 text-[#2CBEE7]" />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#2CBEE7]">Preguntas frecuentes</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] md:text-4xl">Antes de iniciar</h2>
            <p className="mt-5 leading-7 text-white/75">La información definitiva siempre será la comunicada por el instituto para el período correspondiente.</p>
          </MotionReveal>
          <MotionReveal className="divide-y divide-white/15 border-y border-white/15 lg:col-span-7" delay={0.08}>
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold marker:content-none">{faq.question}<span className="text-2xl font-normal text-[#2CBEE7] transition-transform group-open:rotate-45">+</span></summary>
                <p className="max-w-2xl pt-4 text-sm leading-7 text-white/70">{faq.answer}</p>
              </details>
            ))}
          </MotionReveal>
        </div>
      </section>

      <section id="orientacion" className="scroll-mt-28 bg-[#E0ECF8] px-5 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12">
          <MotionReveal className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0A496C]">Orientación</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-[#0A496C] md:text-4xl">Contanos qué necesitás saber</h2>
            <p className="mt-5 leading-7 text-[#52606D]">La consulta llegará al panel institucional para que el equipo pueda responderte por WhatsApp o correo.</p>
            <div className="mt-7 flex gap-3 text-sm leading-6 text-[#52606D]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-[#0A496C]" /><span>Este formulario solicita orientación; no confirma una inscripción.</span></div>
          </MotionReveal>
          <MotionReveal className="rounded-2xl bg-white p-6 md:p-9 lg:col-span-8" delay={0.08}>
            <CareerInquiryForm careerId={null} careerTitle="ingreso e inscripciones" />
          </MotionReveal>
        </div>
      </section>
    </main>
  );
}
