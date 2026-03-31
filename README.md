[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Estado](https://img.shields.io/badge/Estado-Stable-brightgreen)]()
[![OWASP](https://img.shields.io/badge/OWASP-Compliant-blue)]()
[![Version](https://img.shields.io/badge/v2.1-2026--03--30-blue)]()

# TTPSEC Asesor ANCI

*Evaluador anonimo de madurez en ciberseguridad basado en los 9 Basicos de la ANCI + Control 0: Gestion de Activos*

| Stack | Licencia | Estado | Version | Deploy |
|-------|----------|--------|---------|--------|
| Next.js 16 + React 19 + Tailwind 4 | MIT | Stable | v2.1 | [GitHub Pages](https://ttpsecspa.github.io/ANCI/) |

---

## Tabla de Contenidos

- [Descripcion](#-descripcion)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalacion](#-instalacion)
- [Uso / Quick Start](#-uso--quick-start)
- [Configuracion](#-configuracion)
- [Controles Evaluados](#-controles-evaluados)
- [Marcos de Referencia](#-marcos-de-referencia)
- [Seguridad](#-seguridad)
- [Testing](#-testing)
- [Contribucion](#-contribucion)
- [Roadmap](#-roadmap)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## Descripcion

TTPSEC Asesor ANCI es una herramienta web de evaluacion de madurez en ciberseguridad, alineada a los **9 Basicos de la Ciberseguridad** definidos por la Agencia Nacional de Ciberseguridad (ANCI) de Chile, mas un **Control 0: Gestion de Activos** como base habilitante.

Disenada para organizaciones de cualquier tamano y sector (TI, OT, Infraestructura Critica), la herramienta genera recomendaciones mapeadas a marcos internacionales sin almacenar ni transmitir datos fuera del navegador del usuario.

**Features principales:**

- 100% anonimo: sin registro, sin cookies, sin analytics, sin tracking
- Procesamiento 100% local en el navegador (client-side only)
- 10 controles de seguridad con preguntas ponderadas
- 3 contextos organizacionales: TI Corporativo, OT/ICS, Infraestructura Critica
- Recomendaciones por nivel de madurez (critico, bajo, medio, alto)
- Mapeo completo a ISO 27001, NIST CSF 2.0, NIST 800-53, CIS v8.1, ISA/IEC 62443, NERC CIP
- Tabla de mapping interactiva con todos los marcos
- Exportacion de informe HTML y PDF (imprimir)

---

## Arquitectura

```
anci-advisor/
├── public/
│   ├── logo-ttpsec.png        # Logo TTPSEC
│   ├── og-image.svg           # Imagen para redes sociales (1200x630)
│   ├── favicon.svg            # Icono del navegador
│   └── site.webmanifest       # Manifest PWA
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind + animaciones + print styles
│   │   ├── layout.tsx         # Metadata SEO, OpenGraph, estructura HTML
│   │   └── page.tsx           # SPA principal (todas las pantallas)
│   └── lib/
│       ├── data.ts            # Controles, preguntas, frameworks, maturity levels
│       └── version.ts         # Version y fecha de la app
├── next.config.ts             # Static export + basePath GitHub Pages
├── package.json
└── tsconfig.json
```

### Flujo de la aplicacion

```
┌──────────┐     ┌───────────┐     ┌──────────────┐     ┌────────────┐
│  INICIO  │────>│ CONTEXTO  │────>│  PREGUNTAS   │────>│ RESULTADOS │
│  (Hero)  │     │ TI/OT/IC  │     │  C0..C9 (10) │     │  + Informe │
└──────────┘     └───────────┘     └──────────────┘     └────────────┘
                                          │
                                          v
                                   ┌──────────────┐
                                   │   MAPPING    │
                                   │  ISO/NIST/CIS│
                                   └──────────────┘
```

**Componentes clave:**

| Componente | Archivo | Descripcion |
|------------|---------|-------------|
| `Home` | `page.tsx` | Componente principal SPA con state management |
| `QuestionScreen` | `page.tsx` | Pantalla de preguntas por control |
| `Results` | `page.tsx` | Vista de resultados con score circular SVG |
| `CONTROLS` | `data.ts` | Definicion de 10 controles con preguntas y pesos |
| `exportReport` | `page.tsx` | Generador de informe HTML descargable |

---

## Requisitos Previos

| Requisito | Version Minima | Notas |
|-----------|---------------|-------|
| Node.js | 18+ | Recomendado: 20 LTS o superior |
| npm | 9+ | Incluido con Node.js |
| Git | 2.0+ | Para clonar el repositorio |

**Sistemas operativos soportados:** Windows, macOS, Linux

**Variables de entorno:**

| Variable | Descripcion | Requerida | Default |
|----------|-------------|-----------|---------|
| `NODE_ENV` | Entorno de ejecucion | No | `development` |

> No se requieren API keys, tokens, ni servicios externos. Todo funciona localmente.

---

## Instalacion

```bash
# 1. Clonar el repositorio
git clone https://github.com/ttpsecspa/ANCI.git
cd ANCI/anci-advisor

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

### Build de produccion

```bash
# Generar static export
npm run build

# Los archivos quedan en ./out/
# Listos para servir con cualquier servidor estatico
```

### Deploy a GitHub Pages

```bash
# El proyecto usa static export con basePath "/ANCI"
# Los archivos de ./out/ se copian a la rama gh-pages
```

---

## Uso / Quick Start

1. Abre [https://ttpsecspa.github.io/ANCI/](https://ttpsecspa.github.io/ANCI/)
2. Selecciona tu **contexto organizacional**: TI Corporativo, OT/ICS, o Infraestructura Critica
3. Haz clic en **Comenzar Evaluacion**
4. Responde las preguntas de cada control (Si implementado / Parcialmente / No implementado)
5. Al finalizar los 10 controles, obtendras:
   - Score de madurez global (0-100%)
   - Score por control individual
   - Recomendaciones contextualizadas
   - Mapeo a marcos internacionales
6. Exporta tu informe como **HTML** o **PDF** (imprimir)

### Niveles de madurez

| Nivel | Rango | Significado |
|-------|-------|-------------|
| Critico | 0-25% | Exposicion critica. Acciones inmediatas requeridas |
| Bajo | 26-50% | Brechas significativas. Priorizar controles base |
| Medio | 51-75% | Fundamentos establecidos. Fortalecer implementacion |
| Alto | 76-100% | Madurez alta. Mantener y mejorar continuamente |

---

## Configuracion

### `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  output: "export",           // Static export (sin servidor)
  basePath: "/ANCI",          // Ruta base para GitHub Pages
  assetPrefix: "/ANCI/",     // Prefijo de assets
  images: {
    unoptimized: true,        // Requerido para static export
  },
};
```

### `src/lib/version.ts`

```typescript
export const APP_VERSION = "2.1";    // Incrementar en cada deploy
export const APP_DATE = "2026-03-30"; // Fecha del ultimo deploy
export const APP_NAME = "TTPSEC Asesor ANCI";
```

---

## Controles Evaluados

| # | Control | Objetivo | MITRE ATT&CK |
|---|---------|----------|--------------|
| C0 | Gestion de Activos | Inventario y gobierno de activos | T1595, T1590 |
| C1 | Actualizar Periodicamente | Gestion de vulnerabilidades | T1190, T1068, T1210 |
| C2 | Capacitar Periodicamente | Reduccion del riesgo humano | T1566, T1204 |
| C3 | Minimizar Privilegios | Control de accesos | T1078, T1068, T1055 |
| C4 | Respaldar Informacion | Continuidad operativa | T1486, T1490, T1485 |
| C5 | Asegurar Redes | Proteccion de comunicaciones | T1021, T1046, T1018 |
| C6 | Asegurar Equipos | Proteccion de activos | T1059, T1547, T1053 |
| C7 | Monitorear en Tiempo Real | Deteccion temprana | T1071, T1041, T1562 |
| C8 | Uso de MFA | Autenticacion robusta | T1078, T1556, T1110 |
| C9 | Gestor de Contrasenas | Gestion de credenciales | T1555, T1003, T1110 |

---

## Marcos de Referencia

| Marco | Version | Uso en la herramienta |
|-------|---------|----------------------|
| ISO/IEC 27001 | 2022 | Mapeo de controles A.x |
| ISO/IEC 27002 | 2022 | Controles detallados |
| ISO/IEC 27035 | 2023 | Gestion de incidentes |
| NIST CSF | 2.0 (2024) | Funciones PR, DE, RC |
| NIST 800-53 | Rev. 5 | Controles federales |
| CIS Controls | v8.1 | Controles CIS 1-18 |
| ISA/IEC 62443 | 2018-2023 | Seguridad industrial OT |
| NERC CIP | 2023 | Regulacion sector electrico |
| SCF | 2024 | Capa de normalizacion |
| MITRE ATT&CK | v15+ | Tecnicas de ataque |

---

## Seguridad

### Modelo de seguridad

- **Zero Data Collection**: ningun dato sale del navegador del usuario
- **No Backend**: la aplicacion es 100% client-side (static export)
- **No Cookies**: no se usan cookies, localStorage, ni sessionStorage
- **No Analytics**: no hay scripts de tracking, GA, ni pixel
- **No Dependencies externas en runtime**: no se cargan CDNs, fonts externas, ni APIs
- **CSP Ready**: compatible con Content-Security-Policy restrictiva
- **Referrer Policy**: `no-referrer` configurado en meta tags

### OWASP / CWE

Consulta los documentos detallados:
- [docs/OWASP_MAPPING.md](./docs/OWASP_MAPPING.md) — OWASP Top 10:2021 mapping
- [docs/CWE_MAPPING.md](./docs/CWE_MAPPING.md) — CWE mapping relevante

### Reporte de vulnerabilidades

Consulta [SECURITY.md](./SECURITY.md) para el proceso de reporte de vulnerabilidades.

---

## Testing

```bash
# Verificar build de produccion
npm run build

# Verificar que el export estatico funciona
npx serve out/
```

La verificacion se realiza mediante:
- Build de produccion exitoso
- Preview visual en navegador
- Validacion de funcionalidad de botones (exportar, imprimir, nueva evaluacion)
- Verificacion responsive (mobile/tablet/desktop)

---

## Contribucion

Consulta [CONTRIBUTING.md](./CONTRIBUTING.md) para las guias de contribucion.

**Resumen rapido:**
1. Fork del repositorio
2. Crea un branch (`git checkout -b feature/mi-feature`)
3. Commit con Conventional Commits (`feat: descripcion`)
4. Push y Pull Request

---

## Roadmap

- [x] 10 controles con preguntas ponderadas
- [x] 3 contextos organizacionales
- [x] Exportacion HTML y PDF
- [x] Tabla de mapping interactiva
- [x] Portada profesional dark hero
- [x] Footer con version y fecha
- [x] Responsive mobile optimizado
- [ ] Modo dark completo
- [ ] Exportacion a Excel/CSV
- [ ] Comparativa entre evaluaciones (localStorage opcional)
- [ ] Idioma ingles
- [ ] PWA offline mode

---

## Licencia

Distribuido bajo la licencia **MIT**. Ver [LICENSE](./LICENSE) para mas informacion.

---

## Contacto

| Canal | Enlace |
|-------|--------|
| Web | [www.ttpsec.ai](https://www.ttpsec.ai) |
| Web CL | [www.ttpsec.cl](https://www.ttpsec.cl) |
| GitHub | [@ttpsecspa](https://github.com/ttpsecspa) |
| LinkedIn | [TTPSEC](https://www.linkedin.com/company/ttpsec) |

### Disclaimer

> **Plataforma academica y educativa.** Este sitio no esta afiliado, asociado ni respaldado por ningun ente gubernamental, la ANCI, ni el Gobierno de Chile. No reemplaza una auditoria formal de ciberseguridad ni constituye asesoria legal.

---

*TTPSEC — Software para el bien comun*
