# Changelog

Todos los cambios notables del proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y el proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [2.5.1] - 2026-04-25

### Added

- **Resultados** (`page.tsx`): panel grafico por control seleccionado (chips C0-C9) con analisis descriptivo (frecuencias, cobertura respondida, promedio 0-2, estado dominante y riesgo visible).
- **Exportacion Excel por checklist** (`page.tsx`): nuevo boton **Exportar Excel (Checklist)** que genera `.xlsx` por hojas (`C0` a `C9`) con recomendaciones por subcategoria y columna de checklist.
- **Exportacion Excel de cuestionario** (`page.tsx`): nuevo boton **Exportar Excel (Cuestionario vacio)** con el mismo esquema por hojas (`C0` a `C9`) para levantamiento manual.
- Dependencia `xlsx` en `anci-advisor/package.json` para generar archivos Excel nativos.

### Changed

- **Reportes HTML/PDF** (`page.tsx`): cada control incluye grafico de barras por estado (`Si`, `Parcial`, `No`, `Sin respuesta`) y conteos; en PDF se asegura render correcto con grafico SVG en cada tarjeta de control.
- **Excel checklist** (`page.tsx`): estructura ordenada por hojas; recomendaciones en filas separadas; merge visual de columnas base (`Control`, `Categoria`, `Subcategoria`, `Pregunta`, `Respuesta`) cuando hay multiples recomendaciones; columna `Checklist` simplificada a `x` (implementado) o vacio.
- **Excel cuestionario vacio** (`page.tsx`): mismo formato visual del checklist (anchos de columna, filtros, encabezado congelado y hojas por control), sin columnas de `Respuesta` ni `Recomendaciones`.

### Removed
- Recomendaciones detalladas en la vista de resultados y en el informe HTML/PDF (modal/bloques de orientacion por subcategoria): el flujo de correccion se centraliza en el archivo Excel checklist exportado.

## [2.5] - 2026-04-24

### Added
- `anci-advisor/src/app/_components/`: cabecera (`SiteHeader`), barra de navegacion (`SiteNavigation`) y pie (`SiteFooter`) extraidos de `page.tsx`, con `index.ts` de reexportacion.
- `anci-advisor/src/lib/csf-catalog.ts`: campo opcional **`outcomeEs`** (Outcome del Core en español por subcategoria) y, donde aplica, referencia de **pagina del PDF** (`page`, p. ej. texto `pag21` en la primera fila de ejemplo en la UI). Tabla **Core NIST CSF completo**: columna **Outcome (ES)**; columna **pdf** con enlace al PDF NIST.CSWP.29; referencia de pagina en texto (no enlace) segun fila.
- `anci-advisor/src/lib/nist-links.ts`: URLs **`NIST_CSF_CSWP29_PDF_URL`** y **`NIST_CSF_CSWP29_FINAL_URL`** (PDF y ficha CSRC de NIST.CSWP.29).
- **Resultados** (`page.tsx`): bloque de texto sobre proposito de la herramienta (autoevaluacion de madurez frente a Outcomes del Core, limites frente a NIST/auditoria, marco de referencia) y mencion de **ERM** con expansion a *Enterprise Risk Management* y gestion integral de riesgos empresariales.
- **Pie de sitio** (`site-footer.tsx`): aviso corto (plataforma de evaluacion de madurez, uso de autoevaluacion, no sustituye evaluaciones formales ni documentacion oficial NIST), integrado en el footer con una sola linea separadora (`border-zinc-100`), **encima** de la linea de copyright (`©` / version).

### Changed
- **Legibilidad / UX**: ajustes de tamano de texto en bloques puntuales (p. ej. listas de la seccion de dimensiones del instrumento en inicio: cuerpo de items con `text-sm`); revision de copy en flujos de lectura.
- **LICENSE** (raiz): avisos de copyright / identificacion alineados al producto y al upstream **ANCI / TTPSEC** (segun el contenido vigente del archivo).

### Removed
- Texto tipo *«herramienta educativa y no sustituye al PDF de NIST»* en el sentido de aviso duplicado: el mensaje de limites queda en el bloque de Resultados y en el **disclaimer** del pie (sin repetir la formula anterior del PDF como unico sustituto del aviso legal).

## [2.4] - 2026-04-12

