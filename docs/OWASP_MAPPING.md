# Mapeo OWASP Top 10:2025 — TTPSEC Asesor ANCI

> El OWASP Top 10 es un **documento de awareness** (mínimo basal), no un estándar completo.
> Para un estándar verificable y testeable, consultar [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/).
> Para madurez del programa AppSec, consultar [OWASP SAMM](https://owaspsamm.org/).

## OWASP Top 10:2025 — Aplicación Web (Static Export)

| ID | Categoría | Aplica? | Controles Implementados | Pendiente |
|----|-----------|---------|------------------------|-----------|
| A01:2025 | Broken Access Control | N/A | No hay autenticación, autorización, ni datos protegidos server-side. Static site 100% client-side sin backend. No hay endpoints, roles, ni sesiones. | — |
| A02:2025 | Security Misconfiguration | Bajo | Headers de seguridad: `referrer: no-referrer`, `theme-color`. Static export minimiza superficie de configuración. No hay servicios expuestos. No hay debug mode en producción. | Agregar CSP headers vía `_headers` en GitHub Pages. Revisar CORS si se agrega API futura. |
| A03:2025 | Software Supply Chain Failures | Bajo | Dependencias mínimas y actualizadas: Next.js 16, React 19, Tailwind 4. `package-lock.json` versionado. Sin dependencias de runtime adicionales. No se cargan scripts externos (CDNs, fonts, analytics). | Implementar generación de SBOM (CycloneDX o SPDX). Agregar `npm audit` en CI. Verificar integridad de dependencias con SRI para assets. |
| A04:2025 | Cryptographic Failures | N/A | No se almacenan ni transmiten datos sensibles. No hay cifrado requerido. HTTPS obligatorio vía GitHub Pages. No hay passwords, tokens, ni datos personales. | — |
| A05:2025 | Injection | Bajo | React escapa JSX automáticamente (prevención XSS por defecto). No hay SQL, LDAP, OS commands, ni SSRF. Export HTML usa template literals con datos de constantes internas, no input externo. No se procesan parámetros URL. | Revisar sanitización del export HTML en futuras versiones que acepten input dinámico. |
| A06:2025 | Insecure Design | N/A | **Decisiones de diseño seguro documentadas:** (1) Zero-trust: sin backend, sin storage, sin tracking. (2) Procesamiento 100% local. (3) Principio de mínimo privilegio por diseño. (4) No se requiere autenticación. (5) Datos nunca salen del navegador. **Nota:** A06 no es testeable con herramientas; se documenta el threat model y las decisiones de diseño. | — |
| A07:2025 | Authentication Failures | N/A | No hay autenticación. No hay sesiones. No hay credenciales. No hay MFA. No hay password recovery. La aplicación no requiere identidad del usuario. | — |
| A08:2025 | Software or Data Integrity Failures | Bajo | Static export desde source code versionado en Git. GitHub Pages sirve desde branch `gh-pages` con deploy controlado. No se usa CI/CD con secrets expuestos. No se deserializa data externa. | Agregar SRI (Subresource Integrity) para assets JS/CSS. Considerar firma de releases. |
| A09:2025 | Security Logging and Alerting Failures | N/A | No hay backend que monitorear. No se generan logs server-side. No hay eventos de seguridad que requieran alerting. **Nota:** A09 requiere evidencia de respuesta efectiva, no solo presencia de logs — en este caso no aplica por ausencia de servidor. | Si se agrega backend futuro, implementar logging estructurado con correlación y alerting. |
| A10:2025 | Mishandling of Exceptional Conditions | Bajo | Botones con `try/catch` para manejo de errores en export. `window.print()` con fallback. Cálculos de score con validación de divisor cero (`max > 0`). React error boundaries implícitas. | Agregar error boundary explícita para captura de errores de rendering. Documentar edge cases de export en navegadores legacy. |

## Resumen de Riesgo

| Nivel de Riesgo | Cantidad | Categorías |
|----------------|----------|-----------|
| N/A | 5 | A01, A04, A06, A07, A09 |
| Bajo | 5 | A02, A03, A05, A08, A10 |
| Medio | 0 | — |
| Alto | 0 | — |
| Crítico | 0 | — |

> La arquitectura 100% client-side (static export) reduce la superficie de ataque OWASP a niveles mínimos.
> Los riesgos residuales son: supply chain (dependencias npm), configuración de headers de seguridad en hosting, y manejo de condiciones excepcionales en export.

## Controles ANCI vs OWASP Top 10:2025

Cada control evaluado por la herramienta se relaciona con categorías OWASP:

| Control ANCI | OWASP 2025 Relacionado |
|-------------|----------------------|
| C0 - Gestión de Activos | A03 (Supply Chain — inventario de componentes) |
| C1 - Patch Management | A03 (Supply Chain — componentes desactualizados) |
| C2 - Security Awareness | A06 (Insecure Design — factor humano) |
| C3 - Least Privilege | A01 (Broken Access Control) |
| C4 - Backups | A08 (Data Integrity — recuperación) |
| C5 - Network Security | A02 (Misconfiguration), A04 (Cryptographic Failures) |
| C6 - Endpoint Security | A05 (Injection — protección de endpoints) |
| C7 - Monitoring | A09 (Logging & Alerting Failures) |
| C8 - MFA | A07 (Authentication Failures) |
| C9 - Password Manager | A07 (Authentication Failures) |

## Referencias

- [OWASP Top 10:2025](https://owasp.org/Top10/)
- [OWASP ASVS v4.0](https://owasp.org/www-project-application-security-verification-standard/) — estándar verificable
- [OWASP SAMM](https://owaspsamm.org/) — madurez del programa AppSec
- [CycloneDX SBOM](https://cyclonedx.org/) — Software Bill of Materials

---

*Documento generado por TTPSEC — Actualizado: 2026-03-31*
