import Image from 'next/image';
import { User, Camera, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function UsernameForm({
    fileInputRef,
    fotoPerfilPreview,
    fotoPerfilFile,
    onFotoPerfilChange,
    onSelectFotoPerfil,
    nombreCompleto,
    dni,
    email,
    onSubmit,
    loadingUsername,
}) {
    return (
        <>
            <div className="relative overflow-hidden border-b border-white/10 bg-primary text-primary-foreground dark:border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/90 dark:to-primary/80" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_24%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_22%)] dark:bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_18%)]" />

                <div className="relative px-5 py-6 md:px-8 md:py-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div
                                onClick={onSelectFotoPerfil}
                                className="group relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/30 bg-white/10 shadow-lg backdrop-blur-sm dark:border-white/15 dark:bg-white/5"
                            >
                                {fotoPerfilPreview ? (
                                    <Image
                                        src={fotoPerfilPreview}
                                        alt="Foto de perfil"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-primary-foreground/90">
                                        <User size={40} />
                                    </div>
                                )}

                                <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                    <Camera size={20} className="text-white" />
                                </div>
                            </div>

                            <div className="min-w-0 text-primary-foreground">
                                <p className="text-sm font-medium text-primary-foreground/80">
                                    Configuracion De Perfil
                                </p>

                                <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                                    {nombreCompleto}
                                </h1>

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <Badge className="border border-white/20 bg-white/12 text-primary-foreground hover:bg-white/12 dark:border-white/15 dark:bg-white/8">
                                        DNI: {dni || '-'}
                                    </Badge>

                                    <Badge className="border border-white/20 bg-white/12 text-primary-foreground hover:bg-white/12 dark:border-white/15 dark:bg-white/8">
                                        Email: {email || '-'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {fotoPerfilFile && (
                            <form onSubmit={onSubmit} className="flex flex-col items-end gap-2">
                                <Button
                                    type="submit"
                                    disabled={loadingUsername}
                                   className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-400 disabled:hover:bg-gray-400"
                                >
                                    {loadingUsername ? (
                                        <Loader2 size={16} className="mr-2 animate-spin" />
                                    ) : (
                                        <Save size={16} className="mr-2" />
                                    )}
                                    {loadingUsername ? 'Guardando...' : 'Guardar foto'}
                                </Button>
                                
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFotoPerfilChange}
            />
        </>
    );
}