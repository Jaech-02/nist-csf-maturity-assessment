/**
 * Motor de evaluacion NIST CSF 2.0. 10 controles (C0-C9), 106 subcategorias Core (NIST.CSWP.29).
 * Sin tracking, sin cookies, 100% cliente.
 */

import {
  CSF_CATALOG_ITEMS,
  CSF_PHASES_META,
  type CsfFunctionCode,
} from "./csf-catalog";

export type { CsfFunctionCode } from "./csf-catalog";
export { CSF_FUNCTIONS, CSF_CATALOG_ITEMS, CSF_PHASES_META } from "./csf-catalog";

export interface Question {
  text: string;
  weight: number;
  subcategoryId: string;
  outcomeEn: string;
  categoryEs: string;
  /** Copiado del catalogo; vacio/omitido si no hay ejemplos locales. */
  implementationExamplesEs?: string[];
}

/** Claves para la tabla informativa de alcance (sin medicion agregada por eje). */
export type CoverageDimensionKey = 1 | 2 | 3;

/** Descripcion de las facetas del Core que el cuestionario cubre (referencia metodologica). */
export const COVERAGE_DIMENSIONS_META: Record<
  CoverageDimensionKey,
  { title: string; short: string; basis: string; coverageEs: string }
> = {
  1: {
    title: "Procesos y capacidades operativas",
    short: "Procesos y capacidades",
    basis: "Identify, Protect (sin PR.AT) y Detect del Core.",
    coverageEs:
      "El instrumento incluye las subcategorias de ID, PR (excepto concientizacion) y DE: conocer activos, protegerlos y detectar eventos.",
  },
  2: {
    title: "Gobernanza y cultura",
    short: "Organizacion y cultura",
    basis: "Funcion Govern (GV) y PR.AT (concientizacion y formacion).",
    coverageEs:
      "El instrumento incluye GV (contexto, riesgo, roles, politicas, supervision, cadena de suministro) y PR.AT.",
  },
  3: {
    title: "Respuesta y recuperacion",
    short: "Respuesta y recuperacion",
    basis: "Funciones Respond (RS) y Recover (RC) del Core.",
    coverageEs: "El instrumento incluye las subcategorias de RS y RC ante incidentes y continuidad.",
  },
};

/** Controles que concentran GV e ID.RA (indicador auxiliar de gobernanza y riesgo). */
const VI_GOV_RISK_CONTROL_IDS = new Set(["p1", "p2", "p3", "p5"]);

/** Nombres cortos de los 10 controles base (C0-C9). */
export const BASE_CONTROL_NAMES: Record<string, string> = {
  C0: "Gestion de Activos",
  C1: "Actualizar Periodicamente",
  C2: "Capacitar Periodicamente",
  C3: "Minimizar Privilegios",
  C4: "Respaldar Informacion",
  C5: "Asegurar Redes",
  C6: "Asegurar Equipos",
  C7: "Monitorear en Tiempo Real",
  C8: "Uso de MFA",
  C9: "Gestor de Contraseñas",
};

/** Texto claro para el usuario en cada bloque. */
const CONTROL_PLAIN_GUIDE: Record<number, { intro: string; riskLine: string }> = {
  1: {
    intro:
      "Vas a revisar si la organizacion tiene claro para que existe, que leyes y contratos aplican, y si el riesgo cibernetico se aborda con reglas y apetito de riesgo definidos.",
    riskLine:
      "Si esto falta, el riesgo se decide a ciegas y no hay criterio comun para invertir en seguridad.",
  },
  2: {
    intro:
      "Vas a ver si hay personas responsables, politicas escritas, revisiones periodicas y recursos acordes al plan de ciberseguridad.",
    riskLine:
      "Sin roles y politicas vivas, las buenas practicas no se sostienen ni se auditan.",
  },
  3: {
    intro:
      "Vas a evaluar como se gestionan proveedores y productos: priorizacion, contratos, revision de riesgos y participacion en incidentes.",
    riskLine:
      "La cadena de suministro es un cuello de botella comun; ignorarla deja puertas abiertas por terceros.",
  },
  4: {
    intro:
      "Vas a comprobar si se conocen activos (hardware, software, datos), dependencias y si hay un proceso de mejora tras evaluaciones.",
    riskLine:
      "Sin inventario y prioridades, no se puede proteger lo importante ni demostrar cumplimiento.",
  },
  5: {
    intro:
      "Vas a revisar si los riesgos se identifican, priorizan y comunican de forma ordenada, alineada al negocio.",
    riskLine:
      "Sin evaluacion de riesgos se gasto en controles equivocados o se ignora lo critico.",
  },
  6: {
    intro:
      "Vas a valorar identidades, accesos, formacion de personas y proteccion de datos (cifrado, retencion, borrado).",
    riskLine:
      "Credenciales debiles, datos expuestos y falta de cultura son causas frecuentes de incidentes.",
  },
  7: {
    intro:
      "Vas a revisar parches, configuracion segura, segmentacion y resiliencia de plataformas e infraestructura.",
    riskLine:
      "Sistemas desactualizados o mal segmentados amplifican el impacto de un ataque.",
  },
  8: {
    intro:
      "Vas a comprobar si hay monitoreo, analisis de anomalias y pruebas para detectar eventos a tiempo.",
    riskLine:
      "Sin deteccion temprana, un ataque crece hasta ser crisis antes de que alguien reaccione.",
  },
  9: {
    intro:
      "Vas a evaluar planes de respuesta, analisis de incidentes, comunicaciones y mitigacion coordinada.",
    riskLine:
      "Sin plan claro, cada incidente improvisa costos, tiempo y reputacion.",
  },
  10: {
    intro:
      "Vas a revisar planes de recuperacion, comunicacion en crisis y retorno operativo tras una interrupcion.",
    riskLine:
      "Sin recuperacion probada, el negocio puede quedar paralizado mucho mas de lo necesario.",
  },
};

