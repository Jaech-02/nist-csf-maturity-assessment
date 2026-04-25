# Base metodologica: 10 controles → alineacion NIST CSF 2.0

En este proyecto la **base** de la evaluacion son **diez controles organizacionales** (numerados C0–C9): practicas que la organizacion debe dominar. Cada control se **enlaza** al **NIST Cybersecurity Framework (CSF) 2.0** mediante funcion, categoria del Core, **ejemplo** de subcategoria y el **fundamento** (`mappingWhy`) de por que ese anclaje es coherente.

La **aplicacion** (`anci-advisor/`) **operacionaliza** el marco NIST de forma **exhaustiva**: no se limita a un solo ejemplo por control, sino que evalua las **106 subcategorias oficiales** del Anexo A (NIST.CSWP.29). En la UI cada bloque del cuestionario va etiquetado con el **control base** correspondiente (**C0–C9**); internamente el catalogo agrupa esas subcategorias en **diez bloques** (`p1`–`p10`, alineados al orden del marco de diez). Las dimensiones **VI/VD** del documento de madurez se usan como guia de implementacion en textos de apoyo, sin sustituir el texto normativo del Core.

Si cambias criterios de mapeo, actualiza esta tabla y revisa `anci-advisor/src/lib/csf-catalog.ts` y `anci-advisor/src/lib/data.ts`.

## Proyecto y enlaces

