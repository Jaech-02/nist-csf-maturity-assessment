# PROMPT: Documentación Profesional de Repositorio GitHub

> **Uso:** Copia este prompt, reemplaza los bloques `[PLACEHOLDER]` con la info de tu proyecto, y pégalo en Claude o tu LLM preferido.

---

```
Actúa como un ingeniero de documentación técnica senior especializado en ciberseguridad y desarrollo seguro. Tu tarea es generar la documentación completa de un repositorio GitHub que debe quedar impecable, profesional y lista para auditoría.

## CONTEXTO DEL PROYECTO

- **Nombre del proyecto:** [NOMBRE_PROYECTO]
- **Descripción corta (1 línea):** [DESCRIPCION_CORTA]
- **Lenguaje/Stack principal:** [LENGUAJE — e.g. Rust, Python, Next.js, React]
- **Tipo de proyecto:** [CLI tool | Web app | API | Library | Dashboard | Agent]
- **Público objetivo:** [Pentesters | SOC analysts | GRC teams | Devs | Estudiantes]
- **Licencia:** [MIT | Apache-2.0 | GPL-3.0 | BSL-1.1 | Proprietary]
- **Autor/Organización:** [AUTOR — e.g. TTPSEC SpA / @ttpsecspa]
- **Estado actual:** [Alpha | Beta | Stable | PoC]

## CÓDIGO FUENTE / ESTRUCTURA

<code_or_tree>
[PEGA AQUÍ: el árbol de directorios (`tree -L 2`) o el código fuente relevante, o describe la arquitectura]
</code_or_tree>

## INSTRUCCIONES DE GENERACIÓN

Genera los siguientes archivos de documentación, cada uno en su propio bloque de código claramente delimitado:

---

### 1. README.md

Estructura obligatoria (en este orden exacto):

1. **Header visual**
   - Badge de licencia (shield.io)
   - Badge de lenguaje/versión
   - Badge de estado del build (placeholder si no hay CI)
   - Badge de OWASP compliance level
   - Línea en blanco + logo o banner si aplica

2. **Nombre + Tagline**
   - Nombre del proyecto en H1
   - Descripción de 1 línea en cursiva debajo
   - Tabla resumen: | Stack | Licencia | Estado | Última versión |

3. **Tabla de Contenidos**
   - TOC con links internos a cada sección

4. **Descripción**
   - Párrafo de 3-5 líneas explicando qué hace, para quién y por qué existe
   - Lista de features principales (máx 8 bullets)

5. **Arquitectura / Diagrama**
   - Diagrama ASCII o Mermaid del flujo principal
   - Descripción de componentes clave

6. **Requisitos Previos**
   - OS soportados
   - Dependencias del sistema (con versiones mínimas)
   - Variables de entorno requeridas (tabla: VARIABLE | Descripción | Requerida | Default)

7. **Instalación**
   - Paso a paso numerado, copy-paste ready
   - Incluir: clone, install deps, build, config
   - Bloque separado para Docker si aplica

8. **Uso / Quick Start**
   - Ejemplo mínimo funcional (el "hello world" del proyecto)
   - Comandos principales con explicación
   - Screenshots o ejemplos de output si es visual

9. **Configuración**
   - Archivo(s) de configuración con ejemplo completo comentado
   - Tabla de parámetros: Param | Tipo | Default | Descripción

10. **API / Funciones Documentadas**
    - Cada función/endpoint público documentado con:
      - Firma / Ruta
      - Parámetros (tabla)
      - Retorno / Response
      - Ejemplo de uso
      - Errores posibles

11. **Seguridad**
    - Sección `## Seguridad`
    - Modelo de amenazas resumido (qué protege, de qué)
    - CWE relevantes mapeados al proyecto (tabla: CWE-ID | Nombre | Mitigación implementada)
    - OWASP Top 10:2025 mapping (tabla: OWASP-ID | Categoría | Estado | Notas) — usar las 10 categorías vigentes: A01-A10:2025
    - Si es API: incluir también OWASP API Security Top 10:2023
    - Referencia a OWASP ASVS como estándar verificable complementario
    - Política de reporte de vulnerabilidades (link a SECURITY.md)
    - Hardening recommendations para deployment
    - SBOM (Software Bill of Materials) o referencia a generación de SBOM (relevante para A03:2025 Supply Chain)

