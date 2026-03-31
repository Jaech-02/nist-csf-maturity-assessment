# Politica de Seguridad

## Versiones Soportadas

| Version | Soporte de Seguridad |
|---------|---------------------|
| 2.x | Parches activos |
| 1.x | Solo criticos |
| < 1.0 | Sin soporte |

## Reporte de Vulnerabilidades

Si descubres una vulnerabilidad de seguridad en este proyecto, por favor reportala de forma responsable.

### Proceso

1. **No abras un issue publico.** Los reportes de seguridad deben ser privados.
2. Envia un correo a: **security@ttpsec.ai**
3. Incluye en tu reporte:
   - Descripcion de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencia de mitigacion (si la tienes)
4. Recibiras un acuse de recibo dentro de **48 horas habiles**.
5. Trabajaremos en un parche y coordinaremos la divulgacion contigo.

### Timeline de Respuesta

| Etapa | Plazo |
|-------|-------|
| Acuse de recibo | 48 horas habiles |
| Evaluacion inicial | 5 dias habiles |
| Parche y release | 15-30 dias habiles |
| Divulgacion publica | 90 dias desde el reporte |

## Politica de Disclosure

Seguimos una politica de **Coordinated Disclosure** con un plazo maximo de **90 dias** entre el reporte y la divulgacion publica. Si el parche se publica antes, la divulgacion puede adelantarse con acuerdo mutuo.

## Alcance

### In-Scope

- Vulnerabilidades en el codigo fuente de la aplicacion
- XSS, inyeccion de codigo, o manipulacion de la logica client-side
- Problemas en la generacion de informes (HTML export)
- Exposicion no intencional de datos del usuario

### Out-of-Scope

- Vulnerabilidades en dependencias upstream (reportar directamente al proyecto afectado)
- Ataques que requieran acceso fisico al dispositivo del usuario
- Ingenieria social contra usuarios de la herramienta
- Vulnerabilidades en GitHub Pages (reportar a GitHub)
- Denegacion de servicio contra el hosting estatico

## Consideraciones de Arquitectura

Esta aplicacion es un **static site** 100% client-side:

- No existe backend ni API
- No se almacenan datos en el servidor
- No se usan cookies, localStorage ni sessionStorage
- No hay autenticacion ni sesiones
- No hay base de datos
- Todo el procesamiento ocurre en el navegador del usuario

Esto reduce significativamente la superficie de ataque, pero no la elimina. Los vectores principales son:

- XSS via parametros URL o manipulacion del DOM
- Supply chain attacks via dependencias npm
- Manipulacion del export HTML para inyeccion de contenido

## Reconocimientos

Agradecemos a los investigadores que reportan vulnerabilidades de forma responsable.

| Investigador | Fecha | Vulnerabilidad | Estado |
|-------------|-------|----------------|--------|
| — | — | Sin reportes hasta la fecha | — |

---

*TTPSEC — Seguridad por diseno*
