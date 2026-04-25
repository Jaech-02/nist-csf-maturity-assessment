[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![NIST CSF](https://img.shields.io/badge/NIST-CSF%202.0-1e40af)](https://www.nist.gov/cyberframework)

# Evaluador de madurez NIST CSF 2.0

Aplicacion web estatica para **autoevaluacion de madurez** alineada al **Core del NIST Cybersecurity Framework (CSF) 2.0** ([NIST.CSWP.29](https://doi.org/10.6028/NIST.CSWP.29), febrero 2024). Incluye las **106 subcategorias oficiales** del Anexo A, agrupadas en **10 fases** de cuestionario (una pregunta por subcategoria).

**Sitio de referencia** (proyecto base ANCI / TTPSEC): [https://ttpsecspa.github.io/ANCI/](https://ttpsecspa.github.io/ANCI/).  
**Despliegue publico** (esta linea NIST CSF 2.0): [https://nistcsf.uptlibre.pe](https://nistcsf.uptlibre.pe) (en build Docker/CI: `NEXT_PUBLIC_SITE_URL`; fallback en `anci-advisor/src/lib/site.ts`).  
**Repositorio:** [github.com/Jaech-02/nist-csf-maturity-assessment](https://github.com/Jaech-02/nist-csf-maturity-assessment) (la app Next.js esta en la carpeta `anci-advisor`).

---

## Tabla de contenidos

- [Uso / Quick Start](#uso--quick-start)
- [Flujo de la aplicacion](#flujo-de-la-aplicacion)
- [Controles evaluados (10 fases)](#controles-evaluados-10-fases)
- [Niveles de madurez](#niveles-de-madurez)
- [Marco de referencia](#marco-de-referencia)
- [Seguridad](#seguridad)
- [Caracteristicas](#caracteristicas)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Instalacion, build y fuente normativa](#instalacion-y-desarrollo)

---

## Uso / Quick Start

1. Clona el repositorio y entra a la carpeta de la app:
   ```bash
   git clone https://github.com/Jaech-02/nist-csf-maturity-assessment.git
   cd nist-csf-maturity-assessment/anci-advisor
   npm install
   ```
2. Arranca en desarrollo: `npm run dev` → abre [http://localhost:3000](http://localhost:3000).
3. Recorre las **10 fases**; en cada una responde **Si / Parcial / No** por cada subcategoria.
4. En **Resultados** revisa el porcentaje global y por fase; descarga **informe HTML** o imprime a **PDF**.

Build estatico (produccion local): desde `anci-advisor`, `npm run build` → salida en `out/`.

---

## Flujo de la aplicacion

```
┌──────────┐     ┌─────────────────────┐     ┌────────────┐
│  INICIO  │────>│ 10 FASES (106 preg.) │────>│ RESULTADOS │
│  (Hero)  │     │  GV→ID→PR→DE→RS→RC   │     │ + informe  │
└──────────┘     └─────────────────────┘     └────────────┘
                          │
                          v
                 ┌─────────────────┐
                 │  TABLA CORE     │
                 │  106 subcats.   │
                 └─────────────────┘
```

- **Inicio:** presentacion, badges de privacidad, enlace a la tabla completa del Core (`Core CSF` en la navegacion cuando avanzas).
- **Fases:** cada fase agrupa un subconjunto de subcategorias; la puntuacion de la fase es media ponderada de sus items.
- **Resultados:** recomendaciones segun umbral de madurez; nota breve sobre contexto organizacional del Core (p. ej. GV.OC); detalle por subcategoria al expandir cada fase.

---

## Controles evaluados (10 fases)

Cada fila es una **fase** del cuestionario; el numero entre parentesis es la cantidad de **subcategorias** NIST en esa fase.

| Fase | Titulo | Alcance (resumen) |
|------|--------|-------------------|
| 1 | Gobernanza: contexto y estrategia de riesgo | GV.OC y GV.RM (12) |
| 2 | Gobernanza: roles, politica y supervision | GV.RR, GV.PO y GV.OV (9) |
| 3 | Gobernanza: cadena de suministro | GV.SC (10) |
| 4 | Identificar: activos y mejora | ID.AM e ID.IM (11) |
| 5 | Identificar: evaluacion de riesgos | ID.RA (10) |
| 6 | Proteger: identidad, datos y concientizacion | PR.AA, PR.AT y PR.DS (12) |
| 7 | Proteger: plataformas e infraestructura | PR.PS y PR.IR (10) |
| 8 | Detectar: monitoreo y analisis | DE.CM y DE.AE (11) |
| 9 | Responder: gestion y mitigacion de incidentes | RS.MA, RS.AN, RS.CO y RS.MI (13) |
| 10 | Recuperar: ejecucion y comunicacion | RC.RP y RC.CO (8) |

**Total:** 106 subcategorias (IDs como `GV.OC-01`, `ID.AM-07`, etc.). La numeracion con huecos es la del estandar NIST.

**Base metodologica (10 controles C0–C9) y alineacion a NIST CSF 2.0, mas puente a las fases de la app:** [docs/NIST_CSF_MAPPING.md](./docs/NIST_CSF_MAPPING.md)

---

## Niveles de madurez

La app calcula un **porcentaje por fase** (0–100) y un **promedio global**. Cada porcentaje se clasifica asi:

| Rango % | Etiqueta | Significado operativo |
|---------|----------|------------------------|
| 0 – 25 | Critico | Acciones inmediatas en las subcategorias peor puntuadas. |
| 26 – 50 | Bajo | Brechas amplias frente al resultado esperado del Core en esa fase. |
| 51 – 75 | Medio | Base instalada; falta estandarizar y documentar evidencia. |
| 76 – 100 | Alto | Mantener, auditar y alinear con perfiles y Tiers CSF. |

Las **recomendaciones** mostradas (bajo/medio/alto de accion) dependen del tramo de puntuacion de cada fase (en codigo: critico/bajo usa tramo `low`, etc.).

---

## Marco de referencia

| Marco | Version | Uso en la herramienta |
|-------|---------|------------------------|
| **NIST Cybersecurity Framework (CSF)** | **2.0** (NIST.CSWP.29, 2024) | Unico marco: **Core** (6 funciones, categorias y **106 subcategorias** del Anexo A). |

No se integran otros marcos (ISO 27001, CIS, etc.) en esta version del producto.

---

## Seguridad

- **Sin backend:** export estatico (`output: "export"`); la logica corre en el navegador.
- **Sin recoleccion de datos:** no hay envio de respuestas a servidor; no hay cookies ni analitica en la app.
- **CSP-friendly:** sin dependencias externas en runtime cargadas por CDN.
- **Referrer:** `no-referrer` en metadata (ver `layout.tsx`).
- **Alcance:** herramienta educativa; **no** sustituye auditoria formal ni afiliacion con NIST.

---

## Caracteristicas

- 106 subcategorias Core con **outcome** oficial (EN) y pregunta operativa (ES) en codigo sin acentos.
- Tabla **Core completo** en la UI con todas las filas del catalogo.
- Export **HTML** del informe y **impresion a PDF** desde el navegador.
- Version y fecha del producto en `src/lib/version.ts` (actual **2.4**; historial en `CHANGELOG.md`).

---

## Estructura del repositorio

```
anci-advisor/                 # app Next.js (export estatico)
├── src/
│   ├── app/                  # UI (page.tsx, layout.tsx)
│   └── lib/
│       ├── csf-catalog.ts    # 106 items + metadatos de fases
│       ├── data.ts           # fases, niveles de madurez, VD/VI auxiliares
│       ├── site.ts           # URL publica y prefijo de assets (env en build Docker)
│       └── version.ts
├── Dockerfile
├── next.config.ts
└── public/
```

---

## Instalacion y desarrollo

**Requisitos:** Node.js 20+ (recomendado), npm.

```bash
git clone https://github.com/Jaech-02/nist-csf-maturity-assessment.git
cd nist-csf-maturity-assessment/anci-advisor
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Build estatico y Docker

```bash
cd anci-advisor
npm run build
```

Salida en `anci-advisor/out/`. Para imagen nginx + publicacion en Docker Hub, ver `anci-advisor/Dockerfile` y `.github/workflows/docker-publish.yml`. La URL publica en metadatos y compartir se define con `NEXT_PUBLIC_SITE_URL` en ese build (ver `src/lib/site.ts`).

### Fuente normativa

- National Institute of Standards and Technology (2024). *The NIST Cybersecurity Framework (CSF) 2.0.* NIST CSWP 29. [https://doi.org/10.6028/NIST.CSWP.29](https://doi.org/10.6028/NIST.CSWP.29)

La numeracion de subcategorias **no es consecutiva** (huecos propios del estandar).

### Catalogo CSF en codigo

Las **106 subcategorias** y metadatos de fases viven en `anci-advisor/src/lib/csf-catalog.ts` (y la logica de preguntas en `data.ts`). Si cambias criterios, actualiza esos archivos y la tabla en `docs/NIST_CSF_MAPPING.md`.

---

## Licencia

MIT — ver [LICENSE](./LICENSE).

---

## Contacto

[uptlibre](https://www.uptlibre.pe)   
Sitio de referencia del fork: [Asesor ANCI (TTPSEC)](https://ttpsecspa.github.io/ANCI/).
