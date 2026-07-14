"use client";
import { useState, useEffect } from "react";
import { publicFetch } from "@/lib/public-api";
import { Loader2, X, Check, MapPin } from "lucide-react";

/**
 * Client component for the contact modal.
 * This needs to be client-side because of form state and interactivity.
 */
export default function ContactModal({ isOpen, onClose, careerId, careerName }) {
    const [formData, setFormData] = useState({
        nombre_completo: '',
        email: '',
        telefono: '',
        mensaje: '',
        localidad_id: ''
    });

    const [localidades, setLocalidades] = useState([]);
    const [loadingLoc, setLoadingLoc] = useState(true);
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        if (isOpen && localidades.length === 0) {
            setLoadingLoc(true);
            publicFetch('/public/localidades')
                .then(res => res.json())
                .then(data => {
                    setLocalidades(data);
                    setLoadingLoc(false);
                })
                .catch(err => {
                    console.error("Error cargando localidades:", err);
                    setLoadingLoc(false);
                });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.localidad_id) {
            alert("Por favor selecciona una localidad");
            return;
        }

        setStatus('loading');

        let telefonoLimpio = formData.telefono.replace(/[^0-9]/g, '');
        if (!telefonoLimpio.startsWith('54')) {
            telefonoLimpio = '549' + telefonoLimpio;
        }

        try {
            const res = await publicFetch('/postulantes', {
                method: 'POST',
                body: JSON.stringify({
                    ...formData,
                    telefono: telefonoLimpio,
                    carrera_id: careerId
                }),
            });
            if (!res.ok) throw new Error('Error');
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ nombre_completo: '', email: '', telefono: '', mensaje: '', localidad_id: '' });
            }, 2000);
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card p-8 rounded-2xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-accent-foreground mb-1">Solicitar Información</h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Te asesoramos sobre: <span className="font-bold text-primary">{careerName}</span>
                </p>

                {status === 'success' ? (
                    <div className="text-center py-8">
                        <div className="inline-block p-3 bg-green-100 rounded-full mb-3">
                            <Check className="text-green-600" size={32} />
                        </div>
                        <p className="font-bold text-foreground">¡Datos enviados correctamente!</p>
                        <p className="text-sm text-muted-foreground mt-2">Un asesor te contactará pronto.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text" required placeholder="Nombre Completo"
                            className="w-full bg-muted border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                            value={formData.nombre_completo} onChange={e => setFormData({ ...formData, nombre_completo: e.target.value })}
                        />

                        <input
                            type="email" required placeholder="Email"
                            className="w-full bg-muted border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="tel" required placeholder="Teléfono"
                                className="w-full bg-muted border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                                value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                            />

                            <div className="relative">
                                <select
                                    required
                                    className="w-full bg-muted border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition appearance-none"
                                    value={formData.localidad_id}
                                    onChange={e => setFormData({ ...formData, localidad_id: e.target.value })}
                                    disabled={loadingLoc}
                                >
                                    <option value="">Localidad...</option>
                                    {loadingLoc ? (
                                        <option>Cargando...</option>
                                    ) : (
                                        localidades.map(loc => (
                                            <option key={loc.id} value={loc.id}>{loc.nombre}</option>
                                        ))
                                    )}
                                </select>
                                <MapPin size={16} className="absolute right-3 top-3.5 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        <textarea
                            placeholder="¿Alguna duda específica?" rows={3}
                            className="w-full bg-muted border border-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none"
                            value={formData.mensaje} onChange={e => setFormData({ ...formData, mensaje: e.target.value })}
                        />

                        {status === 'error' && (
                            <p className="text-red-500 text-sm text-center">Hubo un error al enviar. Intenta nuevamente.</p>
                        )}

                        <button
                            type="submit" disabled={status === 'loading'}
                            className="w-full bg-primary hover:opacity-90 text-white font-bold py-3 rounded-lg transition shadow-lg flex justify-center items-center gap-2 disabled:opacity-70"
                        >
                            {status === 'loading' ? <><Loader2 className="animate-spin" size={20} /> Enviando...</> : 'ENVIAR SOLICITUD'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
