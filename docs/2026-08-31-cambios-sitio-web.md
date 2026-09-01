# Cambios del Sitio Web Institucional al 31 de agosto de 2026

## Documentos relacionados

- [Seguridad y despliegue del sitio institucional](./2026-08-31-seguridad-y-despliegue.md)

## Alcance

Este documento registra el estado de los cambios del sitio web institucional que se integra con el backend del Sistema Académico para gestionar permisos de examen. El CMS propio del sitio no forma parte de la lógica académica ni de Mercado Pago.

## Formulario de permisos de examen

- El formulario consume el catálogo público del Sistema Académico a través de las rutas internas del sitio.
- Las carreras y materias continúan obteniéndose desde el backend académico.
- El turno es seleccionado por el alumno y se envía como parte de la solicitud del permiso.
- El selector admite la lista controlada proporcionada por el backend:
  - `Mañana`
  - `Tarde`
  - `Noche`
- Se aclara que debe seleccionarse el turno en el que el alumno cursa y no el horario del examen.
- El formulario exige un turno válido antes de iniciar el pago.
- El turno no se muestra en el comprobante individual descargable.
- Se mantiene la advertencia para completar correctamente nombre, apellido y demás datos personales.
- Se informa al alumno que debe esperar la redirección de Mercado Pago hacia el sitio para consultar y descargar el comprobante.

## Comunicación con los backends

- Las llamadas públicas del navegador se realizan mediante rutas internas de Next.js.
- Las rutas de permisos reenvían el cuerpo de la solicitud al Sistema Académico, incluyendo el campo `turno`.
- Se corrigieron los accesos a las API del CMS mediante rutas dedicadas para avisos y consultas.
- Las variables públicas y privadas de backend se mantienen separadas para evitar exponer secretos institucionales al navegador.

## Configuración y seguridad presentes en el entorno local

- El frontend utiliza salida `standalone` para su ejecución en Docker/Dokploy.
- Se prepararon encabezados de seguridad, política de contenido, protección de frames y restricciones para recursos remotos.
- Los hosts y recursos locales se habilitan solamente en desarrollo.
- Se preparó la configuración de proxies, hosts confiables y cookies del backend del CMS.
- Estos cambios deben revisarse junto con los dominios y variables reales antes de publicar.

## Verificaciones realizadas

- `npm run lint` finalizó correctamente.
- `npm run build` finalizó correctamente con Next.js 16.3.3.
- Se comprobó en navegador que el formulario muestra `Mañana`, `Tarde` y `Noche`.
- Se comprobó que el usuario pueda seleccionar `Noche` y que el valor permanezca seleccionado.
- El formulario conserva la integración con el flujo de redirección de Mercado Pago.

## Estado del repositorio al crear este documento

- La rama local `main` tiene el commit `6d6f6e1` por delante de `origin/main`, correspondiente a correcciones de acceso a las API.
- Existen cambios locales todavía no consolidados en Docker, configuración del CMS, seguridad de Next.js, dependencias y navegación del formulario.
- Este documento no implica que esos cambios locales hayan sido enviados al remoto.
- Antes de publicar se deben revisar y agrupar los cambios del sitio en commits identificables para no mezclar infraestructura, seguridad y funcionalidad del formulario sin trazabilidad.

## Variables requeridas para la integración

Los nombres concretos deben verificarse contra los archivos `.env.example` vigentes. Como mínimo, el despliegue debe definir:

- URL pública utilizada por el navegador para acceder a las rutas del sitio.
- URL privada del backend del Sistema Académico utilizada por las rutas internas de Next.js.
- Clave institucional compartida entre el sitio y el Sistema Académico.
- URL del backend del CMS para avisos, contenido y consultas.

Los secretos y claves privadas no deben utilizar el prefijo `NEXT_PUBLIC_`.

## Orden recomendado de despliegue

1. Confirmar que el backend académico desplegado devuelve los tres turnos.
2. Verificar las variables privadas del contenedor del sitio.
3. Ejecutar `npm run lint` y `npm run build` sobre el commit que se publicará.
4. Desplegar el sitio web después del backend académico.
5. Abrir el formulario y completar una solicitud de prueba.
6. Confirmar la redirección hacia Mercado Pago y el retorno al sitio.
7. Verificar que el comprobante pueda descargarse después de la aprobación.
