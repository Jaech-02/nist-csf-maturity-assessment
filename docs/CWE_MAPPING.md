# Mapeo CWE — TTPSEC Asesor ANCI

Mapeo de Common Weakness Enumeration (CWE) relevantes al stack y funcionalidad del proyecto.

## Stack: Next.js (Static Export) + React + Client-Side Only

| CWE-ID | Nombre | Relevancia | Mitigacion Implementada | Estado |
|--------|--------|-----------|------------------------|--------|
| CWE-79 | Cross-site Scripting (XSS) | Alta — la app genera HTML dinamico y exporta informes HTML | React escapa JSX por defecto. Export HTML usa template literals sin input de usuario externo. No se procesan parametros URL. | Mitigado |
| CWE-116 | Improper Encoding or Escaping of Output | Media — export de informe HTML | Los valores del informe provienen de constantes internas (`data.ts`), no de input del usuario. Los scores son numericos calculados internamente. | Mitigado |
| CWE-200 | Exposure of Sensitive Information | Baja — no hay datos sensibles en la app | No se almacenan datos. No hay backend. No hay cookies ni localStorage. Meta tag `referrer: no-referrer`. | Mitigado |
| CWE-346 | Origin Validation Failure | Baja — static site sin API | No hay endpoints. No hay CORS. No hay fetch a servicios externos. | N/A |
| CWE-352 | Cross-Site Request Forgery (CSRF) | N/A — no hay formularios que envien datos a un servidor | Sin backend, sin formularios de envio, sin state server-side. | N/A |
| CWE-502 | Deserialization of Untrusted Data | N/A — no se deserializa data externa | No se usa `JSON.parse` con input externo. No se cargan datos de URLs o APIs. | N/A |
| CWE-829 | Inclusion of Functionality from Untrusted Control Sphere | Baja — dependencias npm | Dependencias minimas (Next.js, React, Tailwind). No se cargan scripts externos en runtime. No CDNs. | Mitigado |
| CWE-1104 | Use of Unmaintained Third-Party Components | Baja | Dependencias actualizadas. Next.js 16, React 19, Tailwind 4. Todas en versiones recientes. | Mitigado |
| CWE-922 | Insecure Storage of Sensitive Information | N/A | No se almacena informacion. Ni cookies, ni localStorage, ni sessionStorage, ni IndexedDB. | N/A |
| CWE-319 | Cleartext Transmission of Sensitive Information | Baja | GitHub Pages sirve via HTTPS obligatorio. No hay transmision de datos del usuario. | Mitigado |

## Relevancia por Control Evaluado

Los controles de seguridad evaluados por la herramienta cubren CWEs a nivel organizacional:

| Control ANCI | CWEs Relacionados |
|-------------|------------------|
| C0 - Gestion de Activos | CWE-1059 (Incomplete Documentation) |
| C1 - Patch Management | CWE-1104 (Unmaintained Components) |
| C2 - Security Awareness | CWE-254 (Security Features) |
| C3 - Least Privilege | CWE-269 (Improper Privilege Management), CWE-732 (Incorrect Permission) |
| C4 - Backups | CWE-257 (Storing Passwords in Recoverable Format) |
| C5 - Network Security | CWE-319 (Cleartext Transmission), CWE-923 (Improper Restriction of Communication Channel) |
| C6 - Endpoint Security | CWE-78 (OS Command Injection), CWE-94 (Code Injection) |
| C7 - Monitoring | CWE-778 (Insufficient Logging), CWE-223 (Omission of Security-relevant Information) |
| C8 - MFA | CWE-287 (Improper Authentication), CWE-308 (Use of Single-factor Authentication) |
| C9 - Password Manager | CWE-521 (Weak Password Requirements), CWE-798 (Use of Hard-coded Credentials) |

---

*Documento generado por TTPSEC — Actualizado: 2026-03-30*
