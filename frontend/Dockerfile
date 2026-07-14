# 1. Imagen base para instalar dependencias
FROM node:20-slim AS deps
WORKDIR /app

# Copiamos package.json y lockfile
COPY package.json package-lock.json* ./

# Instalamos dependencias y forzamos la instalación de binarios nativos de lightningcss (necesario para Tailwind v4 en Slim)
RUN npm ci && \
    npm rebuild lightningcss

# 2. Imagen para construir el proyecto (Builder)
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Deshabilitamos telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Argumentos de construcción
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL

# Ejecutamos el build
RUN npm run build

# 3. Imagen final para producción (Runner)
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

ARG BACKEND_URL
ENV BACKEND_URL=$BACKEND_URL

# Crear usuario y grupo para seguridad
RUN groupadd --system --gid 1001 nextjs && \
    useradd --system --uid 1001 --gid nextjs nextjs

# --- PERMISOS ---
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]