# Mapeo ANCI / TTPSEC a NIST CSF 2.0

Este documento describe **el mismo mapeo** que consume la aplicacion (`anci-advisor/src/lib/data.ts`, campo `nistCsf` de cada control: `objective`, `functionCategory`, `subcategoryExample`, **`mappingWhy`**). Si cambias la app, actualiza este archivo para mantener coherencia.

## Fuente normativa

- **NIST Cybersecurity Framework (CSF) 2.0** — publicacion NIST CSWP 29 (febrero 2024).
- Referencia general: [https://www.nist.gov/cyberframework](https://www.nist.gov/cyberframework)

Los **codigos de subcategoria** (p. ej. `PR.AA-05`, `ID.AM-01`) siguen la nomenclatura del nucleo CSF 2.0. En CSF 2.0, identidad, autenticacion y control de acceso logico se agrupan en **PR.AA** (no se usa **PR.AC** del CSF 1.1).

## Leyenda: a que se alinea cada columna

| Concepto en CSF 2.0 | Como aparece en la app / en esta tabla | Que debes interpretar |
|---------------------|----------------------------------------|------------------------|
| **Funcion** | Primera parte de *Funcion y categoria NIST* (p. ej. `ID`, `PR`, `DE`, `RC`) | Una de las **seis funciones** del nucleo: **GV**, **ID**, **PR**, **DE**, **RS**, **RC**. |
| **Categoria** | Codigo tipo `ID.AM`, `PR.AA`, `PR.PS`, `DE.AE`, `RC.RP` | Agrupacion **oficial** dentro de esa funcion. Un control puede citar **varias** si el tema cruza ambitos. |
| **Subcategoria (ejemplo)** | Codigo `XX.YY-NN` + texto resumido | **Item del documento oficial**. Es **un ejemplo representativo** por control, no el listado exhaustivo. |
| **Objetivo (ANCI)** | Resumen en lenguaje de los basicos | **No** es etiqueta NIST; es el eje ANCI que se cruza con el NIST. |
| **Por que este NIST** | Parrafo de fundamento | Razon **en prosa** de por que ese control ANCI se ancla a esas categorias y a ese ejemplo. |

## Tabla de correspondencia y fundamento por control

| Control | Nombre (app) | Objetivo (ANCI) | Funcion / categoria NIST | Ejemplo subcategoria | Por que se usa ese NIST |
|---------|--------------|-----------------|---------------------------|----------------------|-------------------------|
| C0 | Gestion de Activos | Inventario de activos | ID / ID.AM | ID.AM-01 | El Control 0 pide inventariar y gobernar activos; en CSF 2.0 eso es Identify / Asset Management (ID.AM). Sin inventario no hay base para riesgo, parches ni continuidad; ID.AM-01 nombra explicitamente inventarios de hardware como practica del nucleo. |
| C1 | Actualizar Periodicamente | Vulnerabilidades / parches | ID.RA + PR.PS | PR.PS-02 | Actualizar y parchear reduce vulnerabilidades conocidas: encaja en Protect / Platform Security (PR.PS) porque endurece la plataforma. ID.RA aparece porque el riesgo de explotacion depende de conocer debilidades y priorizar; PR.PS-02 es el item del nucleo sobre mantener o reemplazar software segun riesgo. |
| C2 | Capacitar Periodicamente | Riesgo humano | PR / PR.AT | PR.AT-01 | Capacitar al personal es conciencia y formacion en ciberseguridad; en CSF 2.0 esta bajo Protect / Awareness and Training (PR.AT). PR.AT-01 describe capacitacion y concienciacion del personal como control del nucleo. |
| C3 | Minimizar Privilegios | Accesos | PR / PR.AA | PR.AA-05 | Minimizar privilegios y controlar accesos logicos es identidad, autenticacion y control de acceso en CSF 2.0 (PR.AA). PR.AA-05 alinea directo con minimo privilegio y separacion de funciones. |
| C4 | Respaldar Informacion | Continuidad | PR.DS + RC.RP | PR.DS-11; RC.RP-01 | Respaldos protegen datos (PR.DS) y habilitan recuperacion; ejecutar recuperacion es Recover / RC.RP. Por eso se cruzan PR.DS-11 (copias de respaldo) con RC.RP-01 (plan de recuperacion). |
| C5 | Asegurar Redes | Comunicaciones | PR / PR.IR | PR.IR-01 | Asegurar redes y segmentacion refuerza la infraestructura tecnologica frente a accesos no autorizados; en CSF 2.0 eso esta en Protect / Technology Infrastructure Resilience (PR.IR). PR.IR-01 habla de redes protegidas frente a acceso logico no autorizado. |
| C6 | Asegurar Equipos | Endpoints / plataforma | PR / PR.PS | PR.PS-01; PR.PS-05 | Endpoints, EDR y endurecimiento son seguridad de plataforma (PR.PS): configuracion segura y control de lo que se ejecuta. PR.PS-01 y PR.PS-05 cubren gestion de configuracion y bloqueo de software no autorizado. |
| C7 | Monitorear en Tiempo Real | Deteccion | DE / DE.AE | DE.AE-02 | Monitoreo y correlacion de eventos es la funcion Detect del CSF, categoria Adverse Event Analysis (DE.AE). DE.AE-02 describe analizar eventos potencialmente adversos, alineado a SIEM y monitoreo en tiempo real. |
| C8 | Uso de MFA | Autenticacion | PR / PR.AA | PR.AA-03 | MFA refuerza la autenticacion de identidades; en CSF 2.0 pertenece a PR.AA. PR.AA-03 trata explicitamente autenticacion de usuarios, servicios y hardware, incluyendo factores multiples cuando aplica. |
| C9 | Gestor de Contrasenas | Credenciales | PR / PR.AA | PR.AA-01 | Gestor de contrasenas y politicas de secretos gestionan identidades y credenciales corporativas; encaja en PR.AA. PR.AA-01 describe identidades y credenciales emitidas y gestionadas por la organizacion. |

La evaluacion en la app usa **solo NIST CSF 2.0** como marco de mapeo (no ISO/CIS/800-53 ni otros).

---

*Actualizado: leyenda + fundamento por control (`mappingWhy`) — 2026-04-05*
