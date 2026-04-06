[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Estado](https://img.shields.io/badge/Estado-Stable-brightgreen)]()
[![Version](https://img.shields.io/badge/v2.3-2026--04--08-blue)]()

# TTPSEC Asesor ANCI

*Evaluador anónimo de madurez en ciberseguridad basado en los 9 Básicos de la ANCI + Control 0: Gestión de Activos*

| Stack | Licencia | Estado | Versión |
|-------|----------|--------|---------|
| Next.js 16 + React 19 + Tailwind 4 | MIT | Stable | v2.3 |

---

## Tabla de Contenidos

- [Descripción](#-descripcion)
- [Arquitectura](#-arquitectura)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalacion)
- [Uso / Quick Start](#-uso--quick-start)
- [Configuración](#-configuracion)
- [Controles Evaluados](#-controles-evaluados)
- [Marco de referencia](#marco-de-referencia)
- [Por que encaja cada control en el NIST CSF 2.0](#por-que-encaja-cada-control-en-el-nist-csf-20)
- [Seguridad](#-seguridad)
- [Testing](#-testing)
- [Despliegue Docker y VPS](#despliegue-docker-y-vps)
- [Contribución](#-contribucion)
- [Roadmap](#-roadmap)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## Descripción

TTPSEC Asesor ANCI es una herramienta web de evaluación de madurez en ciberseguridad, alineada a los **9 Básicos de la Ciberseguridad** definidos por la Agencia Nacional de Ciberseguridad (ANCI) de Chile, más un **Control 0: Gestión de Activos** como base habilitante.

Diseñada para organizaciones de cualquier tamaño y sector (TI, OT, Infraestructura Crítica), la herramienta genera recomendaciones mapeadas a **NIST CSF 2.0** sin almacenar ni transmitir datos fuera del navegador del usuario.

**Features principales:**

- 100% anónimo: sin registro, sin cookies, sin analytics, sin tracking
- Procesamiento 100% local en el navegador (client-side only)
- 10 controles de seguridad con preguntas ponderadas
- 3 contextos organizacionales: TI Corporativo, OT/ICS, Infraestructura Crítica
- Recomendaciones por nivel de madurez (crítico, bajo, medio, alto)
- Mapeo a **NIST CSF 2.0** (funcion/categoria y ejemplo de subcategoria por control)
- Tabla de mapping interactiva ANCI → NIST CSF 2.0
- Exportación de informe HTML y PDF (imprimir)

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
│       ├── data.ts            # Controles, preguntas, mapeo NIST CSF 2.0, maturity levels
│       └── version.ts         # Versión y fecha de la app
├── next.config.ts             # Static export (sin basePath)
├── package.json
└── tsconfig.json
```

### Flujo de la aplicación

```
┌──────────┐     ┌───────────┐     ┌──────────────┐     ┌────────────┐
│  INICIO  │────>│ CONTEXTO  │────>│  PREGUNTAS   │────>│ RESULTADOS │
│  (Hero)  │     │ TI/OT/IC  │     │  C0..C9 (10) │     │  + Informe │
└──────────┘     └───────────┘     └──────────────┘     └────────────┘
                                          │
                                          v
                                   ┌──────────────┐
                                   │   MAPPING    │
                                   │  NIST CSF 2.0│
                                   └──────────────┘
```

**Componentes clave:**

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| `Home` | `page.tsx` | Componente principal SPA con state management |
| `QuestionScreen` | `page.tsx` | Pantalla de preguntas por control |
| `Results` | `page.tsx` | Vista de resultados con score circular SVG |
| `CONTROLS` | `data.ts` | Definición de 10 controles con preguntas y pesos |
| `exportReport` | `page.tsx` | Generador de informe HTML descargable |

---

## Requisitos Previos

| Requisito | Versión Mínima | Notas |
|-----------|---------------|-------|
| Node.js | 18+ | Recomendado: 20 LTS o superior |
| npm | 9+ | Incluido con Node.js |
| Git | 2.0+ | Para clonar el repositorio |

**Sistemas operativos soportados:** Windows, macOS, Linux

**Variables de entorno:** no se usan archivos `.env` en el despliegue. La URL publica (HTTPS) para metadatos Open Graph esta fijada en el `Dockerfile` (ARG) y en `.github/workflows/docker-publish.yml` (build-arg), ambos con el dominio de produccion. Para cambiar el dominio hay que editar esos archivos y volver a construir la imagen.

> No se requieren API keys, tokens, ni servicios externos. Todo el procesamiento de la evaluacion ocurre en el navegador del usuario. La URL para compartir en redes se toma del navegador (`window.location`).

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jaech-02/nist-csf-maturity-assessment.git
cd nist-csf-maturity-assessment/anci-advisor

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

### Build de producción

```bash
# Generar static export
npm run build

# Los archivos quedan en ./out/
# Listos para servir con cualquier servidor estático
```

## Uso / Quick Start

1. Ejecuta `npm run dev` y abre `http://localhost:3000`, o sirve la carpeta `out/` tras `npm run build` con cualquier hosting estatico.
2. Selecciona tu **contexto organizacional**: TI Corporativo, OT/ICS, o Infraestructura Crítica
3. Haz clic en **Comenzar Evaluación**
4. Responde las preguntas de cada control (Si implementado / Parcialmente / No implementado)
5. Al finalizar los 10 controles, obtendrás:
   - Score de madurez global (0-100%)
   - Score por control individual
   - Recomendaciones contextualizadas
   - Mapeo a NIST CSF 2.0
6. Exporta tu informe como **HTML** o **PDF** (imprimir)

### Niveles de madurez

| Nivel | Rango | Significado |
|-------|-------|-------------|
| Crítico | 0-25% | Exposición crítica. Acciones inmediatas requeridas |
| Bajo | 26-50% | Brechas significativas. Priorizar controles base |
| Medio | 51-75% | Fundamentos establecidos. Fortalecer implementación |
| Alto | 76-100% | Madurez alta. Mantener y mejorar continuamente |

---

## Configuración

### `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  output: "export",           // Static export (sin servidor)
  images: {
    unoptimized: true,        // Requerido para static export
  },
};
```

### `src/lib/version.ts`

```typescript
export const APP_VERSION = "2.3";    // Incrementar en cada deploy
export const APP_DATE = "2026-04-06"; // Fecha del último deploy
export const APP_NAME = "TTPSEC Asesor ANCI";
```

---

## Despliegue Docker y VPS

Publicacion automatica con **GitHub Actions** (`.github/workflows/docker-publish.yml`): al hacer push a `main` en rutas bajo `anci-advisor/`, se construye la imagen (Next static export + nginx en puerto **80 interno**) y se publica en Docker Hub como **`<tu_usuario>/nist-csf-maturity-assessment`** con tags `latest` y `sha-<corto>` (el usuario debe ser el mismo que en el secret de abajo y el que pongas en `image` en el compose que uses en el VPS; puedes basarte en `deploy/docker-compose.example.yml`).

**Secrets del repositorio** (Settings → Secrets and variables → Actions):

| Secret | Valor |
|--------|--------|
| `DOCKERHUB_USERNAME` | Tu usuario de Docker Hub (mismo que en la linea `image` del compose de despliegue) |
| `DOCKERHUB_TOKEN` | Token de acceso creado en Docker Hub (ver abajo). **No** pegues el token en el codigo ni en issues. |

**Como obtener `DOCKERHUB_TOKEN` en Docker Hub:**

1. Entra en [hub.docker.com](https://hub.docker.com) con tu cuenta.
2. Arriba a la derecha: tu usuario → **Account Settings** (o **Personal settings**).
3. Seccion **Security** → **New Access Token**.
4. Nombre descriptivo (por ejemplo `github-actions-nist-csf`), permisos **Read, Write & Delete** (o al menos permiso de **push** a repositorios).
5. **Generate** y copia el token de una sola vez (no se vuelve a mostrar completo).
6. En GitHub: el mismo repositorio → **Settings** → **Secrets and variables** → **Actions** → **New repository secret** → nombre `DOCKERHUB_TOKEN` → pegar el token.

En el **VPS** no hace falta guardar el token para hacer `pull` de una imagen **publica** en Docker Hub. El token solo lo usa GitHub Actions para **subir** la imagen tras el build.

El build de CI pasa `NEXT_PUBLIC_SITE_URL` al `Dockerfile` para que los metadatos Open Graph coincidan con el dominio publico, sin archivos `.env` en el servidor.

1. Parte de la plantilla **`deploy/docker-compose.example.yml`** (en el repo) o de tu propio `docker-compose.yml` y edita **`image`**, **`VIRTUAL_HOST`** / **`LETSENCRYPT_HOST`** y **`networks.proxy.name`**. **No hace falta clonar el repositorio en el VPS**: basta con **subir solo ese archivo** (SCP, SFTP, panel, etc.) a una ruta del servidor, por ejemplo `/opt/nist-csf/docker-compose.yml`. El **example** se versiona; tu compose con datos reales puede quedar solo en el VPS.
2. Asegura que el contenedor de esta app y el **reverse proxy** del host comparten la misma red Docker externa indicada en el compose (si hace falta, conecta el contenedor del proxy a esa red).
3. En el servidor: la imagen ya esta en Docker Hub; solo descargala y levanta el stack, por ejemplo:  
   `docker compose -f /opt/nist-csf/docker-compose.yml pull && docker compose -f /opt/nist-csf/docker-compose.yml up -d`  
   (ajusta la ruta al sitio donde dejaste el `.yml`).
4. DNS: registros A/AAAA de **`nistcsf.uptlibre.pe`** hacia la IP del VPS. El proxy usa las variables `VIRTUAL_HOST` y `LETSENCRYPT_HOST` del compose.

**URL de produccion:** https://nistcsf.uptlibre.pe

---

## Controles Evaluados

| # | Control | Objetivo | MITRE ATT&CK |
|---|---------|----------|--------------|
| C0 | Gestión de Activos | Inventario y gobierno de activos | T1595, T1590 |
| C1 | Actualizar Periódicamente | Gestión de vulnerabilidades | T1190, T1068, T1210 |
| C2 | Capacitar Periódicamente | Reducción del riesgo humano | T1566, T1204 |
| C3 | Minimizar Privilegios | Control de accesos | T1078, T1068, T1055 |
| C4 | Respaldar Información | Continuidad operativa | T1486, T1490, T1485 |
| C5 | Asegurar Redes | Protección de comunicaciones | T1021, T1046, T1018 |
| C6 | Asegurar Equipos | Protección de activos | T1059, T1547, T1053 |
| C7 | Monitorear en Tiempo Real | Detección temprana | T1071, T1041, T1562 |
| C8 | Uso de MFA | Autenticación robusta | T1078, T1556, T1110 |
| C9 | Gestor de Contraseñas | Gestión de credenciales | T1555, T1003, T1110 |

---

## Marco de referencia

- **[NIST Cybersecurity Framework (CSF) 2.0](https://www.nist.gov/cyberframework)** — unico marco usado para mapear cada control ANCI a categorías y subcategorías del núcleo oficial.
- **MITRE ATT&CK** — referencia de técnicas de ataque asociadas a cada control (contexto educativo; no reemplaza al NIST en el informe de madurez).

Lista de códigos por control: [docs/NIST_CSF_MAPPING.md](./docs/NIST_CSF_MAPPING.md).

---

## Por que encaja cada control en el NIST CSF 2.0

El [NIST CSF 2.0](https://www.nist.gov/cyberframework) organiza **resultados** que debe lograr la organización; los básicos ANCI son prácticas que apoyan esos resultados. Cada fila es solo la **razón** del enlace.

| Control | Categoría NIST (ejemplo) | Por qué |
|---------|--------------------------|--------|
| C0 Gestión de activos | ID.AM (p. ej. ID.AM-01) | El inventario y la gestión del ciclo de vida de activos son base de riesgo y protección; el CSF los ubica en **Identify**. |
| C1 Actualizar periodicamente | ID.RA + PR.PS (p. ej. PR.PS-02) | Detectar fallos y versiones desactualizadas es riesgo sobre activos; parchear y mantener software es **protección de plataforma**. |
| C2 Capacitar periodicamente | PR.AT (p. ej. PR.AT-01) | Formación y concienciación del personal tienen categoría propia en **Protect**. |
| C3 Minimizar privilegios | PR.AA (p. ej. PR.AA-05) | Permisos, mínimo privilegio y separación de funciones están en **PR.AA** en la versión 2.0. |
| C4 Respaldar información | PR.DS + RC.RP (p. ej. PR.DS-11, RC.RP-01) | Las copias protegen **datos**; los planes y la ejecución de recuperación son **Recover**. |
| C5 Asegurar redes | PR.IR (p. ej. PR.IR-01) | Segmentación, perímetros y flujos de red se tratan como **resiliencia de infraestructura tecnológica**. |
| C6 Asegurar equipos | PR.PS (p. ej. PR.PS-01, PR.PS-05) | Endpoints y servidores se gestionan como **plataforma** (configuración, integridad, software permitido). |
| C7 Monitorear en tiempo real | DE.AE (p. ej. DE.AE-02) | Análisis y correlación de eventos (SIEM, alertas) son **análisis de eventos adversos** en **Detect**. |
| C8 Uso de MFA | PR.AA (p. ej. PR.AA-03) | La autenticación reforzada entra en **PR.AA**. |
| C9 Gestor de contraseñas | PR.AA (p. ej. PR.AA-01) | Emisión, gestión y revocación de credenciales corresponde a **identidades y credenciales gestionadas por la organización**. |

---

## Seguridad

### Modelo de seguridad

- **Zero Data Collection**: ningún dato sale del navegador del usuario
- **No Backend**: la aplicación es 100% client-side (static export)
- **No Cookies**: no se usan cookies, localStorage, ni sessionStorage
- **No Analytics**: no hay scripts de tracking, GA, ni pixel
- **No Dependencies externas en runtime**: no se cargan CDNs, fonts externas, ni APIs
- **CSP Ready**: compatible con Content-Security-Policy restrictiva
- **Referrer Policy**: `no-referrer` configurado en meta tags

### Reporte de vulnerabilidades

Consulta [SECURITY.md](./SECURITY.md) para el proceso de reporte de vulnerabilidades.

---

## Testing

```bash
# Verificar build de producción
npm run build

# Verificar que el export estático funciona
npx serve out/
```

La verificación se realiza mediante:
- Build de producción exitoso
- Preview visual en navegador
- Validación de funcionalidad de botones (exportar, imprimir, nueva evaluación)
- Verificación responsive (mobile/tablet/desktop)

---

## Contribución

1. Fork y branch desde `main` (`git checkout -b feature/tu-cambio`)
2. En `anci-advisor/`: `npm install` y `npm run build` debe pasar sin errores
3. Commits con mensaje claro (puedes usar [Conventional Commits](https://www.conventionalcommits.org/) si quieres)
4. Abre un Pull Request con descripcion breve del cambio

---

## Roadmap

- [ ] Modo oscuro completo
- [ ] Exportación a Excel/CSV
- [ ] Comparativa entre evaluaciones (localStorage opcional)
- [ ] Idioma inglés
- [ ] PWA offline

---

## Procedencia y creditos

Si este codigo **deriva de otro repositorio** publicado bajo MIT, manten los avisos de copyright y la procedencia en [LICENSE](./LICENSE) (incluido enlace al proyecto base si aplica).

**Que permite la licencia MIT (resumen):** uso comercial y no comercial, modificacion, distribucion, sublicencia y uso privado, **sin garantia**. Puedes, por ejemplo, **cambiar el enfoque del producto** (como alinearlo a NIST CSF 2.0, ajustar textos o datos) siempre que **sigas incluyendo** el aviso de copyright y el texto de permisos MIT que exige la licencia (en la practica: mantener `LICENSE` coherente y los creditos del repo del que partiste).

*Esto no es asesoria legal; si el caso es sensible, consulta con un abogado.*

---

## Licencia

Distribuido bajo la licencia **MIT**. Ver [LICENSE](./LICENSE) para más información.

---

## Contacto

| Canal | Enlace |
|-------|--------|
| Codigo e issues | [GitHub — Jaech-02/nist-csf-maturity-assessment](https://github.com/Jaech-02/nist-csf-maturity-assessment) |
| Produccion (HTTPS) | https://nistcsf.uptlibre.pe |
| Seguridad | Ver [SECURITY.md](./SECURITY.md) |

### Disclaimer

> **Plataforma académica y educativa.** Este sitio no está afiliado, asociado ni respaldado por ningún ente gubernamental, la ANCI, ni el Gobierno de Chile. No reemplaza una auditoría formal de ciberseguridad ni constituye asesoría legal.

---

*Proyecto de codigo abierto — revisa [LICENSE](./LICENSE) y [Procedencia](#procedencia-y-creditos).*
