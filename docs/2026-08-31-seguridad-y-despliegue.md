# Seguridad y despliegue del sitio institucional

Fecha de actualización: 31 de agosto de 2026.

## Objetivo

Este documento registra el endurecimiento de seguridad aplicado al frontend institucional y al CMS de Laravel/Filament. Los cambios buscan proteger los formularios públicos, las sesiones del panel administrativo, las imágenes remotas y el funcionamiento detrás del proxy de Dokploy.

La integración con el Sistema de Gestión Académica y Mercado Pago conserva su flujo actual.

## Cambios en el frontend

### Dependencias actualizadas

- Next.js se actualizó a `16.3.3`.
- `eslint-config-next` se actualizó a `16.3.3`.
- PostCSS se actualizó a `8.5.23`.
- Sharp se actualizó a `0.35.4`.
- Nano ID se actualizó a `3.3.18`.
- El audit de dependencias de producción finalizó sin vulnerabilidades conocidas.

### Encabezados de seguridad

La configuración de Next.js incorpora:

- `Content-Security-Policy` para limitar scripts, imágenes, conexiones, iframes y otros recursos.
- `Strict-Transport-Security` en producción.
- `X-Content-Type-Options: nosniff`.
- `X-Frame-Options: DENY`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` con cámara, micrófono, geolocalización y temas de navegación deshabilitados.
- Ocultamiento del encabezado que identifica a Next.js.

La política permite los recursos institucionales necesarios de:

- El CMS del instituto.
- Instagram.
- Google Maps.
- YouTube.
- Vimeo.

### Protección del optimizador de imágenes

- En producción solamente se admiten imágenes remotas desde hosts expresamente autorizados.
- `localhost` y `127.0.0.1` quedan habilitados únicamente durante el desarrollo.
- Se deshabilitaron las redirecciones del optimizador de imágenes.
- Se estableció un tamaño máximo de respuesta de 10 MB.
- El acceso a direcciones IP locales mediante el optimizador queda deshabilitado en producción.

### Formularios y navegación

- Avisos y consultas utilizan rutas internas de Next.js para evitar que el navegador intente conectarse a `127.0.0.1:8000` en producción.
- La navegación interna del formulario de permisos usa el router de Next.js.
- Las llamadas de permisos de examen se mantienen bajo `/api/permisos-examen`.

## Cambios en el CMS Laravel/Filament

### Proxies confiables

Se reemplazó la confianza abierta en cualquier proxy por una lista de redes privadas aptas para Docker y Dokploy:

```env
TRUSTED_PROXIES=127.0.0.1,::1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

Esto permite que Laravel reconozca correctamente HTTPS detrás del proxy, pero evita aceptar encabezados reenviados desde cualquier origen.

### Validación de hosts

La validación `TrustHosts` de Laravel se retiró porque rechazaba con código `400` el chequeo interno que Dokploy realiza contra `127.0.0.1`. Esto provocaba que un contenedor con Nginx y PHP-FPM funcionando fuera marcado como no saludable y terminara respondiendo `502 Bad Gateway` desde el proxy.

El dominio público continúa restringido por la configuración de Traefik de Dokploy, que publica únicamente `sitio.cms.iesnuevohorizonte.com` sobre el puerto `80` del contenedor. Las demás medidas de seguridad permanecen activas.

### Cookies de sesión

El contenedor de producción utiliza:

```env
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
```

- `Secure` hace que la cookie se envíe únicamente mediante HTTPS.
- `HttpOnly` impide que JavaScript pueda leer la cookie de sesión.
- `SameSite=Lax` reduce solicitudes cruzadas no deseadas y permite el regreso desde una navegación externa, como Mercado Pago.

En desarrollo local `SESSION_SECURE_COOKIE` puede permanecer en `false` cuando se utiliza HTTP.

### Configuración de Nginx

Nginx incorpora:

- Ocultamiento de la versión del servidor.
- HSTS durante un año, incluyendo subdominios.
- Protección contra interpretación incorrecta de tipos MIME.
- Protección contra inclusión del panel dentro de iframes externos.
- Restricción de cámara, micrófono y geolocalización.
- Bloqueo de ejecución de archivos PHP dentro de `/storage`.

### Dependencias PHP actualizadas

- Guzzle se actualizó de `7.12.3` a `7.15.5`.
- League CommonMark se actualizó de `2.8.2` a `2.10.0`.
- También se actualizaron sus dependencias compatibles relacionadas.
- `composer audit --locked --no-dev` no informó vulnerabilidades conocidas.

## Compatibilidad con Mercado Pago

Los cambios no alteran la creación del permiso ni la pasarela de pago:

1. El frontend envía la solicitud a `/api/permisos-examen`.
2. El sistema devuelve `init_point` y el identificador del permiso.
3. El navegador abre la URL recibida mediante `window.location.assign(paymentUrl)`.
4. Mercado Pago procesa el pago.
5. El alumno debe esperar la redirección de regreso al sitio institucional.

La política de contenido no bloquea la navegación hacia una URL externa. Además, `SameSite=Lax` es compatible con el retorno del usuario mediante una navegación principal.

## Variables recomendadas en Dokploy

El CMS debe contar, como mínimo, con:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://sitio.cms.iesnuevohorizonte.com
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
TRUSTED_PROXIES=127.0.0.1,::1,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
```

Las variables definidas directamente en Dokploy prevalecen sobre los valores incluidos en el Dockerfile. Después de modificarlas se debe reconstruir la aplicación, no solamente reiniciar el contenedor.

El chequeo interno se conecta directamente a `127.0.0.1:80/up`. La aplicación acepta este endpoint sin aplicar una lista de hosts de Laravel, evitando falsos estados no saludables.

## Verificaciones realizadas

- Formato de PHP aprobado mediante Pint.
- `composer.json` validado.
- Audit de Composer sin vulnerabilidades conocidas.
- Suite completa del backend: 38 pruebas aprobadas y 225 aserciones.
- Suite específica de configuración: 4 pruebas aprobadas y 16 aserciones.
- Lint del frontend aprobado.
- Compilación de producción del frontend aprobada con Next.js `16.3.3`.
- Audit de dependencias de producción del frontend sin vulnerabilidades conocidas.

La construcción final de la imagen Docker no se ejecutó localmente porque el daemon de Docker no estaba iniciado. El Dockerfile ejecuta `nginx -t` y `php-fpm -tt` durante la construcción, por lo que un problema de sintaxis detendrá automáticamente el despliegue en Dokploy.

## Lista de comprobación posterior al despliegue

1. Abrir `https://sitio.cms.iesnuevohorizonte.com/up` y confirmar una respuesta correcta.
2. Ingresar al panel de Filament y comprobar que la sesión se mantenga al navegar.
3. Cerrar sesión y confirmar que el panel vuelva a solicitar credenciales.
4. Crear una consulta desde el sitio institucional y comprobar su recepción en el CMS.
5. Abrir una carrera y verificar la carga de portada y galería.
6. Completar un permiso de examen de prueba sin finalizar un pago real.
7. Confirmar que la redirección generada apunte al dominio oficial de Mercado Pago.
8. Revisar la consola del navegador y los logs del frontend, CMS y Sistema Académico.
9. Confirmar que no aparezcan llamadas del navegador hacia `127.0.0.1` o `localhost`.

## Archivos modificados

### Frontend

- `frontend/next.config.ts`
- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/src/components/institutional/ExamPermitForm.tsx`

### Backend

- `backend/.env.example`
- `backend/Dockerfile`
- `backend/bootstrap/app.php`
- `backend/composer.lock`
- `backend/config/session.php`
- `backend/docker/nginx`
- `backend/tests/Feature/ExampleTest.php`