12. **Testing**
    - Cómo ejecutar tests
    - Cobertura actual (si existe)
    - Tipos de test incluidos (unit, integration, security)

13. **Contribución**
    - Link a CONTRIBUTING.md
    - Resumen de estilo de código y convenciones

14. **Roadmap**
    - Próximas features planeadas (checklist)

15. **Licencia**
    - Statement corto + link al archivo LICENSE

16. **Contacto / Soporte**
    - Canales de soporte
    - Créditos y agradecimientos

---

### 2. SECURITY.md

Genera un archivo SECURITY.md profesional que incluya:

- Versiones soportadas con parches de seguridad (tabla)
- Proceso de reporte de vulnerabilidades (email, PGP key placeholder, timeline de respuesta)
- Política de disclosure (coordinated disclosure, 90 días)
- Alcance (qué está in-scope y qué no)
- Reconocimientos / Hall of Fame placeholder
- Referencia a CWE/CVE si aplica

---

### 3. CONTRIBUTING.md

- Requisitos para PRs
- Estilo de código (linter, formatter)
- Convención de commits (Conventional Commits)
- Proceso de revisión
- Código de conducta (referencia)

---

### 4. CHANGELOG.md

- Formato Keep a Changelog
- Sección inicial con la versión actual
- Categorías: Added, Changed, Deprecated, Removed, Fixed, Security

---

### 5. LICENSE

- Texto completo de la licencia indicada: [LICENCIA]
- Con año y titular correctos

---

### 6. .github/ISSUE_TEMPLATES/

Genera 3 templates:

- `bug_report.md` — reporte de bug con pasos para reproducir
- `feature_request.md` — solicitud de feature
- `security_vulnerability.md` — reporte de vulnerabilidad (con disclaimer de uso responsable)

---

### 7. Tabla de Mapeo CWE (archivo separado: `docs/CWE_MAPPING.md`)

Tabla completa con:
| CWE-ID | Nombre | Relevancia para este proyecto | Mitigación | Estado |
Incluir mínimo los CWE relevantes al stack:
- Si es web: CWE-79 (XSS), CWE-89 (SQLi), CWE-352 (CSRF), CWE-918 (SSRF), CWE-200 (Info Disclosure), CWE-287 (Auth), CWE-502 (Deserialization)
- Si es CLI/sistema: CWE-78 (OS Command Injection), CWE-22 (Path Traversal), CWE-732 (Permissions), CWE-798 (Hardcoded Credentials)
- Si es API: CWE-284 (Access Control), CWE-311 (Missing Encryption), CWE-346 (Origin Validation)
- Si es OT/ICS: CWE-319 (Cleartext Transmission), CWE-306 (Missing Auth), CWE-400 (Resource Exhaustion)

---

### 8. Tabla de Mapeo OWASP Top 10 (archivo separado: `docs/OWASP_MAPPING.md`)

Basado en **OWASP Top 10:2025** (versión vigente):
| ID | Categoría | Aplica? | Controles implementados | Pendiente |

Las 10 categorías obligatorias a evaluar son:
- A01:2025 — Broken Access Control
- A02:2025 — Security Misconfiguration
- A03:2025 — Software Supply Chain Failures
- A04:2025 — Cryptographic Failures
- A05:2025 — Injection
- A06:2025 — Insecure Design
- A07:2025 — Authentication Failures
- A08:2025 — Software or Data Integrity Failures
- A09:2025 — Security Logging and Alerting Failures
- A10:2025 — Mishandling of Exceptional Conditions

Notas para el mapeo:
- A06 (Insecure Design) no es testeable con herramientas; documentar decisiones de diseño seguro y threat modeling realizado
- A09 (Logging & Alerting) requiere evidencia de logging efectivo, no solo presencia de logs
- A03 (Supply Chain) mapear dependencias, SBOMs, y verificación de integridad
- A10 (Exceptional Conditions) documentar manejo de errores, fail-safe defaults, y edge cases

