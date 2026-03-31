# Changelog

Todos los cambios notables del proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y el proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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
