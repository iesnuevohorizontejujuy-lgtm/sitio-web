<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Acceso institucional al CMS del IES Nuevo Horizonte.">

        <title>Administración · IES Nuevo Horizonte</title>

        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="min-h-screen bg-[#F4F8FB] font-sans text-[#173042] antialiased">
        <div class="min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.72fr)]">
            <main class="flex min-h-[72vh] flex-col px-6 py-7 sm:px-10 lg:min-h-screen lg:px-16 lg:py-10 xl:px-24">
                <header class="flex items-center justify-between gap-6 border-b border-[#C9D9E5] pb-6">
                    <a href="{{ route('home') }}" class="flex items-center gap-3" aria-label="Inicio del CMS IES Nuevo Horizonte">
                        <span class="grid size-11 place-items-center rounded-xl bg-[#0A496C] text-sm font-bold tracking-[0.08em] text-white">NH</span>
                        <span>
                            <span class="block text-sm font-semibold text-[#0A496C]">IES Nuevo Horizonte</span>
                            <span class="block text-xs text-[#647B8A]">Gestión institucional</span>
                        </span>
                    </a>

                    <span class="hidden items-center gap-2 text-xs font-medium text-[#526B7A] sm:flex">
                        <span class="size-2 rounded-full bg-[#2CBEE7]"></span>
                        Panel institucional
                    </span>
                </header>

                <section class="flex flex-1 flex-col justify-center py-14 lg:max-w-3xl lg:py-20">
                    <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#168DB0]">CMS institucional</p>
                    <h1 class="mt-5 max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#0A496C] sm:text-5xl xl:text-6xl">
                        La información del instituto, en un solo lugar.
                    </h1>
                    <p class="mt-7 max-w-2xl text-base leading-7 text-[#526B7A] sm:text-lg sm:leading-8">
                        Administrá la portada, carreras, noticias, avisos y consultas recibidas desde el sitio web del IES Nuevo Horizonte.
                    </p>

                    <div class="mt-9 flex flex-col gap-3 sm:flex-row">
                        <a href="{{ auth()->check() ? route('filament.panel.pages.dashboard') : route('filament.panel.auth.login') }}" class="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#0A496C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#073A57] focus:outline-none focus:ring-4 focus:ring-[#2CBEE7]/30">
                            {{ auth()->check() ? 'Ir al panel' : 'Ingresar al panel' }}
                            <svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>
                        <a href="{{ route('filament.panel.resources.consultas.index') }}" class="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#9DB8C9] bg-white px-6 py-3 text-sm font-semibold text-[#0A496C] transition hover:border-[#0A496C] hover:bg-[#EAF3F8] focus:outline-none focus:ring-4 focus:ring-[#2CBEE7]/25">
                            Ver consultas recibidas
                        </a>
                    </div>

                    <div class="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#C9D9E5] bg-[#C9D9E5] sm:grid-cols-2">
                        <a href="{{ route('filament.panel.resources.diapositiva-portadas.index') }}" class="group bg-white p-5 transition hover:bg-[#F1F8FB]">
                            <svg class="size-6 text-[#168DB0]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.7"/>
                                <path d="m6 16 4-4 3 3 2-2 3 3M8 8h.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span class="mt-4 block text-sm font-semibold text-[#0A496C]">Portada</span>
                            <span class="mt-1 block text-xs leading-5 text-[#647B8A]">Campañas del carrusel principal</span>
                        </a>

                        <a href="{{ route('filament.panel.resources.carreras.index') }}" class="group bg-white p-5 transition hover:bg-[#F1F8FB]">
                            <svg class="size-6 text-[#168DB0]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                                <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" stroke="currentColor" stroke-width="1.7"/>
                            </svg>
                            <span class="mt-4 block text-sm font-semibold text-[#0A496C]">Carreras</span>
                            <span class="mt-1 block text-xs leading-5 text-[#647B8A]">Oferta y planes de estudio</span>
                        </a>

                        <a href="{{ route('filament.panel.resources.noticias.index') }}" class="group bg-white p-5 transition hover:bg-[#F1F8FB]">
                            <svg class="size-6 text-[#168DB0]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M6 3h12v18H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" stroke="currentColor" stroke-width="1.7"/>
                                <path d="M8 8h6M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                            </svg>
                            <span class="mt-4 block text-sm font-semibold text-[#0A496C]">Noticias</span>
                            <span class="mt-1 block text-xs leading-5 text-[#647B8A]">Vida institucional</span>
                        </a>

                        <a href="{{ route('filament.panel.resources.aviso-sitios.index') }}" class="group bg-white p-5 transition hover:bg-[#F1F8FB]">
                            <svg class="size-6 text-[#168DB0]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path d="M12 3 3.8 7.5v9L12 21l8.2-4.5v-9L12 3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                                <path d="M12 8v5m0 3h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                            </svg>
                            <span class="mt-4 block text-sm font-semibold text-[#0A496C]">Avisos</span>
                            <span class="mt-1 block text-xs leading-5 text-[#647B8A]">Anuncios del sitio web</span>
                        </a>
                    </div>
                </section>

                <footer class="border-t border-[#C9D9E5] pt-5 text-xs leading-5 text-[#718694]">
                    Acceso reservado al personal autorizado del Instituto de Educación Superior Nuevo Horizonte.
                </footer>
            </main>

            <aside class="relative hidden overflow-hidden bg-[#073A57] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16" aria-label="Información del sistema">
                <div class="absolute inset-x-0 top-0 h-1 bg-[#2CBEE7]"></div>
                <div class="grid size-16 place-items-center rounded-2xl border border-white/20 bg-white/10">
                    <svg class="size-8 text-[#2CBEE7]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 10V7a7 7 0 0 1 14 0v3M4 10h16v11H4V10Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>
                        <path d="M12 14v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
                    </svg>
                </div>

                <div class="max-w-md">
                    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#76D8F1]">Gestión segura</p>
                    <h2 class="mt-5 text-3xl font-semibold leading-tight tracking-[-0.025em]">Contenido actualizado para una comunidad mejor informada.</h2>
                    <div class="mt-9 space-y-5 border-t border-white/15 pt-7 text-sm leading-6 text-white/70">
                        <p>Las consultas del sitio ingresan al panel para su seguimiento y respuesta por WhatsApp.</p>
                        <p>Las publicaciones realizadas aquí alimentan automáticamente las secciones públicas habilitadas.</p>
                    </div>
                </div>

                <p class="text-xs text-white/45">San Salvador de Jujuy · Argentina</p>
            </aside>
        </div>
    </body>
</html>