- **Sitio (referencia):** [https://nistcsf.uptlibre.pe](https://nistcsf.uptlibre.pe)
- **Codigo:** [https://github.com/Jaech-02/nist-csf-maturity-assessment](https://github.com/Jaech-02/nist-csf-maturity-assessment) (aplicacion en carpeta `anci-advisor/`).

## Fuente normativa

- **NIST Cybersecurity Framework (CSF) 2.0** — NIST CSWP 29 (febrero 2024).
- [https://www.nist.gov/cyberframework](https://www.nist.gov/cyberframework)
- Los codigos de subcategoria (p. ej. `PR.AA-05`, `ID.AM-01`) siguen el **Anexo A** del CSF 2.0. En CSF 2.0, identidad y control de acceso logico estan en **PR.AA** (no se usa **PR.AC** del CSF 1.1).

## Leyenda: columnas de la tabla de correspondencia

| Concepto en CSF 2.0 | Como se lee aqui | Interpretacion |
|---------------------|------------------|----------------|
| **Funcion** | Primera parte de *Funcion y categoria NIST* (p. ej. `ID`, `PR`, `DE`) | Una de las **seis funciones** del nucleo: **GV**, **ID**, **PR**, **DE**, **RS**, **RC**. |
| **Categoria** | Codigo tipo `ID.AM`, `PR.AA`, `PR.PS`, `DE.AE`, `RC.RP` | Agrupacion **oficial** dentro de esa funcion. Un control puede citar **varias** si el tema cruza ambitos. |
| **Subcategoria (ejemplo)** | Codigo `XX.YY-NN` + texto en el fundamento | **Referencia ilustrativa** del documento oficial; en la app se evaluan **todas** las subcategorias pertinentes del Anexo A, no solo esa fila. |
| **Objetivo (control base)** | Resumen del eje del control C0–C9 | Etiqueta **propia** del marco de diez controles; no es texto literal de NIST. |
| **Por que este NIST** | Parrafo de fundamento | Razon en prosa de por que ese control se ancla a esas categorias y a ese ejemplo. |

## Tabla: los 10 controles base y su alineacion a NIST CSF 2.0

| Control | Nombre (base) | Objetivo (control base) | Funcion / categoria NIST | Ejemplo subcategoria | Por que se usa ese NIST |
|---------|---------------|-------------------------|---------------------------|----------------------|-------------------------|
| C0 | Gestion de Activos | Inventario de activos | ID / ID.AM | ID.AM-01 | El control pide inventariar y gobernar activos; en CSF 2.0 eso es Identify / Asset Management (ID.AM). Sin inventario no hay base para riesgo, parches ni continuidad; ID.AM-01 nombra explicitamente inventarios de hardware como practica del nucleo. |
| C1 | Actualizar Periodicamente | Vulnerabilidades / parches | ID.RA + PR.PS | PR.PS-02 | Actualizar y parchear reduce vulnerabilidades conocidas: encaja en Protect / Platform Security (PR.PS) porque endurece la plataforma. ID.RA aparece porque el riesgo de explotacion depende de conocer debilidades y priorizar; PR.PS-02 es el item del nucleo sobre mantener o reemplazar software segun riesgo. |
| C2 | Capacitar Periodicamente | Riesgo humano | PR / PR.AT | PR.AT-01 | Capacitar al personal es conciencia y formacion en ciberseguridad; en CSF 2.0 esta bajo Protect / Awareness and Training (PR.AT). PR.AT-01 describe capacitacion y concienciacion del personal como control del nucleo. |
| C3 | Minimizar Privilegios | Accesos | PR / PR.AA | PR.AA-05 | Minimizar privilegios y controlar accesos logicos es identidad, autenticacion y control de acceso en CSF 2.0 (PR.AA). PR.AA-05 alinea directo con minimo privilegio y separacion de funciones. |
| C4 | Respaldar Informacion | Continuidad | PR.DS + RC.RP | PR.DS-11; RC.RP-01 | Respaldos protegen datos (PR.DS) y habilitan recuperacion; ejecutar recuperacion es Recover / RC.RP. Por eso se cruzan PR.DS-11 (copias de respaldo) con RC.RP-01 (plan de recuperacion). |
| C5 | Asegurar Redes | Comunicaciones | PR / PR.IR | PR.IR-01 | Asegurar redes y segmentacion refuerza la infraestructura tecnologica frente a accesos no autorizados; en CSF 2.0 eso esta en Protect / Technology Infrastructure Resilience (PR.IR). PR.IR-01 habla de redes protegidas frente a acceso logico no autorizado. |
| C6 | Asegurar Equipos | Endpoints / plataforma | PR / PR.PS | PR.PS-01; PR.PS-05 | Endpoints, EDR y endurecimiento son seguridad de plataforma (PR.PS): configuracion segura y control de lo que se ejecuta. PR.PS-01 y PR.PS-05 cubren gestion de configuracion y bloqueo de software no autorizado. |
| C7 | Monitorear en Tiempo Real | Deteccion | DE / DE.AE | DE.AE-02 | Monitoreo y correlacion de eventos es la funcion Detect del CSF, categoria Adverse Event Analysis (DE.AE). DE.AE-02 describe analizar eventos potencialmente adversos, alineado a SIEM y monitoreo en tiempo real. |
| C8 | Uso de MFA | Autenticacion | PR / PR.AA | PR.AA-03 | MFA refuerza la autenticacion de identidades; en CSF 2.0 pertenece a PR.AA. PR.AA-03 trata explicitamente autenticacion de usuarios, servicios y hardware, incluyendo factores multiples cuando aplica. |
| C9 | Gestor de Contraseñas | Credenciales | PR / PR.AA | PR.AA-01 | Gestor de contraseñas y politicas de secretos gestionan identidades y credenciales corporativas; encaja en PR.AA. PR.AA-01 describe identidades y credenciales emitidas y gestionadas por la organizacion. |

La evaluacion en la app usa **solo NIST CSF 2.0** como marco normativo de referencia (no ISO/CIS/800-53 en esta version).

## Puente: marco documental C0–C9 ↔ bloques del cuestionario (`p1`–`p10`)

La **tabla de arriba** (C0–C9) describe el **marco de diez controles organizacionales** y su alineacion **conceptual** al Core NIST. El **cuestionario** recorre el Core en **diez bloques** consecutivos definidos en `CSF_PHASES_META` y `CSF_CATALOG_ITEMS` (`anci-advisor/src/lib/csf-catalog.ts`). En codigo, el bloque con `phase = N` tiene `id = pN` y `baseControlCode = C{N-1}` (es decir **p1→C0**, **p2→C1**, …, **p10→C9**). Esa etiqueta **sigue el orden** del marco de diez; el **titulo y las preguntas** de cada bloque corresponden al **resumen** de `CSF_PHASES_META` y a las subcategorias del Anexo A agrupadas por `phase`. Las notas `PHASE_BASE_NOTES` en `anci-advisor/src/lib/data.ts` aclaran cruces con categorias NIST y, cuando aplica, con la matriz documental.

| Bloque | `baseControlCode` | Titulo del bloque (catalogo) | Enfoque NIST (resumen del catalogo) |
|--------|-------------------|------------------------------|-------------------------------------|
| p1 | C0 | Gobernanza: contexto y estrategia de riesgo | GV.OC y GV.RM |
| p2 | C1 | Gobernanza: roles, politica y supervision | GV.RR, GV.PO y GV.OV |
| p3 | C2 | Gobernanza: cadena de suministro | GV.SC |
| p4 | C3 | Identificar: activos y mejora | ID.AM e ID.IM |
| p5 | C4 | Identificar: evaluacion de riesgos | ID.RA |
| p6 | C5 | Proteger: identidad, datos y concientizacion | PR.AA, PR.AT y PR.DS |
| p7 | C6 | Proteger: plataformas e infraestructura | PR.PS y PR.IR |
| p8 | C7 | Detectar: monitoreo y analisis | DE.CM y DE.AE |
| p9 | C8 | Responder: gestion y mitigacion de incidentes | RS.MA, RS.AN, RS.CO y RS.MI |
| p10 | C9 | Recuperar: ejecucion y comunicacion | RC.RP y RC.CO |

**Total en producto:** 106 preguntas (una por subcategoria del Anexo A). El listado completo esta en la pantalla **Core CSF** y en `anci-advisor/src/lib/csf-catalog.ts`.

En la **UI**, cada bloque muestra la etiqueta **Control Ck** (`baseControlCode`), el nombre del marco de diez desde `BASE_CONTROL_NAMES[Ck]` y la nota `baseControlNote`. La portada lista los diez controles del marco documental; **Resultados** repite informacion por bloque. Los objetos `Control` se generan en `anci-advisor/src/lib/data.ts` (`buildControls`).

---

*Actualizado: base C0–C9 + NIST CSF 2.0 + bloques p1–p10 + enlaces uptlibre / repo — 2026-04-12*