Si el proyecto es API, agregar también **OWASP API Security Top 10:2023**:
| ID | Categoría | Aplica? | Controles | Pendiente |

Nota adicional: El OWASP Top 10 es un documento de awareness (mínimo basal). Para un estándar verificable y testeable, referenciar también OWASP ASVS (Application Security Verification Standard) en la documentación del proyecto.

---

## REGLAS DE ESTILO

- Markdown limpio, sin HTML innecesario
- Código en bloques con lenguaje especificado (```bash, ```python, etc.)
- Tablas alineadas y legibles
- Links relativos dentro del repo (no absolutos)
- Todo en español LATAM excepto: nombres de archivos, código, y términos técnicos estándar (CWE, OWASP, CLI, API, etc.)
- Sin texto de relleno, cada línea debe aportar valor
- Los ejemplos de código deben ser funcionales, no pseudocódigo
- Consistencia total en formato y terminología
- UTF-8 con tildes y ñ correctas en todo el texto en español

## REGLAS DE SEGURIDAD EN DOCUMENTACIÓN

- NUNCA incluir credenciales reales, tokens, API keys, o secretos
- Usar placeholders explícitos: `YOUR_API_KEY_HERE`, `<TOKEN>`, `$ENV_VAR`
- No documentar vulnerabilidades activas no parchadas
- No incluir exploits funcionales en los ejemplos
- Los reportes de seguridad deben tener un canal privado, nunca issue público

## FILOSOFÍA DE COMPLIANCE OWASP

- El OWASP Top 10:2025 es un **documento de awareness** (bare minimum), NO un estándar completo
- Para un estándar verificable y testeable, referenciar siempre **OWASP ASVS**
- A06:2025 (Insecure Design) NO es testeable con herramientas — documentar threat modeling y decisiones de diseño seguro
- A09:2025 (Logging & Alerting) requiere evidencia de respuesta efectiva, no solo presencia de logs
- A03:2025 (Supply Chain) es nuevo en esta relevancia — documentar SBOMs, verificación de deps, lock files
- A10:2025 (Exceptional Conditions) — documentar manejo de errores, fail-safe, y edge cases
- Para madurez del programa AppSec, referenciar OWASP SAMM o DSOMM
- Los vendors de herramientas NO pueden cubrir el 100% del OWASP Top 10 — no claims de "full coverage"
```

---

## VARIANTE RÁPIDA (para proyectos pequeños)

Si el proyecto es un script, PoC o herramienta pequeña, usa esta versión reducida:

```
Documenta este proyecto GitHub de forma profesional y concisa.

**Proyecto:** [NOMBRE]
**Stack:** [LENGUAJE]
**Tipo:** [TIPO]
**Licencia:** [LICENCIA]

<codigo>
[PEGA CÓDIGO O TREE]
</codigo>

Genera:
1. README.md con: badges, descripción, requisitos, instalación paso a paso, uso con ejemplos, configuración, funciones documentadas, sección de seguridad con CWE/OWASP mapping, licencia
2. SECURITY.md con política de disclosure
3. LICENSE completa

Reglas: español LATAM, markdown limpio, sin relleno, ejemplos funcionales, sin credenciales reales, CWE y OWASP relevantes al stack, UTF-8 con tildes y ñ.
```

---

## TIPS DE USO

| Situación | Acción |
|---|---|
| Proyecto nuevo desde cero | Usa el prompt completo, pega el `tree` y los archivos principales |
| Proyecto existente sin docs | Pega el código fuente completo + el prompt completo |
| Actualizar docs existentes | Pega el README actual + código nuevo + pide "actualiza manteniendo estructura" |
| Solo necesitas el README | Usa la variante rápida |
| Múltiples repos a documentar | Usa la variante rápida en batch, uno por uno |

---

*Prompt creado por TTPSEC SpA — Documentación como código, seguridad por diseño.*
