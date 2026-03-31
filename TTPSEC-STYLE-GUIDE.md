# TTPSEC Design System & Style Guide

> Sistema de estilos estandarizado para productos TTPSEC.
> Tailwind CSS v4 + Next.js | Actualizado: 2026-03-29

---

## 1. Brand Identity

| Elemento         | Valor                                                |
| ---------------- | ---------------------------------------------------- |
| **Logo**         | `logo-ttpsec.png` (PNG, fondo transparente)          |
| **Logotipo**     | TTPSEC (font-black, tracking-tight)                  |
| **Tagline**      | Software para el bien comun                          |
| **Web**          | [www.ttpsec.ai](https://www.ttpsec.ai)               |
| **Web CL**       | [www.ttpsec.cl](https://www.ttpsec.cl)               |

---

## 2. Color Palette

### Primary (Brand Blue)

```
blue-900:  #1e3a8a  -- Headers, brand text
blue-800:  #1e40af  -- Strong emphasis, theme-color meta
blue-700:  #1d4ed8  -- Hover states primary
blue-600:  #2563eb  -- Primary buttons, active nav, links
blue-500:  #3b82f6  -- Progress bars, accents
blue-200:  #bfdbfe  -- Borders active
blue-100:  #dbeafe  -- Light backgrounds
blue-50:   #eff6ff  -- Chip/badge backgrounds
```

### Secondary (Indigo)

```
indigo-700: #4338ca  -- Gradients, mapping tab active
indigo-600: #4f46e5  -- Secondary active states
indigo-500: #6366f1  -- Gradient endpoints
```

### Semantic Colors

```css
/* Success / Implemented */
--success-bg:     #ecfdf5;   /* emerald-50 */
--success-text:   #047857;   /* emerald-700 */
--success-border: #a7f3d0;   /* emerald-200 */
--success-badge:  #d1fae5;   /* emerald-50 for badges */

/* Warning / Partial */
--warning-bg:     #fffbeb;   /* amber-50 */
--warning-text:   #b45309;   /* amber-700 */
--warning-border: #fde68a;   /* amber-200 */

/* Danger / Not Implemented */
--danger-bg:      #fef2f2;   /* red-50 */
--danger-text:    #b91c1c;   /* red-700 */
--danger-border:  #fecaca;   /* red-200 */

/* Info / Medium */
--info-bg:        #ecfeff;   /* cyan-50 */
--info-text:      #0e7490;   /* cyan-700 */
--info-border:    #a5f3fc;   /* cyan-200 */

/* Disclaimer / Legal */
--disclaimer-bg:     linear-gradient(to right, #fffbeb, #fff7ed);  /* amber-50 to orange-50 */
--disclaimer-border: #fcd34d;   /* amber-300 */
--disclaimer-title:  #92400e;   /* amber-800 */
```

### Neutrals (Slate scale)

```
slate-900: #0f172a  -- Headings, strong text
slate-800: #1e293b  -- Body text
slate-700: #334155  -- Secondary headings
slate-600: #475569  -- Paragraph text
slate-500: #64748b  -- Muted text, descriptions
slate-400: #94a3b8  -- Placeholder, disabled, captions
slate-200: #e2e8f0  -- Borders, dividers
slate-100: #f1f5f9  -- Subtle backgrounds
slate-50:  #f8fafc  -- Page background
```

### Background

```
Page:    bg-slate-50    (#f8fafc)
Cards:   bg-white       (#ffffff)
Header:  bg-white/95 backdrop-blur
```

---

## 3. Typography

### Font Stack

```css
font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
/* Mono: */
font-family: ui-monospace, 'Cascadia Mono', 'Fira Code', monospace;
```

### Scale

| Uso                    | Tailwind Class                         | Ejemplo                  |
| ---------------------- | -------------------------------------- | ------------------------ |
| Page title             | `text-3xl md:text-4xl font-black`      | Evaluacion de Ciberseg.  |
| Section title          | `text-2xl md:text-3xl font-black`      | Resultados               |
| Card heading           | `text-xl font-extrabold`               | Control 0: Gestion...   |
| Subsection             | `text-sm font-bold`                    | Selecciona tu contexto   |
| Body                   | `text-sm text-slate-600`               | Paragraphs               |
| Small / Muted          | `text-xs text-slate-500`               | Descriptions             |
| Caption                | `text-[11px] text-slate-400`           | Footnotes, meta info     |
| Micro                  | `text-[10px] text-slate-400`           | Badges, chips            |
| Mono references        | `text-xs font-mono font-semibold`      | ISO refs, CIS codes      |

### Weight Map

```
font-black:     900  -- Main titles, brand name
font-extrabold: 800  -- Section headings, labels
font-bold:      700  -- Buttons, card titles, emphasis
font-semibold:  600  -- Nav items, secondary buttons
font-medium:    500  -- Subtle emphasis
```

---

## 4. Spacing & Layout

### Container

```html
<div class="max-w-6xl mx-auto px-4">   <!-- Header/Nav -->
<div class="max-w-4xl mx-auto">         <!-- Content area -->
<div class="max-w-3xl mx-auto">         <!-- Questionnaire -->
<div class="max-w-xl mx-auto">          <!-- Centered text blocks -->
```

### Spacing Scale (most used)

```
gap-1     (4px)    -- Icon badges inline
gap-1.5   (6px)    -- Tight inline elements
gap-2     (8px)    -- Button groups, chips
gap-3     (12px)   -- Card content spacing
gap-4     (16px)   -- Grid gaps, section padding
gap-6     (24px)   -- Major section spacing
mb-5      (20px)   -- Between content blocks
mb-6      (24px)   -- Standard margin bottom
mb-8      (32px)   -- Section separators
py-3      (12px)   -- Header padding
py-6      (24px)   -- Footer padding
py-8      (32px)   -- Main content padding
p-4       (16px)   -- Card inner padding small
p-5       (20px)   -- Card inner padding medium
p-6       (24px)   -- Card inner padding large
```

---

## 5. Components

### Buttons

```html
<!-- Primary CTA -->
<button class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl text-base shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all">
  Comenzar Evaluacion
</button>

<!-- Primary Action -->
<button class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-all cursor-pointer">
  Descargar Informe (HTML)
</button>

<!-- Danger / Export -->
<button class="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-all cursor-pointer">
  Exportar PDF
</button>

<!-- Secondary / Ghost -->
<button class="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer">
  Nueva Evaluacion
</button>

<!-- Nav Button (active) -->
<button class="text-[11px] px-2.5 py-1 rounded-md font-semibold bg-blue-600 text-white">
  Inicio
</button>

<!-- Nav Button (completed) -->
<button class="text-[11px] px-2.5 py-1 rounded-md font-semibold bg-emerald-50 text-emerald-700">
  C0
</button>

<!-- Nav Button (inactive) -->
<button class="text-[11px] px-2.5 py-1 rounded-md font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-100">
  C1
</button>
```

### Cards

```html
<!-- Feature Card -->
<div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all">
  <div class="text-3xl mb-3">ICON</div>
  <h3 class="font-bold text-slate-900 mb-1.5 text-sm">Title</h3>
  <p class="text-xs text-slate-500 leading-relaxed">Description</p>
</div>

<!-- Result Card (expandable) -->
<button class="w-full bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all">
  <!-- Score badge + Control name + expand icon -->
</button>

<!-- Score Overview Card -->
<div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-md">
  <!-- Circular chart + level info -->
</div>

<!-- Question Card -->
<div class="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
  <p class="text-sm text-slate-800 font-medium mb-3">Question text</p>
</div>
```

### Badges & Chips

```html
<!-- Status Badges (header) -->
<span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
  Anonimo
</span>
<span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
  Seguro
</span>
<span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
  Sin Rastreo
</span>

<!-- MITRE ATT&CK Tags -->
<span class="text-[10px] font-mono px-2 py-0.5 bg-red-50 text-red-600 rounded border border-red-200">
  T1190
</span>

<!-- Score Badge -->
<span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
  85%
</span>

<!-- Framework Badge -->
<span class="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
  ISO 27001
</span>
```

### Disclaimer Box

```html
<div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-5">
  <p class="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-2">
    Plataforma academica y educativa
  </p>
  <p class="text-xs text-slate-600 leading-relaxed">
    Disclaimer content...
  </p>
</div>
```

### Social Share Buttons

```html
<!-- LinkedIn -->
<a class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2] text-white text-xs font-bold hover:bg-[#004182] transition-colors shadow-sm">
<!-- X/Twitter -->
<a class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm">
<!-- Facebook -->
<a class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2] text-white text-xs font-bold hover:bg-[#0d5bbf] transition-colors shadow-sm">
<!-- WhatsApp -->
<a class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:bg-[#1da851] transition-colors shadow-sm">
```

---

## 6. Header Pattern

```html
<header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
  <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
    <!-- Logo + Name -->
    <div class="flex items-center gap-3">
      <img src="/logo-ttpsec.png" alt="TTPSEC" class="h-10 w-auto" />
      <div>
        <h1 class="text-lg font-black text-blue-900 tracking-tight">TTPSEC</h1>
        <p class="text-[11px] text-slate-500 font-medium">Subtitulo</p>
      </div>
    </div>
    <!-- Status badges -->
    <div class="flex gap-2">
      <!-- badges here -->
    </div>
  </div>
</header>
```

---

## 7. Progress Bar

```html
<div class="h-1.5 bg-slate-200 rounded-full overflow-hidden">
  <div class="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
       style="width: 60%">
  </div>
</div>
```

---

## 8. Control Gradient Colors

Usados para las insignias de cada control (C0-C9):

| Control | Gradient                              |
| ------- | ------------------------------------- |
| C0      | `from-indigo-500 to-indigo-700`       |
| C1      | `from-blue-500 to-blue-700`          |
| C2      | `from-cyan-500 to-cyan-700`          |
| C3      | `from-violet-500 to-violet-700`      |
| C4      | `from-emerald-500 to-emerald-700`    |
| C5      | `from-amber-500 to-amber-700`        |
| C6      | `from-red-500 to-red-700`            |
| C7      | `from-pink-500 to-pink-700`          |
| C8      | `from-teal-500 to-teal-700`          |
| C9      | `from-orange-500 to-orange-700`      |

---

## 9. Maturity Levels

| Level    | Score   | Color     | Hex      | CSS Class   |
| -------- | ------- | --------- | -------- | ----------- |
| Critico  | 0-25%   | Red       | `#dc2626` | `critical` |
| Bajo     | 26-50%  | Amber     | `#d97706` | `low`      |
| Medio    | 51-75%  | Cyan      | `#0891b2` | `medium`   |
| Alto     | 76-100% | Emerald   | `#059669` | `high`     |

---

## 10. Border Radius Scale

```
rounded-md:   6px   -- Nav buttons, small elements
rounded-lg:   8px   -- Social buttons, inputs
rounded-xl:   12px  -- Buttons, cards, question cards
rounded-2xl:  16px  -- Feature cards, main panels, disclaimer
rounded-full: 9999px -- Badges, chips, progress bar
```

---

## 11. Shadows

```
shadow-sm:          0 1px 2px rgba(0,0,0,0.05)        -- Cards default
shadow-md:          0 4px 6px -1px rgba(0,0,0,0.1)    -- Cards hover, score panel
shadow-lg:          0 10px 15px -3px rgba(0,0,0,0.1)  -- CTA button
shadow-blue-200:    colored shadow for primary CTA
shadow-blue-100:    colored shadow for selected context
```

---

## 12. Transitions & Animations

```
transition-all:     all 150ms ease
duration-500:       for progress bar width
duration-1000:      for SVG stroke animations (score circle)
hover:-translate-y-0.5:  subtle lift effect on hover
```

### Print Styles

```css
@media print {
  header, nav, footer, button { display: none !important; }
  body { background: white; color: black; font-size: 11pt; }
  a { color: #1e40af; text-decoration: underline; }
  * { break-inside: avoid; }
}
```

---

## 13. Mapping Table

```html
<table class="w-full text-left text-xs">
  <thead>
    <tr class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <th class="px-3 py-3 font-bold text-[11px]">Header</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-t border-slate-100 hover:bg-blue-50 transition-colors">
      <!-- Even rows: bg-white, Odd rows: bg-slate-50 -->
      <td class="px-3 py-2.5 font-mono text-blue-700 font-semibold">Value</td>
    </tr>
  </tbody>
</table>
```

### Framework color coding in tables

```
ISO:    text-blue-700     font-mono font-semibold
NIST:   text-indigo-700   font-mono font-semibold
CIS:    text-emerald-700  font-mono font-semibold
SCF:    text-violet-700   font-mono font-semibold
ISA:    text-amber-700    font-mono font-semibold
NERC:   text-red-700      font-mono font-semibold
```

---

## 14. Footer Pattern

```html
<footer class="bg-white border-t border-slate-200 py-6 px-4 text-center">
  <img src="/logo-ttpsec.png" alt="TTPSEC" class="h-8 mx-auto mb-3" />
  <p class="text-xs text-slate-500 mb-1">
    <strong class="text-blue-900">TTPSEC</strong> | Descripcion del producto
  </p>
  <p class="text-[10px] text-slate-400 font-medium">
    Privacy badges inline
  </p>
  <p class="text-[10px] text-slate-400 font-mono mt-1">
    Framework references
  </p>
  <a href="https://www.ttpsec.ai" class="text-sm font-bold text-blue-800 hover:text-blue-600">
    www.ttpsec.ai
  </a>
  <p class="text-xs text-slate-500 italic">Software para el bien comun</p>
  <!-- LinkedIn recommendation CTA -->
</footer>
```

---

## 15. Meta & SEO

```html
<meta charset="UTF-8" />
<meta name="referrer" content="no-referrer" />
<meta name="theme-color" content="#1e40af" />
<meta name="robots" content="index, follow" />
<!-- lang="es" dir="ltr" -->
<!-- OpenGraph: type=website, locale=es_CL -->
<!-- Twitter: card=summary_large_image -->
```

---

## 16. Files Structure

```
public/
  logo-ttpsec.png       -- Brand logo (PNG, transparent)
  og-image.svg          -- Social share preview (1200x630)
  favicon.svg           -- Browser tab icon (shield)
  site.webmanifest      -- PWA manifest
src/
  app/
    globals.css          -- Tailwind import + print styles
    layout.tsx           -- Meta, SEO, body structure
    page.tsx             -- Main SPA (all screens)
  lib/
    data.ts              -- Controls, questions, frameworks, maturity levels
```

---

*TTPSEC -- Software para el bien comun*
