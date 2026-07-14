'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { publicFetch } from '@/lib/public-api';
import {
    X, Check, Loader2,
    Monitor, Dumbbell, Trophy, Utensils,
} from 'lucide-react';

// ─────────────────────────────────────────────
// MODAL DE CONTACTO
// ─────────────────────────────────────────────
const ContactModal = ({ isOpen, onClose, careerId, careerName }) => {
    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        telefono: '',
        mensaje: '',
        localidad_id: '',
    });
    const [localidades, setLocalidades] = useState([]);
    const [loadingLoc, setLoadingLoc] = useState(true);
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        if (isOpen && localidades.length === 0) {
            publicFetch('/public/localidades')
                .then(res => res.json())
                .then(data => { setLocalidades(data); setLoadingLoc(false); })
                .catch(() => setLoadingLoc(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const field = 'w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.localidad_id) { alert('Por favor seleccioná una localidad'); return; }
        setStatus('loading');

        let tel = formData.telefono.replace(/[^0-9]/g, '');
        if (!tel.startsWith('54')) tel = '549' + tel;

        try {
            const res = await publicFetch('/postulantes', {
                method: 'POST',
                body: JSON.stringify({ ...formData, telefono: tel, carrera_id: careerId }),
            });
            if (!res.ok) throw new Error();
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ nombre_completo: '', email: '', telefono: '', mensaje: '', localidad_id: '' });
            }, 2000);
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card text-card-foreground rounded-[2.5rem] shadow-2xl w-full max-w-md relative p-8 md:p-10 border border-border/60">

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full transition-colors"
                    aria-label="Cerrar"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-extrabold text-foreground mb-2 tracking-tight">Solicitar Información</h2>
                <p className="text-sm text-muted-foreground mb-8">
                    Te asesoramos sobre:{' '}
                    <span className="font-bold text-primary">{careerName}</span>
                </p>

                {status === 'success' ? (
                    <div className="text-center py-10 animate-in zoom-in-95 duration-300">
                        <div className="inline-flex p-4 bg-green-500/10 rounded-full mb-4 shadow-inner">
                            <Check className="text-green-500" size={40} />
                        </div>
                        <p className="text-xl font-extrabold text-foreground">¡Datos enviados!</p>
                        <p className="text-sm text-muted-foreground mt-2 font-medium">Un asesor se contactará muy pronto.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text" required placeholder="Nombre Completo"
                            className={field}
                            value={formData.nombre_completo}
                            onChange={e => setFormData({ ...formData, nombre_completo: e.target.value })}
                        />
                        <input
                            type="email" required placeholder="Correo Electrónico"
                            className={field}
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="tel" required placeholder="Teléfono"
                                className={field}
                                value={formData.telefono}
                                onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                            />
                            <select
                                required
                                className={field}
                                value={formData.localidad_id}
                                onChange={e => setFormData({ ...formData, localidad_id: e.target.value })}
                                disabled={loadingLoc}
                            >
                                <option value="">Localidad…</option>
                                {loadingLoc
                                    ? <option>Cargando…</option>
                                    : localidades.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.nombre}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <textarea
                            placeholder="¿Tienes alguna duda específica?" rows={3}
                            className={`${field} resize-none`}
                            value={formData.mensaje}
                            onChange={e => setFormData({ ...formData, mensaje: e.target.value })}
                        />

                        {status === 'error' && (
                            <p className="text-destructive font-bold text-xs text-center uppercase tracking-widest bg-destructive/10 p-2 rounded-lg border border-destructive/20">
                                Hubo un error al enviar. Intentá nuevamente.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-primary text-primary-foreground font-extrabold py-3.5 rounded-xl hover:brightness-110 transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 mt-4 active:scale-95"
                        >
                            {status === 'loading'
                                ? <><Loader2 className="animate-spin" size={20} /> PROCESANDO...</>
                                : 'ENVIAR SOLICITUD'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────
const FACILITIES = [
    { label: 'Gimnasio', icon: Dumbbell },
    { label: 'Sala Informática', icon: Monitor },
    { label: 'Comedor', icon: Utensils },
    { label: 'Campo Deportivo', icon: Trophy },
];

export default function LandingPage() {
    const [carreras, setCarreras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCareer, setSelectedCareer] = useState({ id: null, title: '' });

    useEffect(() => {
        publicFetch('/carreras')
            .then(res => res.json())
            .then(data => { setCarreras(data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, []);

    const openModal = (career) => {
        setSelectedCareer({ id: career?.id ?? null, title: career?.title ?? 'Asesoría General' });
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">

            {/* ── HERO ── */}
            <section id="inicio" className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/herosection.webp"
                        alt="Campus IESNH"
                        fill
                        className="object-cover brightness-75 dark:brightness-[0.6]"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(210_60%_12%)] via-transparent to-[hsl(210_60%_12%)]/40" />
                </div>

                <div className="relative z-10 text-center px-4 w-full max-w-5xl flex flex-col items-center">
                    {/* BOTÓN BAJADO Y PEGADO AL TÍTULO (mt-12 y mb-2) */}
                    <span className="inline-block py-1.5 px-5 rounded-full bg-primary/30 border border-primary/50 text-white text-xs font-bold tracking-widest uppercase backdrop-blur-md mt-12 mb-2 shadow-xl animate-in slide-in-from-bottom-4 duration-700">
                        Inscripciones Abiertas 2026
                    </span>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-2xl mb-4 leading-tight tracking-tighter pb-2 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                        Tu futuro empieza aquí
                    </h1>

                    <div className="h-1 w-[60%] max-w-md bg-gradient-to-r from-transparent via-white/80 to-transparent mb-8 rounded-full animate-in fade-in duration-1000 delay-300" />

                    <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-medium drop-shadow-md animate-in slide-in-from-bottom-8 duration-700 delay-200">
                        Formación superior de excelencia académica y valores humanos. Encontrá tu vocación hoy.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in duration-700 delay-500 w-full sm:w-auto">
                        <button
                            onClick={() => openModal(null)}
                            className="bg-primary text-primary-foreground font-extrabold py-3.5 px-8 rounded-full hover:brightness-110 transition-all hover:-translate-y-1 shadow-xl active:scale-95"
                        >
                            SOLICITAR INFORMACIÓN
                        </button>
                        <a
                            href="#carreras"
                            className="bg-white/10 backdrop-blur-md border border-white/40 text-white font-extrabold py-3.5 px-8 rounded-full hover:bg-white hover:text-foreground transition-all shadow-lg active:scale-95 text-center"
                        >
                            VER CARRERAS
                        </a>
                    </div>
                </div>
            </section>

            {/* ── CARRERAS ── */}
            <section id="carreras" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 flex flex-col items-center w-full">
                    <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight pb-2 bg-clip-text text-transparent bg-gradient-to-t from-primary via-primary to-foreground dark:bg-none dark:text-white dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        Nuestra Oferta Académica
                    </h2>
                    
                    <div className="h-[3px] w-[85%] max-w-4xl bg-gradient-to-r from-transparent via-primary to-transparent mt-4 rounded-full" />
                    <p className="text-muted-foreground mt-6 max-w-xl mx-auto text-lg">
                        Tecnicaturas y profesorados diseñados para el mercado laboral actual.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Loader2 className="animate-spin text-primary mb-4" size={48} />
                        <p className="font-bold uppercase tracking-widest text-sm">Cargando carreras…</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {carreras.map((carrera) => (
                            <div
                                key={carrera.id}
                                className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full hover:border-primary/50 hover:-translate-y-1"
                            >
                                <div className="relative h-56 w-full bg-muted overflow-hidden">
                                    <Image
                                        src={carrera.image}
                                        alt={carrera.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                        Carrera
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-xl font-extrabold text-foreground mb-4 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                        {carrera.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-8 flex-1 line-clamp-3 leading-relaxed">
                                        {carrera.description}
                                    </p>
                                    
                                    <div className="flex gap-3 mt-auto">
                                        <Link
                                            href={`/carreras/${carrera.slug}`}
                                            className="flex-1 text-center bg-primary/10 border border-primary/20 text-primary font-extrabold py-3 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-[10px] sm:text-xs uppercase tracking-widest"
                                        >
                                            Ver plan
                                        </Link>
                                        <button
                                            onClick={() => openModal(carrera)}
                                            className="flex-1 bg-primary border border-primary text-primary-foreground font-extrabold py-3 rounded-xl hover:brightness-110 transition-all duration-300 shadow-md text-[10px] sm:text-xs uppercase tracking-widest active:scale-95"
                                        >
                                            Me interesa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── INSTITUCIÓN ── */}
            <section id="institucion" className="py-24 bg-muted/30 border-t border-border relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
                            Infraestructura de{' '}
                            <span className="text-primary">Primer Nivel</span>
                        </h2>
                        
                        <p className="text-muted-foreground text-lg mb-10 leading-relaxed font-medium">
                            Creemos que el aprendizaje requiere del entorno adecuado. Contamos con espacios modernos diseñados para potenciar tus habilidades académicas, deportivas y tecnológicas.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {FACILITIES.map(({ label, icon: Icon }) => (
                                <div
                                    key={label}
                                    className="group flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/40 hover:shadow-md transition-all hover:-translate-y-1"
                                >
                                    <div className="bg-primary/10 p-3 rounded-xl shrink-0 group-hover:bg-primary transition-colors">
                                        <Icon size={22} className="text-primary group-hover:text-primary-foreground transition-colors" />
                                    </div>
                                    <span className="font-extrabold text-foreground group-hover:text-primary transition-colors">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-[400px] md:h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-card group">
                        <Image
                            src="/instituto.jpg"
                            alt="Instituto IESNH"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                </div>
            </section>

            {/* ── MODAL ── */}
            <ContactModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                careerId={selectedCareer.id}
                careerName={selectedCareer.title}
            />
        </div>
    );
}