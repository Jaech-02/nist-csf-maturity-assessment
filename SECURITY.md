# Política de Seguridad

## Versiones Soportadas

| Versión | Soporte de Seguridad |
|---------|---------------------|
| 2.x | Parches activos |
| 1.x | Solo críticos |
| < 1.0 | Sin soporte |

## Reporte de Vulnerabilidades

Si descubres una vulnerabilidad de seguridad en este proyecto, por favor repórtala de forma responsable.

### Proceso

1. **No abras un issue público.** Los reportes de seguridad deben ser privados.
2. Envia un correo a: **security@ttpsec.ai**
3. Incluye en tu reporte:
   - Descripción de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencia de mitigación (si la tienes)
4. Recibirás un acuse de recibo dentro de **48 horas hábiles**.
5. Trabajaremos en un parche y coordinaremos la divulgación contigo.

### Timeline de Respuesta

| Etapa | Plazo |
|-------|-------|
| Acuse de recibo | 48 horas hábiles |
| Evaluación inicial | 5 días hábiles |
| Parche y release | 15-30 días hábiles |
| Divulgación pública | 90 días desde el reporte |

## Política de Disclosure

Seguimos una política de **Coordinated Disclosure** con un plazo máximo de **90 días** entre el reporte y la divulgación pública. Si el parche se publica antes, la divulgación puede adelantarse con acuerdo mutuo.

## Alcance

### In-Scope

- Vulnerabilidades en el código fuente de la aplicación
- XSS, inyección de código, o manipulación de la lógica client-side
- Problemas en la generación de informes (HTML export)
- Exposición no intencional de datos del usuario

### Out-of-Scope

- Vulnerabilidades en dependencias upstream (reportar directamente al proyecto afectado)
- Ataques que requieran acceso físico al dispositivo del usuario
- Ingeniería social contra usuarios de la herramienta
- Vulnerabilidades en el proveedor de hosting estatico (reportar al proveedor correspondiente)
- Denegación de servicio contra el hosting estático

## Consideraciones de Arquitectura

Esta aplicación es un **static site** 100% client-side:

- No existe backend ni API
- No se almacenan datos en el servidor
- No se usan cookies, localStorage ni sessionStorage
- No hay autenticación ni sesiones
- No hay base de datos
- Todo el procesamiento ocurre en el navegador del usuario

Esto reduce significativamente la superficie de ataque, pero no la elimina. Los vectores principales son:

- XSS via parámetros URL o manipulación del DOM
- Supply chain attacks via dependencias npm
- Manipulación del export HTML para inyección de contenido

## Reconocimientos

Agradecemos a los investigadores que reportan vulnerabilidades de forma responsable.

| Investigador | Fecha | Vulnerabilidad | Estado |
|-------------|-------|----------------|--------|
| — | — | Sin reportes hasta la fecha | — |

---

*TTPSEC — Seguridad por diseño*
