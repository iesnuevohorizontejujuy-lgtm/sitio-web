import Image from 'next/image';
import { User, CreditCard, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function PerfilCard({ data }) {
    const alumno = data?.alumno || {};

    const campos = [
        { icon: CreditCard, label: 'DNI', valor: data?.dni || '-' },
        { icon: Mail, label: 'Email', valor: data?.email || '-' },
        { icon: Phone, label: 'Teléfono', valor: alumno.telefono || 'No registrado' },
        { icon: MapPin, label: 'Domicilio', valor: alumno.domicilio || 'No registrado' },
    ];

    return (
        <Card className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
            <div className="relative overflow-hidden border-b border-white/10 bg-primary text-primary-foreground dark:border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/90 dark:to-primary/80" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_24%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_22%)] dark:bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_18%)]" />

                <div className="relative px-5 py-6 md:px-8 md:py-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/30 bg-white/10 shadow-lg backdrop-blur-sm dark:border-white/15 dark:bg-white/5">
                            {data?.foto_perfil ? (
                                <Image
                                    src={data.foto_perfil}
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
                        </div>

                        <div className="min-w-0 text-primary-foreground">
                            <p className="text-sm font-medium text-primary-foreground/80">
                                Bienvenido al Campus Virtual
                            </p>

                            <h1 className="mt-1 text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                                {data?.nombre_completo || '—'}
                            </h1>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <Badge className="border border-white/20 bg-white/12 text-primary-foreground hover:bg-white/12 dark:border-white/15 dark:bg-white/8">
                                    Alumno regular
                                </Badge>

                                <span className="text-sm text-primary-foreground/75">
                                    Panel principal del alumno
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CardContent className="px-5 py-6 md:px-8">
                <div className="mb-4">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Información personal
                    </h2>
                </div>

                <Separator className="mb-6 bg-border/70" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {campos.map(({ icon: Icon, label, valor }) => (
                        <div
                            key={label}
                            className="rounded-2xl border border-border/70 bg-muted/40 p-4 transition hover:bg-muted/60"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                                    <Icon size={18} />
                                </div>

                                <div className="min-w-0">
                                    <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                        {label}
                                    </span>

                                    <span
                                        className="mt-1 block truncate text-sm font-semibold text-foreground md:text-[15px]"
                                        title={String(valor)}
                                    >
                                        {valor}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}