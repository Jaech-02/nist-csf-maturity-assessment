# Guia de Contribucion

Gracias por tu interes en contribuir a TTPSEC Asesor ANCI. Este documento describe el proceso y las convenciones para contribuir al proyecto.

## Requisitos para PRs

1. **Fork** el repositorio y crea un branch desde `main`
2. Asegurate de que el build pasa: `npm run build`
3. Sigue las convenciones de codigo descritas abajo
4. Escribe un titulo descriptivo para el PR
5. Incluye capturas de pantalla si el cambio es visual

## Convenciones de Codigo

### Stack

- **TypeScript** con strict mode
- **React 19** con hooks y componentes funcionales
- **Tailwind CSS v4** para estilos (no CSS custom salvo animaciones)
- **Next.js 16** con static export

### Estilo

- Indentacion: 2 espacios
- Strings: comillas dobles en JSX, template literals para interpolacion
- Sin punto y coma al final (si el proyecto lo omite, mantener consistencia)
- Nombres de componentes: PascalCase
- Nombres de funciones/variables: camelCase
- Nombres de constantes: UPPER_SNAKE_CASE para constantes globales
- Texto en espanol (UI) con encoding UTF-8

### Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar exportacion a CSV
fix: corregir calculo de score en Control 7
docs: actualizar README con nuevos marcos
style: ajustar spacing en mobile
refactor: extraer componente QuestionCard
chore: actualizar dependencias
```

### Version

Al crear un PR con cambios funcionales, incrementa la version en `src/lib/version.ts`:

```typescript
export const APP_VERSION = "2.2";      // Incrementar
export const APP_DATE = "2026-03-30";  // Fecha del cambio
```

## Proceso de Revision

1. Un mantenedor revisara tu PR dentro de 72 horas habiles
2. Se pueden solicitar cambios antes del merge
3. Los PRs deben pasar el build antes de ser mergeados
4. Squash merge es el metodo preferido

## Tipos de Contribucion Bienvenidos

- Correccion de bugs
- Mejoras de accesibilidad (a11y)
- Mejoras de responsive/mobile
- Nuevos controles o preguntas (con justificacion basada en marcos)
- Traducciones
- Mejoras de documentacion
- Optimizaciones de rendimiento

## Codigo de Conducta

Este proyecto adopta el [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Al participar, te comprometes a mantener un entorno respetuoso y profesional.

---

*TTPSEC — Software para el bien comun*
