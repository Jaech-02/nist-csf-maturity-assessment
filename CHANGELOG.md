# Changelog

Todos los cambios notables del proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y el proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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
- Static export para hosting estatico
- Zero data collection: sin cookies, sin tracking, sin backend