### Added
- `anci-advisor/src/lib/site.ts`: URL publica (`NEXT_PUBLIC_SITE_URL`) y prefijo de assets opcional (`NEXT_PUBLIC_BASE_PATH`) en tiempo de build; fallback **https://nistcsf.uptlibre.pe** para desarrollo local; constante **UPTLIBRE_PORTAL_URL** (**https://www.uptlibre.pe**) para el portal del grupo de investigacion.
- `anci-advisor/src/lib/nist-links.ts`: `NIST_CSF_INFORMATIVE_REFERENCES_URL` hacia [CSF 2.0 Informative References](https://www.nist.gov/cyberframework/informative-references) (referencia declarada para el texto de orientacion: seccion *Download CSF 2.0 Informative Reference in the Core*).
- `anci-advisor/src/lib/governance-record.ts` y formulario **Registro de gobierno** en inicio: institucion, alcance, responsable, tipo de medicion, referencia a politica/plan, notas; persistencia en `localStorage`; resumen en resultados e inclusion en informe HTML si hay datos; boton **Eliminar registro** (`clearGovernanceRecord`) con confirmacion.
- `anci-advisor/src/lib/answers-session.ts`: persistencia de **respuestas del cuestionario** en `localStorage` entre recargas (F5); solo se limpian con **Nueva evaluacion** (no al recargar la pagina).
- Modal de orientacion en resultados (`page.tsx`): aviso de que la referencia es ese material NIST; enlace al dominio anterior; modal con clase `no-print` para no tapar la impresion.
- Enlaces **UPTLIBRE** al portal del grupo: cabecera (debajo del titulo del producto), navegacion en vistas distintas de Inicio (junto a **Nueva evaluacion** y **Core CSF**), pie de pagina (bloque con Grupo de Investigacion "Libertad y Pensamiento", Facultad de Ingenieria — UPT) y boton flotante inferior derecha (`no-print`). En la barra de **Inicio** no se muestran UPTLIBRE ni Nueva evaluacion en la fila compacta del nav.
- Impresion / PDF desde resultados: listeners `beforeprint` / `afterprint` y `matchMedia("print")` para expandir todas las tarjetas de control; `flushSync` para actualizar el DOM antes del dialogo de impresion; texto **Pregunta** por subcategoria; recomendaciones del catalogo en bloque solo impresion cuando aplica; clase `print-card-header` para mantener visibles los titulos de tarjeta pese a ocultar botones; `globals.css` sin `* { break-inside: avoid }` global y reglas `.results-detail-scroll` / `.print-question-block`.
- `data.ts`: `answersMapEqual`, `overallBlockAveragePercentFromAnswers` (madurez global como promedio de los diez bloques, alineado con Resultados e informe HTML).
- Dependencia de desarrollo `@types/react-dom` (import de `flushSync` desde `react-dom`).
- `globals.css`: cursor `pointer` en `button:not(:disabled)` y `label`; `not-allowed` en `button:disabled`.

### Changed
- Marca **uptlibre**, evaluador **NIST CSF 2.0**: enlaces y textos publicos alineados al dominio **nistcsf.uptlibre.pe** (compartir en redes, OG/metadata, pie de pagina, informe HTML exportado); codigo en **github.com/Jaech-02/nist-csf-maturity-assessment**; app en carpeta **anci-advisor**. (El release inicial **1.0** del 2026-03-29 y el refocus NIST en **2.2** siguen documentados mas abajo; las entradas **[1.0]/[1.1]** de abril 2026 que duplicaban eso fueron retiradas.)
- `layout.tsx`: **Open Graph** y **Twitter Card** usan **`logo_uptlibre.png`** (PNG) en lugar de `og-image.svg`; muchas redes (Facebook, LinkedIn, WhatsApp, etc.) no muestran **SVG** en `og:image`. Ruta de imagen respecto a `ASSET_BASE_PATH`; dimensiones declaradas 1684×495; `metadataBase` sin barra final duplicada en la URL del sitio.
- `Dockerfile` y `.github/workflows/docker-publish.yml`: `NEXT_PUBLIC_SITE_URL` como build-arg para la imagen de produccion.
- README y `docs/NIST_CSF_MAPPING.md`: sitio, rutas de codigo y estructura del repo actualizados.
- `tsconfig.json`: alias `@/*` sin `baseUrl` ni `ignoreDeprecations` (compatibilidad TypeScript 6).
- Numeracion de producto **2.4** en `src/lib/version.ts` y `package.json`.
- Resultados (`page.tsx`): orientacion del catalogo (ejemplos) como recomendacion solo si la respuesta es **No** o **Parcial**; boton **Ver recomendacion** abre el modal; misma logica en informe HTML exportado.
- Resultados: la orientacion por subcategoria ya no se expande en la lista en pantalla; se abre en un panel modal (hoja inferior en movil, dialogo centrado en escritorio; Escape, clic fuera o *Cerrar*). Bloqueo de scroll del documento mientras el modal esta abierto.
- Informe HTML exportado: orientacion del catalogo dentro de `<details>` colapsable por subcategoria para reducir longitud visual del archivo; bloque de registro de gobierno cuando corresponde.
- Identidad visible: lema **Libertad y Pensamiento** sustituye a la frase anterior "Software para el bien comun" (pie y bloque de resultados).
- **Nueva evaluacion**: boton movido del pie de Resultados a la **barra de navegacion** (solo cuando no esta en Inicio); reinicia respuestas, tarjetas abiertas y vuelve al inicio.
- **Seguimiento** (`snapshots.ts`): metrica global usa `overallBlockAveragePercentFromAnswers` para coincidir con Resultados (antes un agregado ponderado podia diferir en un punto porcentual).
- Pantalla **Seguimiento**: estado de la sesion actual (coincide con ultimo guardado / cambios sin guardar / sin historial) segun `answersMapEqual` con la ultima medicion; texto de ayuda del registro de gobierno menciona impresion y PDF.

### Fixed
- Vista previa social: imagen Open Graph y Twitter visibles al usar **PNG** publico en lugar de SVG.

### Removed
- Seccion de inicio **Apoyo al Core NIST** / **Como el Core se reparte en las preguntas** y componente `CoreFacetsInQuestionnaireTable` (tabla tecnica de facetas del Core en el cuestionario); nota al pie de la pantalla **Core CSF** actualizada para no citar esa tabla.
- Entradas de changelog duplicadas **[1.0]** / **[1.1]** (abril 2026) que repetian o contradecian la linea **2.x** y la **1.x** historica; su contenido util queda resumido arriba.
- Enlaces a **LinkedIn** en compartir (se mantienen X, Facebook y WhatsApp donde apliquen).
- Import de `COVERAGE_DIMENSIONS_META` en `page.tsx` al retirar la tabla de facetas (el objeto permanece en `data.ts` por si se reutiliza).
- Funcion previa `overallPercentFromAnswers` en `data.ts` (sustituida por el promedio por bloques para coherencia de UI).

## [2.3] - 2026-04-06

### Added
- `anci-advisor/Dockerfile`: build multi-stage (Node `npm run build` static export + `nginx:alpine` sirviendo `out/`)
- `anci-advisor/nginx.conf` y `.dockerignore`
- `.github/workflows/docker-publish.yml`: GitHub Actions publica en Docker Hub (`DOCKERHUB_USERNAME/nist-csf-maturity-assessment`, tags `latest` y `sha-*`); build-arg `NEXT_PUBLIC_SITE_URL` fijado en el workflow
- `deploy/docker-compose.example.yml`: plantilla de despliegue detras de **jwilder/nginx-proxy**; `deploy/docker-compose.yml` ignorado en git (copia local desde el example)

### Changed
- `layout.tsx`: `openGraph.url` alineada a `NEXT_PUBLIC_SITE_URL` en build o dominio de produccion por defecto (`https://nistcsf.uptlibre.pe`)
- `README` / `SECURITY.md`: despliegue sin `.env`; documentacion de despliegue con dominio e imagen Docker Hub concretos; reportes de seguridad genericos

### Removed
- `deploy/env.example` (despliegue directo, sin `.env` en VPS)

## [2.2] - 2026-04-05

### Added
- `docs/NIST_CSF_MAPPING.md`: tabla de mapeo alineada a `anci-advisor/src/lib/data.ts`, con leyenda y columna de fundamento por control (`mappingWhy`)
- Campo `mappingWhy` en `nistCsf` (`data.ts`): fundamento por control en tabla Mapeo NIST, resultados, informe HTML exportado y bloque desplegable en cada pantalla de preguntas

### Changed
- Mapeo NIST CSF 2.0 alineado al nucleo oficial: PR.AA (acceso/autenticacion), PR.PS, PR.IR; subcategorias con formato ID.AM-01, PR.AA-05, etc.
- C1 asociado a ID.RA + PR.PS; C5 a PR.IR; C9 a PR.AA-01 (credenciales)
- Documentacion reducida al tema del repo: eliminados plantillas LLM, guia de estilos generica, OWASP/CWE separados y CONTRIBUTING duplicado; README y `NIST_CSF_MAPPING.md` quedan como referencia principal
- `layout.tsx`: funcion `resolveMetadataBase()` para `metadataBase` estable (env vacio o URL invalida no rompen el build)
- `LICENSE`: copyright del upstream [ttpsecspa/ANCI](https://github.com/ttpsecspa/ANCI) (2026 TTPSEC SPA)
- `README`: seccion Procedencia con enlace explicito al repositorio base

### Fixed
- CTA "Comenzar Evaluacion": capas del hero con `z-[45]` y fondos decorativos con `pointer-events-none` para que el clic no lo intercepte la barra de navegacion (`z-40`)

### Removed
- `docs/PROMPT-DOCUMENTACION-REPO.md`, `TTPSEC-STYLE-GUIDE.md`, `docs/OWASP_MAPPING.md`, `docs/CWE_MAPPING.md`, `CONTRIBUTING.md`
- Carpeta `.github/` (plantillas de issues; no requeridas para la app)

## [2.1] - 2026-03-30

### Added
- Responsive mobile optimizado: header compacto (51px), hero adaptativo, context buttons flex
- Framework chips ocultos en mobile para limpieza visual
- Badge único "100% Privado" en mobile header

### Changed
- Nav stepper: pills más pequeñas en mobile (w-7 h-7)
- Context buttons: flex-1 adaptable, descripciones ocultas en mobile
- Social share: gaps más compactos en mobile

## [2.0] - 2026-03-30

### Added
- Nav minimalista en Home: `Inicio | 10 Controles | Mapping`
- Nav completa con stepper numérico solo durante evaluación
- Números de control con bordes, estados de color, efecto scale en activo

### Changed
- Nav oculta en pantalla Home para limpiar la portada

## [1.9] - 2026-03-30

### Changed
- Nav bar rediseñada: fondo dark, botones numerados compactos, progress bar cyan
- Separador visual antes de Resultados/Mapping

## [1.8] - 2026-03-30

### Added
- Footer dark profesional con 3 columnas: Brand, Marcos, Links
- Sistema de versionado en `src/lib/version.ts`
- Badge de versión `v1.8` y fecha en footer
- Links a MIT License y GitHub en footer
- Bottom bar con copyright y metadata

## [1.7] - 2026-03-30

### Added
- Portada profesional dark hero con gradiente slate-900 a indigo-950
- Animaciones CSS: fade-in-up, pulse-glow, float, shimmer
- Grid pattern overlay tipo circuit board
- Título gradient cyan-to-indigo
- Glass badges y framework chips
- CTA con pulse-glow animado
- Shimmer bar decorativo

## [1.6] - 2026-03-30

### Added
- Licencia MIT en footer, export HTML, y meta tag `<link rel="license">`
- Archivo LICENSE en raíz del repo

## [1.5] - 2026-03-30

### Changed
- Footer rediseñado: badges como pills, frameworks como chips mono, MIT clickable
- Logo TTPSEC real en header, hero y footer

## [1.4] - 2026-03-30

### Changed
- Disclaimer actualizado: "Plataforma académica y educativa"
- Texto legal: "no está afiliado, asociado ni respaldado"
- Actualizado en 3 ubicaciones: inicio, resultados, export HTML

## [1.3] - 2026-03-29

### Fixed
- Botón duplicado "Exportar PDF" eliminado (había 2, ahora 1)
- Botones type="button" con try/catch para robustez
- Botón "Exportar PDF" usa `window.print()`

## [1.2] - 2026-03-29

### Added
- Botones de compartir en redes sociales (LinkedIn, X, Facebook, WhatsApp)
- Tabla de Mapping de controles vs marcos internacionales
- Botón "Recomendar en LinkedIn" en footer
- Botón "Exportar PDF (Imprimir)" en resultados
- Tab "Mapping" en navegación
- Imagen OG para redes sociales

### Changed
- Disclaimer: "Aviso importante - no es herramienta oficial"
- UTF-8 corregido en todos los textos con tildes

## [1.0] - 2026-03-29

### Added
- Release inicial: 10 controles de ciberseguridad
- 3 contextos organizacionales: TI, OT, Infraestructura Crítica
- Preguntas ponderadas por control
- Score de madurez global y por control
- Recomendaciones contextualizadas por nivel
- Mapeo a 8 marcos internacionales
- Exportación de informe HTML
- Diseño responsive con Tailwind CSS
- Static export para GitHub Pages
- Zero data collection: sin cookies, sin tracking, sin backend
