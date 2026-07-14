'use client';

import { useActionState } from 'react';
import Image from 'next/image';
import { loginAction } from './actions';
import { Loader2, Lock, User, AlertCircle } from 'lucide-react';

export default function CampusLogin() {
    // useActionState maneja el estado del Server Action.
    // Si loginAction es exitoso, redirect() se ejecuta en el server
    // y Next.js redirige automáticamente — no necesitamos router.push().
    const [state, formAction, isPending] = useActionState(loginAction, undefined);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/herosection.webp"
                    fill
                    alt="Background"
                    className="object-cover opacity-20 blur-sm"
                    unoptimized
                    priority
                />
            </div>

            <div className="relative z-10 w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header Login */}
                <div className="bg-primary p-8 text-center border-b-4 border-primary">
                    <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">CAMPUS VIRTUAL</h1>
                    <p className="text-white text-sm font-bold uppercase tracking-widest">IES Nuevo Horizonte</p>
                </div>

                <div className="p-8">
                    {state?.error && (
                        <div className="mb-6 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 p-4 flex items-center gap-3 rounded-r">
                            <AlertCircle className="text-red-500 shrink-0" size={20} />
                            <p className="text-sm text-red-700 dark:text-red-400 font-medium">{state.error}</p>
                        </div>
                    )}

                    <form action={formAction} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">Correo Electrónico</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition text-foreground"
                                    placeholder="usuario@ejemplo.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition text-foreground"
                                    placeholder="Ingresa tu DNI"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 text-right">
                                * Tu contraseña inicial es tu número de DNI.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-primary hover:opacity-90 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg hover:shadow-xl flex justify-center items-center gap-2 transform active:scale-95"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Ingresando...</span>
                                </>
                            ) : 'INGRESAR AL CAMPUS'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border text-center">
                        <a href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent-foreground transition font-medium">
                            ← Volver al sitio web institucional
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 text-center w-full z-10 opacity-50">
                <p className="text-xs text-muted-foreground">Artinnex &copy; {new Date().getFullYear()} IESNH</p>
            </div>
        </div>
    );
}