/** Nota por seccion. */
const PHASE_BASE_NOTES: Record<number, string> = {
  1: "Core NIST: GV.OC y GV.RM. En la matriz ANCI el inventario de activos (tema C0) se detalla en la seccion del Control C3 (ID.AM).",
  2: "Core NIST: GV.RR, GV.PO y GV.OV (roles, politica, supervision).",
  3: "Core NIST: GV.SC (cadena de suministro cibernetico).",
  4: "Core NIST: ID.AM e ID.IM (activos y mejora). Alineado al control documental C0 (Gestion de activos).",
  5: "Core NIST: ID.RA (evaluacion de riesgos). Alineado a C1 (Actualizar / priorizacion); PR.PS en Control C6.",
  6: "Core NIST: PR.AA, PR.AT y PR.DS. Cruza C2, C3, C4, C8 y C9 en la documentacion de mapeo.",
  7: "Core NIST: PR.PS y PR.IR. Cruza C1 (parches), C5 (redes) y C6 (equipos) en la documentacion de mapeo.",
  8: "Core NIST: DE.CM y DE.AE. Alineado a C7 (Monitoreo).",
  9: "Core NIST: RS (respuesta). Complementa C4 y el contexto de C7 en la documentacion de mapeo.",
  10: "Core NIST: RC.RP y RC.CO (recuperacion). Alineado a C4 (continuidad).",
};

export interface Control {
  id: string;
  number: number;
  name: string;
  shortName: string;
  /** Clases Font Awesome (ej. fa-solid fa-clipboard-list). */
  icon: string;
  description: string;
  /** Indice del control base. */
  baseControlCode: string;
  /** Texto breve. */
  baseControlNote: string;
  riskIfMissing: string;
  impact: string[];
  csf: {
    function: CsfFunctionCode;
    category: string;
    detail: string;
  };
  subcategoryIds: string[];
  /** Explicacion en lenguaje simple. */
  plainIntro: string;
  /** Una frase. */
  plainRiskLine: string;
  questions: Question[];
}

export interface MaturityLevel {
  label: string;
  min: number;
  max: number;
  cls: string;
  color: string;
  desc: string;
}

/** Icono por fase (NIST Core / bloque C0-C9), Font Awesome 6 solid. */
const PHASE_FA_ICONS = [
  "fa-solid fa-clipboard-list",
  "fa-solid fa-user-group",
  "fa-solid fa-truck-field",
  "fa-solid fa-magnifying-glass",
  "fa-solid fa-scale-balanced",
  "fa-solid fa-shield-halved",
  "fa-solid fa-desktop",
  "fa-solid fa-eye",
  "fa-solid fa-bolt",
  "fa-solid fa-rotate",
];

