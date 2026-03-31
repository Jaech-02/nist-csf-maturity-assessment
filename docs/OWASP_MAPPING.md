# Mapeo OWASP Top 10 — TTPSEC Asesor ANCI

## OWASP Top 10:2021 — Aplicación Web

| ID | Categoria | Aplica? | Controles Implementados | Pendiente |
|----|-----------|---------|------------------------|-----------|
| A01:2021 | Broken Access Control | No | No hay autenticación ni autorización. No hay datos protegidos server-side. Static site sin backend. | — |
| A02:2021 | Cryptographic Failures | No | No se almacenan ni transmiten datos sensibles. No hay cifrado requerido. HTTPS via GitHub Pages. | — |
| A03:2021 | Injection | Bajo | React escapa JSX automáticamente. No hay SQL, LDAP, ni OS commands. Export HTML usa templates con datos internos. | Revisar sanitización de export HTML en futuras versiones |
| A04:2021 | Insecure Design | No | Diseño zero-trust: sin backend, sin storage, sin tracking. Principio de mínimo privilegio por diseño. | — |
| A05:2021 | Security Misconfiguration | Bajo | Headers de seguridad: `referrer: no-referrer`, `theme-color`. Static export minimiza superficie. | Agregar CSP headers en GitHub Pages vía `_headers` |
| A06:2021 | Vulnerable and Outdated Components | Bajo | Dependencias mínimas y actualizadas: Next.js 16, React 19, Tailwind 4. Sin dependencias de runtime adicionales. | Mantener `npm audit` periódico |
| A07:2021 | Identification and Authentication Failures | N/A | No hay autenticación. No hay sesiones. No hay credenciales. | — |
| A08:2021 | Software and Data Integrity Failures | Bajo | Static export desde source code versionado. GitHub Pages serve desde branch protegido. | Agregar SRI (Subresource Integrity) para assets |
| A09:2021 | Security Logging and Monitoring Failures | N/A | No hay backend que monitorear. No se generan logs server-side. | — |
| A10:2021 | Server-Side Request Forgery (SSRF) | N/A | No hay servidor. No se hacen requests server-side. 100% client-side. | — |

## Resumen

| Nivel de Riesgo | Cantidad | Categorías |
|----------------|----------|-----------|
| N/A | 5 | A01, A07, A09, A10, A04 |
| Bajo | 4 | A03, A05, A06, A08 |
| Medio | 0 | — |
| Alto | 0 | — |
| Crítico | 0 | — |

> La arquitectura 100% client-side (static export) reduce la superficie de ataque OWASP a niveles mínimos. Los riesgos residuales son de tipo supply chain (dependencias npm) y configuración de headers de seguridad en el hosting.

## Controles ANCI vs OWASP

Cada control evaluado por la herramienta se relaciona con categorías OWASP:

| Control ANCI | OWASP Relacionado |
|-------------|------------------|
| C1 - Patch Management | A06 (Vulnerable Components) |
| C3 - Least Privilege | A01 (Broken Access Control) |
| C5 - Network Security | A02 (Cryptographic Failures), A05 (Misconfiguration) |
| C7 - Monitoring | A09 (Logging Failures) |
| C8 - MFA | A07 (Authentication Failures) |
| C9 - Password Manager | A07 (Authentication Failures) |

---

*Documento generado por TTPSEC — Actualizado: 2026-03-30*