function buildControls(): Control[] {
  return CSF_PHASES_META.map((meta) => {
    const items = CSF_CATALOG_ITEMS.filter((i) => i.phase === meta.phase);
    const ids = items.map((i) => i.id);
    const fnSet = new Set(items.map((i) => i.function));
    const primaryFn = items[0].function;
    const fnLabel = fnSet.size === 1 ? primaryFn : Array.from(fnSet).join("/");

    const detailShort =
      ids.length <= 10
        ? ids.join(", ")
        : `${ids.slice(0, 8).join(", ")} ... +${ids.length - 8} ids`;

    const baseControlCode = `C${meta.phase - 1}`;
    const plain = CONTROL_PLAIN_GUIDE[meta.phase] ?? {
      intro: "Responde segun lo que existe hoy en tu organizacion.",
      riskLine: "Las brechas aqui afectan la madurez general de ciberseguridad.",
    };

    return {
      id: `p${meta.phase}`,
      number: meta.phase,
      name: meta.title,
      shortName: `Control ${baseControlCode}`,
      icon: PHASE_FA_ICONS[meta.phase - 1] ?? "fa-solid fa-circle",
      description: `${meta.summary} Evaluacion: una pregunta por subcategoria oficial (${items.length} items).`,
      baseControlCode,
      baseControlNote: PHASE_BASE_NOTES[meta.phase] ?? "",
      plainIntro: plain.intro,
      plainRiskLine: plain.riskLine,
      riskIfMissing:
        "Ausencia de estos resultados del Core implica gobierno fragmentado, riesgo no priorizado y respuesta/recuperacion debiles.",
      impact: [
        "Desalineacion con NIST CSF 2.0",
        "Brechas de trazabilidad ante auditoria",
        "Mayor tiempo de deteccion y recuperacion",
      ],
      csf: {
        function: primaryFn,
        category: `Funcion principal: ${fnLabel} (${items.length} subcategorias)`,
        detail: detailShort,
      },
      subcategoryIds: ids,
      questions: items.map((it) => ({
        text: `${it.id}: ${it.questionEs}`,
        weight: 1,
        subcategoryId: it.id,
        outcomeEn: it.outcomeEn,
        categoryEs: it.categoryEs,
        ...(it.implementationExamplesEs?.length
          ? { implementationExamplesEs: it.implementationExamplesEs }
          : {}),
      })),
    };
  });
}

export const CONTROLS: Control[] = buildControls();

export type AnswersMap = Record<string, Record<number, number>>;

/** Compara respuestas por cada pregunta de cada control (undefined en ambos lados cuenta como igual). */
export function answersMapEqual(a: AnswersMap, b: AnswersMap): boolean {
  for (const c of CONTROLS) {
    const aa = a[c.id] || {};
    const bb = b[c.id] || {};
    for (let i = 0; i < c.questions.length; i++) {
      if (aa[i] !== bb[i]) return false;
    }
  }
  return true;
}

/**
 * Madurez global igual que en Resultados: promedio de los % de cada control C0-C9,
 * donde cada % se redondea por bloque. Cada bloque pesa igual en el promedio aunque
 * tenga distinto numero de preguntas o pesos.
 */
export function overallBlockAveragePercentFromAnswers(answers: AnswersMap): number {
  const perBlock = CONTROLS.map((control) => {
    const a = answers[control.id] || {};
    let score = 0;
    let max = 0;
    control.questions.forEach((q, i) => {
      max += q.weight * 2;
      const v = a[i];
      if (v !== undefined) score += v * q.weight;
    });
    return max > 0 ? Math.round((score / max) * 100) : 0;
  });
  return perBlock.length > 0 ? Math.round(perBlock.reduce((s, p) => s + p, 0) / perBlock.length) : 0;
}

/** Porcentaje agregado en bloques de gobernanza (GV) y evaluacion de riesgos (ID.RA). */
export function computeViGovernanceRiskPercent(answers: AnswersMap): number {
  const subset = CONTROLS.filter((c) => VI_GOV_RISK_CONTROL_IDS.has(c.id));
  let score = 0;
  let max = 0;
  for (const c of subset) {
    const a = answers[c.id] || {};
    c.questions.forEach((q, i) => {
      max += q.weight * 2;
      const v = a[i];
      if (v !== undefined) score += v * q.weight;
    });
  }
  return max > 0 ? Math.round((score / max) * 100) : 0;
}

export function getMaturityLevel(score: number): MaturityLevel {
  if (score <= 25)
    return {
      label: "Critico",
      min: 0,
      max: 25,
      cls: "critical",
      color: "#dc2626",
      desc: "Nivel critico. Se requieren acciones inmediatas en las subcategorias con peor puntuacion.",
    };
  if (score <= 50)
    return {
      label: "Bajo",
      min: 26,
      max: 50,
      cls: "low",
      color: "#d97706",
      desc: "Nivel bajo. Hay brechas amplias frente al Core CSF 2.0 en esta area.",
    };
  if (score <= 75)
    return {
      label: "Medio",
      min: 51,
      max: 75,
      cls: "medium",
      color: "#0891b2",
      desc: "Nivel medio. Base instalada; falta estandarizar y demostrar evidencia.",
    };
  return {
    label: "Alto",
    min: 76,
    max: 100,
    cls: "high",
    color: "#059669",
    desc: "Nivel alto. Mantener, auditar y mejorar con Tiers y perfiles objetivo.",
  };
}

export const GRADIENT_COLORS = [
  "from-slate-500 to-slate-600",
  "from-red-500 to-red-600",
  "from-rose-500 to-red-600",
  "from-amber-500 to-orange-600",
  "from-red-400 to-rose-600",
  "from-stone-500 to-stone-600",
  "from-rose-600 to-red-700",
  "from-orange-500 to-red-600",
  "from-slate-600 to-slate-700",
  "from-red-600 to-red-700",
];
