"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import * as XLSX from "xlsx";
import {
  BASE_CONTROL_NAMES,
  CONTROLS,
  CSF_CATALOG_ITEMS,
  CSF_FUNCTIONS,
  getMaturityLevel,
  GRADIENT_COLORS,
  answersMapEqual,
  overallBlockAveragePercentFromAnswers,
  type Control,
} from "@/lib/data";
import { loadAnswersSession, saveAnswersSession } from "@/lib/answers-session";
import {
  deleteSnapshot,
  loadSnapshots,
  saveSnapshot,
  snapshotMetrics,
  type EvalSnapshot,
} from "@/lib/snapshots";
import { ASSET_BASE_PATH, PUBLIC_SITE_URL, UPTLIBRE_PORTAL_URL } from "@/lib/site";
import {
  NIST_CSF_CSWP29_FINAL_URL,
  NIST_CSF_CSWP29_PDF_URL,
  NIST_CSF_INFORMATIVE_REFERENCES_URL,
  NIST_CSF_PORTAL_URL,
} from "@/lib/nist-links";
import {
  clearGovernanceRecord,
  emptyGovernanceRecord,
  governanceRecordHasAnyContent,
  loadGovernanceRecord,
  MEASUREMENT_TYPE_LABELS,
  saveGovernanceRecord,
  type GovernanceMeasurementType,
  type GovernanceRecord,
} from "@/lib/governance-record";
import { SiteFooter, SiteHeader, SiteNavigation } from "@/app/_components";

const BASE = ASSET_BASE_PATH;
const PUBLIC_SITE = PUBLIC_SITE_URL;
const REPO_URL = "https://github.com/Jaech-02/nist-csf-maturity-assessment";
import { APP_VERSION, APP_DATE } from "@/lib/version";

type Answers = Record<string, Record<number, number>>;

/** Las tres dimensiones del sistema (variable independiente) segun el marco de investigacion. */
function InstrumentResearchDimensionsSection() {
  const items = [
    {
      n: "1",
      title: "Alineacion con el Core del NIST CSF 2.0",
      fa: "fa-solid fa-sitemap" as const,
      how: [
        "Cuestionario sobre las 106 subcategorias oficiales (Anexo A, NIST.CSWP.29) y las seis funciones: Gobernar, Identificar, Proteger, Detectar, Responder y Recuperar.",
        "Cada item enlaza al Outcome del Core; resultados por los diez controles base (C0-C9) y tabla Core completa en la navegacion.",
        "Exportacion de informe en HTML para documentar la medicion.",
      ],
    },
    {
      n: "2",
      title: "Monitoreo y mejora continua",
      fa: "fa-solid fa-chart-line" as const,
      how: [
        "Seguimiento longitudinal: guardar mediciones en este navegador, etiquetar fechas y comparar dos registros.",
        "Autoevaluacion repetible sin depender de consultores para completar el cuestionario y revisar resultados.",
        "Impresion / PDF del informe para archivar y volver a medir mas adelante.",
      ],
    },
    {
      n: "3",
      title: "Gobernanza, politicas y gestion de riesgos",
      fa: "fa-solid fa-landmark" as const,
      how: [
        "Registro de gobierno en el inicio: institucion, alcance, responsable, tipo de medicion y referencia a politica o plan de seguridad.",
        "El Core incluye la funcion Gobernar (GV) y evaluacion de riesgos (p. ej. ID.RA) dentro de las mismas preguntas alineadas al estandar.",
        "Los resultados muestran brechas por subcategoria para apoyar decisiones de mejora (sin sustituir politicas internas ni actas formales).",
      ],
    },
  ];

  return (
    <section
      id="dimensiones-instrumento"
      aria-labelledby="home-vi-dimensiones-title"
      className="relative scroll-mt-24 -mx-4 overflow-hidden px-4 py-12 sm:-mx-6 sm:px-8 sm:py-14"
    >
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-8 max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600/90">
            Variable independiente del instrumento
          </p>
          <h2
            id="home-vi-dimensiones-title"
            className="mt-2 font-serif text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-[1.75rem]"
          >
            Tres dimensiones del sistema web
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Asi se <strong className="text-zinc-800">materializa</strong> en esta plataforma cada dimension del diseño (alineacion al Core, mejora continua, gobernanza y riesgo).
          </p>
        </header>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.n}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm ring-1 ring-red-50/60"
            >
              <div className="mb-3 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-sm font-black text-white shadow-sm">
                  {it.n}
                </span>
                <div className="min-w-0">
                  <span className="text-red-700" aria-hidden>
                    <i className={`${it.fa} text-lg`} />
                  </span>
                  <h3 className="mt-1 font-serif text-base font-bold leading-snug text-zinc-900">{it.title}</h3>
                </div>
              </div>
              <ul className="mt-1 space-y-2 text-[12px] leading-relaxed text-zinc-600">
                {it.how.map((line, li) => (
                  <li key={`${it.n}-${li}`} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GovernanceRecordSection({
  value,
  onChange,
  onSave,
  onClear,
  saveOk,
}: {
  value: GovernanceRecord;
  onChange: (next: GovernanceRecord) => void;
  onSave: () => void;
  onClear: () => void;
  saveOk: boolean;
}) {
  const field =
    "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100";
  const label = "mb-1 block text-[11px] font-semibold text-zinc-700";

  return (
    <section
      id="registro-gobierno"
      aria-labelledby="gov-registro-title"
      className="relative scroll-mt-24 -mx-4 overflow-hidden px-4 py-12 sm:-mx-6 sm:px-8 sm:py-14"
    >
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-6 max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600/90">
            Gobernanza de la evaluacion
          </p>
          <h2
            id="gov-registro-title"
            className="mt-2 font-serif text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-[1.75rem]"
          >
            Registro de gobierno
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            Datos para <strong className="text-zinc-800">trazabilidad y responsabilidad</strong> de la medicion (institucion, alcance, responsable, tipo de medicion, referencia a politicas).{" "}
            <strong className="text-zinc-800">No son preguntas del Core NIST</strong>; se guardan solo en este navegador y se incluyen en el informe HTML si exporta.{" "}
          </p>
        </header>

        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm ring-1 ring-red-50/50 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="gov-institution" className={label + " text-[12px]"}>
                Institucion u organismo
              </label>
              <input
                id="gov-institution"
                className={field}
                value={value.institutionName}
                onChange={(e) => onChange({ ...value, institutionName: e.target.value })}
                placeholder="Ej. Municipalidad provincial de Tacna"
                autoComplete="organization"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="gov-scope" className={label + " text-[12px]"}>
                Alcance de la evaluacion (TIC criticas, unidades, sistemas)
              </label>
              <textarea
                id="gov-scope"
                className={`${field} min-h-[4.5rem] resize-y`}
                value={value.scopeText}
                onChange={(e) => onChange({ ...value, scopeText: e.target.value })}
                placeholder="Describa que entra en esta autoevaluacion."
              />
            </div>
            <div>
              <label htmlFor="gov-resp-name" className={label + " text-[12px]"}>
                Responsable de la evaluacion (nombre)
              </label>
              <input
                id="gov-resp-name"
                className={field}
                value={value.responsibleName}
                onChange={(e) => onChange({ ...value, responsibleName: e.target.value })}
                placeholder="Nombre completo"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="gov-resp-role" className={label + " text-[12px]"}>
                Cargo
              </label>
              <input
                id="gov-resp-role"
                className={field}
                value={value.responsibleRole}
                onChange={(e) => onChange({ ...value, responsibleRole: e.target.value })}
                placeholder="Ej. Jefe de sistemas"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="gov-resp-area" className={label + " text-[12px]"}>
                Area / dependencia
              </label>
              <input
                id="gov-resp-area"
                className={field}
                value={value.responsibleArea}
                onChange={(e) => onChange({ ...value, responsibleArea: e.target.value })}
                placeholder="Ej. Oficina de tecnologias"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="gov-measure-type" className={label + " text-[12px]"}>
                Tipo de medicion
              </label>
              <select
                id="gov-measure-type"
                className={field}
                value={value.measurementType}
                onChange={(e) =>
                  onChange({
                    ...value,
                    measurementType: e.target.value as GovernanceMeasurementType,
                  })
                }
              >
                <option value="">Seleccione...</option>
                <option value="linea_base">{MEASUREMENT_TYPE_LABELS.linea_base}</option>
                <option value="seguimiento">{MEASUREMENT_TYPE_LABELS.seguimiento}</option>
                <option value="auditoria_interna">{MEASUREMENT_TYPE_LABELS.auditoria_interna}</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="gov-policy" className={label + " text-[12px]"}>
                Referencia a politica / plan de seguridad (codigo, version o enlace interno)
              </label>
              <input
                id="gov-policy"
                className={field}
                value={value.policyReference}
                onChange={(e) => onChange({ ...value, policyReference: e.target.value })}
                placeholder="Ej. POL-SEG-2025 v2 o URL intranet"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="gov-notes" className={label + " text-[12px]"}>
                Notas (opcional)
              </label>
              <textarea
                id="gov-notes"
                className={`${field} min-h-[3.5rem] resize-y`}
                value={value.notes}
                onChange={(e) => onChange({ ...value, notes: e.target.value })}
                placeholder="Observaciones para auditoria o tesis."
              />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-800"
            >
              <i className="fa-solid fa-floppy-disk text-sm" aria-hidden />
              Guardar registro
            </button>
            {(governanceRecordHasAnyContent(value) || value.updatedAt !== "") && (
              <button
                type="button"
                onClick={() => {
                  if (
                    !confirm(
                      "Borrar todo el registro de gobierno en este navegador? No afecta las respuestas del cuestionario NIST.",
                    )
                  ) {
                    return;
                  }
                  onClear();
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-800"
              >
                <i className="fa-solid fa-trash-can text-sm" aria-hidden />
                Eliminar registro
              </button>
            )}
            {saveOk && (
              <span className="text-xs font-semibold text-emerald-700">
                Guardado en este navegador.
              </span>
            )}
            {value.updatedAt && (
              <span className="text-[10px] text-zinc-500">
                Ultimo guardado: {new Date(value.updatedAt).toLocaleString("es-CL")}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const TOTAL = CONTROLS.length;
const SCREEN_RESULTS = TOTAL + 1;
const SCREEN_CORE = TOTAL + 2;
const SCREEN_HISTORIAL = TOTAL + 3;

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());
  const [histTick, setHistTick] = useState(0);
  const [govRecord, setGovRecord] = useState<GovernanceRecord>(() => emptyGovernanceRecord());
  const [govSaveOk, setGovSaveOk] = useState(false);

  useEffect(() => {
    setGovRecord(loadGovernanceRecord());
  }, []);

  const skipAnswersPersistOnce = useRef(true);
  useEffect(() => {
    setAnswers(loadAnswersSession());
  }, []);
  useEffect(() => {
    if (skipAnswersPersistOnce.current) {
      skipAnswersPersistOnce.current = false;
      return;
    }
    saveAnswersSession(answers);
  }, [answers]);

  const progress =
    screen >= 1 && screen <= TOTAL
      ? Math.round((screen / (TOTAL + 1)) * 100)
      : screen > 0
        ? 100
        : 0;

  const setAnswer = useCallback((controlId: string, qIdx: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [controlId]: { ...prev[controlId], [qIdx]: value },
    }));
  }, []);

  const toggleCard = (id: string) => {
    setOpenCards((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openCardsRef = useRef(openCards);
  openCardsRef.current = openCards;
  const openCardsBeforePrintRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    const allIds = new Set(CONTROLS.map((c) => c.id));
    const expandForPrint = () => {
      if (screen !== SCREEN_RESULTS) return;
      flushSync(() => {
        if (openCardsBeforePrintRef.current === null) {
          openCardsBeforePrintRef.current = new Set(openCardsRef.current);
        }
        setOpenCards(allIds);
      });
    };
    const restoreAfterPrint = () => {
      const prev = openCardsBeforePrintRef.current;
      if (prev) {
        setOpenCards(prev);
        openCardsBeforePrintRef.current = null;
      }
    };

    window.addEventListener("beforeprint", expandForPrint);
    window.addEventListener("afterprint", restoreAfterPrint);

    const mql = window.matchMedia("print");
    const onMql = () => {
      if (mql.matches) expandForPrint();
      else restoreAfterPrint();
    };
    if (mql.addEventListener) mql.addEventListener("change", onMql);
    else mql.addListener(onMql);

    return () => {
      window.removeEventListener("beforeprint", expandForPrint);
      window.removeEventListener("afterprint", restoreAfterPrint);
      if (mql.removeEventListener) mql.removeEventListener("change", onMql);
      else mql.removeListener(onMql);
    };
  }, [screen]);

  const goTo = (s: number) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restartEval = () => {
    setAnswers({});
    setOpenCards(new Set());
    goTo(0);
  };

  const calcScores = () => {
    return CONTROLS.map((control) => {
      const a = answers[control.id] || {};
      let score = 0, max = 0;
      control.questions.forEach((q, i) => {
        max += q.weight * 2;
        if (a[i] !== undefined) score += a[i] * q.weight;
      });
      const pct = max > 0 ? Math.round((score / max) * 100) : 0;
      return { control, score: pct, level: getMaturityLevel(pct) };
    });
  };

  const exportReport = () => {
    const escHtml = (t: string) =>
      t
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const scores = calcScores();
    const overall = overallBlockAveragePercentFromAnswers(answers);
    const date = new Date().toLocaleDateString("es-CL");
    const level = getMaturityLevel(overall);

    let html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe NIST CSF 2.0 - nistcsf.uptlibre.pe</title>
<style>body{font-family:'Segoe UI',system-ui,sans-serif;max-width:900px;margin:0 auto;padding:2rem;color:#1c1917;background:#fafaf9}
h1{color:#7f1d1d;border-bottom:3px solid #b91c1c;padding-bottom:.5rem}h2{color:#292524;margin-top:2rem;border-left:4px solid #b91c1c;padding-left:.75rem}
.score{font-size:3rem;font-weight:800;text-align:center;margin:1rem 0}.card{border:1px solid #e7e5e4;border-radius:8px;padding:1rem;margin:.75rem 0;page-break-inside:avoid}
.fw{background:#f5f5f4;border-radius:4px;padding:.5rem;margin:.25rem 0;font-size:.82rem}.fw strong{color:#991b1b}
.badge{display:inline-block;padding:.2rem .6rem;border-radius:12px;font-size:.75rem;font-weight:600}
.b-critical{background:#fee2e2;color:#dc2626}.b-low{background:#fef3c7;color:#d97706}.b-medium{background:#cffafe;color:#0891b2}.b-high{background:#d1fae5;color:#059669}
.bars{display:flex;align-items:flex-end;gap:10px;height:120px;margin:.6rem 0 .35rem 0;padding:.5rem;border:1px solid #e7e5e4;border-radius:10px;background:#fff}
.bar-item{flex:1;min-width:0;height:100%;text-align:center;display:flex;flex-direction:column;justify-content:flex-end}
.bar-col{display:block;width:100%;border-radius:8px 8px 0 0;min-height:4px}
.bar-done{background:#10b981}.bar-partial{background:#f59e0b}.bar-no{background:#ef4444}.bar-empty{background:#9ca3af}
.bar-label{font-size:.68rem;color:#57534e;margin-top:.25rem}
.kpi{display:inline-block;margin-right:.45rem;margin-bottom:.25rem;padding:.18rem .5rem;border-radius:8px;border:1px solid #e7e5e4;background:#fff;font-size:.74rem}
.disclaimer{margin-top:3rem;padding:1rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:.78rem;color:#64748b}
</style></head><body>`;
    html += `<h1>Informe de evaluacion de ciberseguridad</h1>`;
    html += `<p><strong>Fecha:</strong> ${date}</p>`;
    html += `<p><strong>Metodologia:</strong> NIST CSF 2.0 Core — 106 subcategorias (Anexo A NIST.CSWP.29), agrupadas en 10 controles base (C0-C9); una pregunta por subcategoria</p>`;
    html += `<p><strong>Marco de referencia unico:</strong> NIST CSF 2.0 (National Institute of Standards and Technology, EE.UU.)</p>`;
    html += `<p style="font-size:.85rem"><strong>Base metodologica:</strong> 10 controles (C0-C9) como secciones de evaluacion; 106 subcategorias del Anexo A. Cada subcategoria tiene un Outcome oficial en el Core NIST (ingles).</p>`;
    if (governanceRecordHasAnyContent(govRecord)) {
      const g = govRecord;
      const mt =
        g.measurementType && g.measurementType in MEASUREMENT_TYPE_LABELS
          ? MEASUREMENT_TYPE_LABELS[g.measurementType as keyof typeof MEASUREMENT_TYPE_LABELS]
          : "";
      html += `<h2>Registro de gobierno de la evaluacion</h2><div class="card" style="background:#fafaf9"><p style="font-size:.8rem;margin:.35rem 0"><strong>Institucion:</strong> ${escHtml(g.institutionName) || "—"}</p>`;
      html += `<p style="font-size:.8rem;margin:.35rem 0"><strong>Alcance:</strong> ${escHtml(g.scopeText).replace(/\n/g, "<br>") || "—"}</p>`;
      const respParts = [g.responsibleName, g.responsibleRole, g.responsibleArea].map((x) => x.trim()).filter(Boolean);
      html += `<p style="font-size:.8rem;margin:.35rem 0"><strong>Responsable:</strong> ${respParts.length ? respParts.map((x) => escHtml(x)).join(" · ") : "—"}</p>`;
      html += `<p style="font-size:.8rem;margin:.35rem 0"><strong>Tipo de medicion:</strong> ${escHtml(mt) || "—"}</p>`;
      html += `<p style="font-size:.8rem;margin:.35rem 0"><strong>Politica / plan (referencia):</strong> ${escHtml(g.policyReference) || "—"}</p>`;
      if (g.notes.trim()) html += `<p style="font-size:.8rem;margin:.35rem 0"><strong>Notas:</strong> ${escHtml(g.notes).replace(/\n/g, "<br>")}</p>`;
      if (g.updatedAt) html += `<p style="font-size:.72rem;color:#64748b;margin-top:.5rem">Registro actualizado: ${escHtml(new Date(g.updatedAt).toLocaleString("es-CL"))}</p>`;
      html += `</div>`;
    }
    html += `<div class="score">${overall}% <span class="badge b-${level.cls}">${level.label}</span></div>`;
    html += `<p style="text-align:center">${level.desc}</p>`;
    html += `<h2>Resultados por area (Core CSF)</h2>`;

    scores.forEach((s) => {
      const ans = answers[s.control.id] || {};
      html += `<div class="card"><h3>Control ${s.control.baseControlCode}: ${s.control.name} <span class="badge b-${s.level.cls}">${s.score}%</span></h3>`;
      html += `<p style="font-size:.82rem;color:#64748b">${s.control.description}</p>`;
      html += `<p style="font-size:.78rem;color:#57534e;margin-top:.35rem"><strong>Catalogo marco de 10:</strong> ${BASE_CONTROL_NAMES[s.control.baseControlCode] ?? s.control.baseControlCode}</p>`;
      html += `<p style="font-size:.78rem;color:#57534e;margin:.25rem 0 0 0">${s.control.baseControlNote}</p>`;
      html += `<h4 style="margin-top:.75rem;font-size:.82rem;color:#b91c1c">Subcategorias: respuesta</h4>`;
      const stats = s.control.questions.reduce(
        (acc, _q, qi) => {
          const val = ans[qi];
          if (val === 2) acc.done += 1;
          else if (val === 1) acc.partial += 1;
          else if (val === 0) acc.notDone += 1;
          else acc.empty += 1;
          return acc;
        },
        { done: 0, partial: 0, notDone: 0, empty: 0 },
      );
      const total = s.control.questions.length || 1;
      const wDone = (stats.done / total) * 100;
      const wPartial = (stats.partial / total) * 100;
      const wNo = (stats.notDone / total) * 100;
      const wEmpty = (stats.empty / total) * 100;
      html += `<div><strong style="font-size:.78rem;color:#444">Grafico de barras del control:</strong>`;
      html += `<div class="bars">`;
      html += `<div class="bar-item"><div class="bar-col bar-done" style="height:${stats.done > 0 ? Math.max(wDone, 4) : 0}%"></div><div class="bar-label">Si</div></div>`;
      html += `<div class="bar-item"><div class="bar-col bar-partial" style="height:${stats.partial > 0 ? Math.max(wPartial, 4) : 0}%"></div><div class="bar-label">Parcial</div></div>`;
      html += `<div class="bar-item"><div class="bar-col bar-no" style="height:${stats.notDone > 0 ? Math.max(wNo, 4) : 0}%"></div><div class="bar-label">No</div></div>`;
      html += `<div class="bar-item"><div class="bar-col bar-empty" style="height:${stats.empty > 0 ? Math.max(wEmpty, 4) : 0}%"></div><div class="bar-label">Sin resp.</div></div>`;
      html += `</div>`;
      html += `<span class="kpi">Si: <strong>${stats.done}</strong></span><span class="kpi">Parcial: <strong>${stats.partial}</strong></span><span class="kpi">No: <strong>${stats.notDone}</strong></span><span class="kpi">Sin respuesta: <strong>${stats.empty}</strong></span></div>`;
      s.control.questions.forEach((q, qi) => {
        const v = ans[qi];
        const label = v === undefined ? "sin respuesta" : v === 2 ? "implementado" : v === 1 ? "parcial" : "no";
        const preguntaEs = escHtml(questionPlainBody(q.text, q.subcategoryId));
        html += `<div class="fw"><strong>${q.subcategoryId}</strong> (${escHtml(q.categoryEs)})<br><span style="font-size:.78rem;line-height:1.35;display:block;margin:.25rem 0;color:#444"><strong>Pregunta:</strong> ${preguntaEs}</span><span style="font-size:.78rem">Respuesta: <strong>${label}</strong></span>`;
        html += `</div>`;
      });
      html += `<div class="fw" style="margin-top:.5rem"><strong>Funcion dominante:</strong> ${s.control.csf.function} — ${s.control.csf.category}</div></div>`;
    });

    html += `<div class="disclaimer"><strong>Asesor de Ciberseguridad - uptlibre</strong><br>
Esta herramienta es una herramienta de evaluación de madurez en ciberseguridad basada en el NIST Cybersecurity Framework (CSF) 2.0.
Su propósito es estimar el nivel de madurez organizacional frente a los resultados esperados (Outcomes) del Core del NIST CSF 2.0, identificando brechas, prioridades y oportunidades de mejora.
No sustituye la documentación oficial del NIST ni una auditoría formal, ni constituye asesoramiento legal o regulatorio. El NIST CSF se utiliza como marco de referencia internacionalmente reconocido y validado por expertos, tras el análisis comparativo de diversos marcos y normas (ISO, buenas prácticas y modelos de riesgo).
La herramienta está diseñada para auto‑diagnóstico, gestión del riesgo y mejora continua, y puede apoyar procesos de gobernanza, ERM y toma de decisiones estratégicas.
<br><br>Para corregir brechas por subcategoria use el archivo Excel exportado (Checklist), donde cada recomendacion queda en filas separadas para seguimiento.
<br><br>Herramienta v${APP_VERSION} (${APP_DATE}).
<br><br><a href="${REPO_URL}">Codigo fuente (GitHub)</a> — Licencia MIT</div></body></html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Informe_NIST_CSF_nistcsf_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();
    CONTROLS.forEach((control) => {
      const ans = answers[control.id] || {};
      const rows: Array<{
        Control: string;
        Categoria: string;
        Subcategoria: string;
        Pregunta: string;
        Respuesta: string;
        Recomendaciones: string;
        Checklist: string;
      }> = [];
      const merges: XLSX.Range[] = [];
      control.questions.forEach((q, qi) => {
        const v = ans[qi];
        const response = v === undefined ? "Sin respuesta" : v === 2 ? "Si implementado" : v === 1 ? "Parcialmente" : "No implementado";
        const shouldRecommend = v !== 2;
        const recommendations = shouldRecommend ? (q.implementationExamplesEs ?? []) : [];
        const rowStart = rows.length;
        const baseData = {
          Control: `${control.baseControlCode} - ${control.name}`,
          Categoria: q.categoryEs,
          Subcategoria: q.subcategoryId,
          Pregunta: questionPlainBody(q.text, q.subcategoryId),
          Respuesta: response,
        };
        if (recommendations.length > 0) {
          recommendations.forEach((line) => {
            rows.push({
              ...baseData,
              Recomendaciones: line,
              Checklist: "",
            });
          });
        } else {
          rows.push({
            ...baseData,
            Recomendaciones: shouldRecommend ? "Sin recomendacion catalogada" : "No aplica",
            Checklist: shouldRecommend ? "" : "x",
          });
        }
        const rowEnd = rows.length - 1;
        if (rowEnd > rowStart) {
          // Une columnas base para no repetir visualmente cuando hay varias recomendaciones.
          for (let col = 0; col <= 4; col += 1) {
            merges.push({
              s: { r: rowStart + 1, c: col },
              e: { r: rowEnd + 1, c: col },
            });
          }
        }
      });
      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet["!merges"] = merges;
      worksheet["!cols"] = [
        { wch: 34 }, // Control
        { wch: 28 }, // Categoria
        { wch: 16 }, // Subcategoria
        { wch: 72 }, // Pregunta
        { wch: 20 }, // Respuesta
        { wch: 62 }, // Recomendaciones
        { wch: 12 }, // Checklist
      ];
      worksheet["!autofilter"] = { ref: "A1:G1" };
      worksheet["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2", activePane: "bottomLeft", state: "frozen" } as never;
      const sheetName = control.baseControlCode;
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });
    XLSX.writeFile(workbook, `Checklist_NIST_CSF_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportQuestionnaireExcel = () => {
    const workbook = XLSX.utils.book_new();
    CONTROLS.forEach((control) => {
      const rows: Array<{
        Control: string;
        Categoria: string;
        Subcategoria: string;
        Pregunta: string;
        Checklist: string;
      }> = [];
      const merges: XLSX.Range[] = [];
      control.questions.forEach((q) => {
        const rowStart = rows.length;
        rows.push({
          Control: `${control.baseControlCode} - ${control.name}`,
          Categoria: q.categoryEs,
          Subcategoria: q.subcategoryId,
          Pregunta: questionPlainBody(q.text, q.subcategoryId),
          Checklist: "",
        });
        const rowEnd = rows.length - 1;
        if (rowEnd > rowStart) {
          for (let col = 0; col <= 3; col += 1) {
            merges.push({
              s: { r: rowStart + 1, c: col },
              e: { r: rowEnd + 1, c: col },
            });
          }
        }
      });
      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet["!merges"] = merges;
      worksheet["!cols"] = [
        { wch: 34 }, // Control
        { wch: 28 }, // Categoria
        { wch: 16 }, // Subcategoria
        { wch: 90 }, // Pregunta
        { wch: 14 }, // Checklist
      ];
      worksheet["!autofilter"] = { ref: "A1:E1" };
      worksheet["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2", activePane: "bottomLeft", state: "frozen" } as never;
      const sheetName = control.baseControlCode;
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });
    XLSX.writeFile(workbook, `Cuestionario_NIST_CSF_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ─── RENDER ───
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 overflow-x-hidden">
      <SiteHeader />
      <SiteNavigation screen={screen} progress={progress} onGoTo={goTo} onRestartEval={restartEval} />

      {/* MAIN: inicio en dos bloques (hero ancho + contenido); resto en ficha */}
      <main className="flex-1 w-full min-w-0">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-12 pt-2">
          {screen === 0 ? (
            <>
              <div className="animate-in w-[100vw] max-w-[100vw] relative left-1/2 -translate-x-1/2 -mt-1 overflow-x-hidden sm:-mt-2">
              <section className="relative overflow-hidden rounded-b-2xl border border-red-100 bg-gradient-to-br from-white via-red-50/90 to-orange-50/50 shadow-sm ring-1 ring-red-100/80 sm:rounded-b-3xl">
                <div className="absolute inset-0 hero-grid-pattern opacity-100" />
                <div className="pointer-events-none absolute top-1/2 left-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-200/25 blur-3xl" />
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-300 via-white to-red-300" aria-hidden />

                <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-20 text-center">

                  {/* Title */}
                  <h2 className="animate-fade-in-up-d1 text-3xl md:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight mb-1 md:mb-2 leading-tight font-serif">
                    Asesor de<br />
                    <span className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">Ciberseguridad</span>
                  </h2>

                  {/* Subtitle */}
                  <p className="animate-fade-in-up-d2 text-sm md:text-xl text-zinc-600 font-medium mt-2 md:mt-4 mb-3 md:mb-4 max-w-2xl mx-auto leading-relaxed">
                    Las 106 subcategorias oficiales del Core (NIST.CSWP.29) en 10 bloques (C0 a C9). Cada pregunta enlaza al Outcome del estandar; puede guardar mediciones en este navegador y comparar en el tiempo.
                  </p>
                  {/* Status badges */}
                  <div className="animate-fade-in-up-d3 flex flex-wrap justify-center gap-1.5 md:gap-2 mb-5 md:mb-8">
                    {[
                      { label: "Anonimo", color: "emerald" },
                      { label: "Seguro", color: "blue" },
                      { label: "Sin Rastreo", color: "purple" },
                      { label: "MIT License", color: "amber" },
                    ].map((b) => (
                      <span key={b.label} className="glass text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-zinc-700">
                        {b.label}
                      </span>
                    ))}
                  </div>

                  {/* Framework chips */}
                  <div className="animate-fade-in-up-d4 hidden md:flex flex-wrap justify-center gap-1.5 mb-10">
                    {CSF_FUNCTIONS.map((f) => (
                      <span key={f.code} className="text-[12px] font-mono font-semibold px-2.5 py-1 rounded-md bg-white/90 text-zinc-700 border border-red-100 shadow-sm" title={f.nameEn}>
                        {f.code} · {f.nameEs}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="animate-fade-in-up-d5">
                    <button type="button" onClick={() => goTo(1)}
                      className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 md:px-10 py-3 md:py-4 rounded-lg text-base md:text-lg shadow-md shadow-red-200/80 hover:-translate-y-0.5 transition-all ring-1 ring-red-300/60 animate-pulse-glow">
                      <i className="fa-solid fa-play text-sm md:text-base opacity-90" aria-hidden />
                      Comenzar evaluacion
                    </button>
                  </div>

                  {/* Social share */}
                  <div className="animate-fade-in-up-d5 flex items-center justify-center gap-1.5 md:gap-2 mt-5 md:mt-8 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[10px] md:text-[11px] text-zinc-500 font-semibold mr-0.5">
                      <i className="fa-solid fa-share-nodes text-[11px]" aria-hidden />
                      Compartir:
                    </span>
                    <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Evalua madurez con NIST CSF 2.0 (uptlibre)")}&url=${encodeURIComponent(`${PUBLIC_SITE}/`)}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:border-red-200 hover:bg-red-50 text-xs font-bold transition-colors shadow-sm">
                      <i className="fa-brands fa-x-twitter text-sm" aria-hidden />
                      X
                    </a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${PUBLIC_SITE}/`)}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:border-red-200 hover:bg-red-50 text-xs font-bold transition-colors shadow-sm">
                      <i className="fa-brands fa-facebook text-sm" aria-hidden />
                      Facebook
                    </a>
                    <a href={`https://wa.me/?text=${encodeURIComponent(`Evalua madurez NIST CSF 2.0 ${PUBLIC_SITE}/ `)}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:border-red-200 hover:bg-red-50 text-xs font-bold transition-colors shadow-sm">
                      <i className="fa-brands fa-whatsapp text-sm" aria-hidden />
                      WhatsApp
                    </a>
                  </div>

                  {/* Legal line */}
                  <p className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[12px] text-zinc-500">
                    <i className="fa-solid fa-book-open text-[12px] text-zinc-400" aria-hidden />
                    <span>NIST CSF 2.0 · Referencia: csrc.nist.gov · Sin afiliacion a NIST</span>
                  </p>
                </div>

                {/* Bottom shimmer bar */}
                <div className="h-1 animate-shimmer" />
              </section>
              </div>

              <div className="animate-in mx-auto max-w-6xl space-y-12 px-0 pt-6 pb-2 sm:px-2">
                <section
                  aria-labelledby="home-beneficios"
                  className="relative scroll-mt-24 -mx-4 overflow-hidden px-4 py-14 sm:-mx-6 sm:px-8 sm:py-16"
                >
                  <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -right-24 top-0 h-[22rem] w-[22rem] rounded-full bg-amber-100/30 blur-3xl" />
                    <div className="absolute -left-20 bottom-0 h-[26rem] w-[26rem] rounded-full bg-red-100/25 blur-3xl" />
                    <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(254,242,242,0.12)_0%,transparent_35%,transparent_65%,rgba(254,226,226,0.1)_100%)]" />
                  </div>
                  <div className="relative mx-auto max-w-6xl">
                    <h2 id="home-beneficios" className="sr-only">Caracteristicas de la herramienta</h2>
                    <header className="mb-10 max-w-2xl sm:mb-14">
                      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600/90">
                        Como trabaja la plataforma
                      </p>
                      <p className="mt-2 font-serif text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-[1.75rem]">
                        Tres pilares <span className="text-red-700">sin friccion</span>
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                        Privacidad local, un solo marco normativo NIST y registro de mediciones en tu propio navegador.
                      </p>
                    </header>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 md:gap-y-6">
                      {[
                        {
                          faClass: "fa-solid fa-user-shield",
                          kicker: "PRIVACIDAD",
                          title: "100% Anonimo",
                          desc: "Sin registro, sin cookies, sin tracking. Tu evaluacion es completamente privada.",
                        },
                        {
                          faClass: "fa-solid fa-sitemap",
                          kicker: "MARCO UNICO",
                          title: "Solo NIST CSF 2.0",
                          desc: "Cuestionario e informe en funciones y subcategorias del Core (GV, ID, PR, DE, RS, RC).",
                        },
                        {
                          faClass: "fa-solid fa-chart-line",
                          kicker: "EVOLUCION",
                          title: "Seguimiento en el tiempo",
                          desc: "Guarda mediciones en este navegador, compara fechas y exporta informes para ver la evolucion.",
                        },
                      ].map((f, i) => (
                        <div
                          key={f.title}
                          className={`group relative ${i === 1 ? "md:translate-y-10" : ""}`}
                        >
                          <div className="relative rounded-[1.75rem] bg-gradient-to-br from-red-100/90 via-white to-zinc-100/80 p-[2px] shadow-[0_20px_50px_-18px_rgba(24,24,27,0.14)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_28px_60px_-14px_rgba(185,28,28,0.22)]">
                            <div className="rounded-[1.65rem] bg-white/90 px-5 pb-6 pt-8 text-center backdrop-blur-md">
                              <div
                                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-50 to-white text-2xl text-red-600 shadow-inner ring-1 ring-red-100/70"
                                aria-hidden
                              >
                                <i className={f.faClass} />
                              </div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-600/85">
                                {f.kicker}
                              </p>
                              <h3 className="mt-2 font-serif text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
                                {f.title}
                              </h3>
                              <div
                                className="mx-auto mt-4 h-px max-w-[3.5rem] bg-gradient-to-r from-transparent via-red-400/70 to-transparent opacity-70 transition group-hover:opacity-100 group-hover:via-red-500"
                                aria-hidden
                              />
                              <p className="mt-4 text-left text-sm leading-relaxed text-zinc-600 sm:text-center">
                                {f.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <InstrumentResearchDimensionsSection />

                <GovernanceRecordSection
                  value={govRecord}
                  onChange={setGovRecord}
                  onSave={() => {
                    saveGovernanceRecord(govRecord);
                    setGovRecord(loadGovernanceRecord());
                    setGovSaveOk(true);
                    window.setTimeout(() => setGovSaveOk(false), 2800);
                  }}
                  onClear={() => {
                    clearGovernanceRecord();
                    setGovRecord(emptyGovernanceRecord());
                    setGovSaveOk(false);
                  }}
                  saveOk={govSaveOk}
                />

                <section
                  aria-labelledby="home-controles-base"
                  className="relative scroll-mt-24 -mx-4 overflow-hidden px-4 py-14 sm:-mx-6 sm:px-8 sm:py-16"
                >
                  <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -left-20 top-0 h-[28rem] w-[28rem] rounded-full bg-red-200/20 blur-3xl" />
                    <div className="absolute -right-16 bottom-0 h-[22rem] w-[22rem] rounded-full bg-rose-100/35 blur-3xl" />
                    <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(254,226,226,0.14)_42%,rgba(255,255,255,0)_55%,rgba(254,242,242,0.1)_100%)]" />
                  </div>
                  <div className="relative mx-auto max-w-6xl">
                    <header className="mb-10 max-w-2xl sm:mb-14">
                      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-600/90">
                        Nucleo de evaluacion
                      </p>
                      <h2
                        id="home-controles-base"
                        className="mt-2 font-serif text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-[1.75rem]"
                      >
                        Diez controles base <span className="text-red-700">C0 a C9</span>
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                        Cada bloque agrupa una faceta del marco; dentro, las preguntas recorren las subcategorias del Core NIST CSF 2.0 (Anexo A).
                      </p>
                    </header>
                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 md:grid-cols-5 md:gap-x-5 md:gap-y-12">
                      {(Object.keys(BASE_CONTROL_NAMES) as (keyof typeof BASE_CONTROL_NAMES)[])
                        .sort()
                        .map((code, i) => (
                          <div
                            key={code}
                            className={`group relative ${i % 2 === 1 ? "md:translate-y-10" : ""}`}
                          >
                            <div className="relative rounded-[1.75rem] bg-gradient-to-br from-red-100/90 via-white to-zinc-100/80 p-[2px] shadow-[0_20px_50px_-18px_rgba(24,24,27,0.14)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_28px_60px_-14px_rgba(185,28,28,0.22)]">
                              <div className="rounded-[1.65rem] bg-white/90 px-4 pb-5 pt-7 text-center backdrop-blur-md">
                                <span className="block font-mono text-[1.65rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-600 via-red-700 to-zinc-800 sm:text-[1.85rem]">
                                  {code}
                                </span>
                                <div
                                  className="mx-auto mt-4 h-px max-w-[3rem] bg-gradient-to-r from-transparent via-red-400/70 to-transparent opacity-60 transition group-hover:opacity-100 group-hover:via-red-500"
                                  aria-hidden
                                />
                                <p className="mt-3 text-left text-[12px] font-semibold leading-snug text-zinc-800 sm:text-center">
                                  {BASE_CONTROL_NAMES[code]}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </section>
              </div>
            </>
          ) : (
            <article
              className={`mx-auto rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm ring-1 ring-red-50 md:p-8 ${
                screen === SCREEN_CORE ? "max-w-6xl" : "max-w-4xl"
              }`}
              aria-label={
                screen === SCREEN_RESULTS
                  ? "Resultados"
                  : screen === SCREEN_CORE
                    ? "Tabla Core CSF"
                    : screen === SCREEN_HISTORIAL
                      ? "Seguimiento longitudinal"
                      : "Cuestionario por control base"
              }
            >
          {CONTROLS.map((control, idx) => screen === idx + 1 && (
            <div key={control.id} className="animate-in">
              <QuestionScreen
                control={control}
                idx={idx}
                answers={answers[control.id] || {}}
                onAnswer={(qIdx, val) => setAnswer(control.id, qIdx, val)}
                onPrev={() => goTo(idx === 0 ? 0 : idx)}
                onNext={() => goTo(idx + 2)}
                isLast={idx === TOTAL - 1}
                onResults={() => goTo(SCREEN_RESULTS)}
                current={idx + 1}
                total={TOTAL}
              />
            </div>
          ))}

          {/* RESULTS */}
          {screen === SCREEN_RESULTS && (
            <div className="animate-in">
              <Results
                scores={calcScores()}
                answers={answers}
                openCards={openCards}
                toggleCard={toggleCard}
                onExport={exportReport}
                onExportExcel={exportExcel}
                onExportQuestionnaireExcel={exportQuestionnaireExcel}
                onHistorial={() => goTo(SCREEN_HISTORIAL)}
                governanceRecord={govRecord}
              />
            </div>
          )}

          {screen === SCREEN_HISTORIAL && (
            <div className="animate-in">
              <SeguimientoScreen
                answers={answers}
                histTick={histTick}
                onMutate={() => setHistTick((t) => t + 1)}
              />
            </div>
          )}

          {/* MAPPING TABLE */}
          {screen === SCREEN_CORE && (
            <div className="animate-in">
              <h2 className="flex flex-wrap items-center justify-center gap-2 text-2xl md:text-3xl font-black text-center text-zinc-900 tracking-tight mb-2 font-serif">
                <i className="fa-solid fa-table-list text-red-600 text-2xl md:text-3xl" aria-hidden />
                Core NIST CSF 2.0 completo
              </h2>
              <p className="text-sm text-zinc-600 text-center mb-6">
                Listado de las 106 subcategorias oficiales (NIST.CSWP.29 Anexo A). La numeracion no es consecutiva: los huecos son propios del estandar.
              </p>
              <div className="overflow-x-auto rounded-lg border border-zinc-200 shadow-sm bg-white max-h-[70vh] overflow-y-auto ring-1 ring-red-100/60">
                <table className="w-full text-left text-xs min-w-[820px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm">
                      <th className="px-3 py-3 font-bold text-[13px]">Ctrl</th>
                      <th className="px-3 py-3 font-bold text-[13px]">ID</th>
                      <th className="px-3 py-3 font-bold text-[13px]">Fn</th>
                      <th className="px-3 py-3 font-bold text-[13px]">Categoria</th>
                      <th className="px-3 py-3 font-bold text-[13px]">Outcome (ES)</th>
                      <th className="px-3 py-3 font-bold text-[13px] whitespace-nowrap">pdf | pag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CSF_CATALOG_ITEMS.map((row, i) => (
                      <tr key={row.id} className={`border-t border-zinc-100 ${i % 2 === 0 ? "bg-white" : "bg-red-50/30"} hover:bg-red-50/80 transition-colors`}>
                        <td className="px-3 py-2 font-mono font-black text-red-600">C{row.phase - 1}</td>
                        <td className="px-3 py-2 font-mono font-semibold text-zinc-900">{row.id}</td>
                        <td className="px-3 py-2 font-mono font-semibold text-red-700">{row.function}</td>
                        <td className="px-3 py-2 text-zinc-800">{row.categoryKey} — {row.categoryEs}</td>
                        <td className="px-3 py-2 text-zinc-800 leading-relaxed">{row.outcomeEs ?? "—"}</td>
                        <td className="px-3 py-2 align-top whitespace-nowrap text-[11px] font-semibold">
                          <a href={NIST_CSF_CSWP29_PDF_URL} target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:text-red-900">
                            pdf
                          </a>
                          <span className="text-zinc-300 mx-1">|</span>
                          <span className="text-zinc-700 font-mono">{row.page}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                <p className="text-[12px] font-semibold text-zinc-800">Fuentes oficiales NIST (PDF y pagina)</p>
                <p className="text-[11px] leading-relaxed">
                  <a href={NIST_CSF_CSWP29_PDF_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-700 underline hover:text-red-900">
                    pdf
                  </a>
                  <span className="text-zinc-400 mx-1">|</span>
                  <a href={NIST_CSF_CSWP29_FINAL_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-700 underline hover:text-red-900">
                    pag
                  </a>
                  <span className="text-zinc-400 mx-1">|</span>
                  <a href={NIST_CSF_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-700 underline hover:text-red-900">
                    portal
                  </a>
                  <span className="text-zinc-400 mx-1">|</span>
                  <a href={NIST_CSF_INFORMATIVE_REFERENCES_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-700 underline hover:text-red-900">
                    informative references
                  </a>
                </p>
              </div>
            </div>
          )}
            </article>
          )}
        </div>
      </main>

      <SiteFooter />

      <a
        href={UPTLIBRE_PORTAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="no-print fixed bottom-4 right-4 z-30 inline-flex max-w-[min(100vw-2rem,14rem)] items-center gap-2 rounded-full border border-red-200 bg-white/95 px-3 py-2 text-[10px] font-bold text-red-800 shadow-lg backdrop-blur-sm ring-1 ring-red-100/80 transition-colors hover:bg-red-50 sm:text-[11px]"
        title="UPTLIBRE — Grupo Libertad y Pensamiento, Facultad de Ingenieria UPT"
      >
        <i className="fa-solid fa-flask shrink-0 text-[12px]" aria-hidden />
        <span className="min-w-0 truncate">UPTLIBRE</span>
      </a>
    </div>
  );
}

function questionPlainBody(text: string, subcategoryId: string): string {
  const prefix = `${subcategoryId}: `;
  return text.startsWith(prefix) ? text.slice(prefix.length) : text;
}

// ─── QUESTION SCREEN COMPONENT ───
function QuestionScreen({
  control, idx, answers, onAnswer, onPrev, onNext, isLast, onResults, current, total,
}: {
  control: Control; idx: number; answers: Record<number, number>;
  onAnswer: (qIdx: number, val: number) => void;
  onPrev: () => void; onNext: () => void;
  isLast: boolean; onResults: () => void;
  current: number; total: number;
}) {
  const [showTechnical, setShowTechnical] = useState(false);
  const catalogLabel = BASE_CONTROL_NAMES[control.baseControlCode] ?? "";
  const nQ = control.questions.length;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-5 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm ring-1 ring-zinc-100 md:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className={`mx-auto sm:mx-0 shrink-0 flex h-14 w-14 flex-col items-center justify-center gap-0.5 rounded-xl bg-gradient-to-br ${GRADIENT_COLORS[idx]} text-white shadow-md`}>
            <i className={`${control.icon} text-lg opacity-95`} aria-hidden />
            <span className="font-mono font-black text-[11px] leading-none">{control.baseControlCode}</span>
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-red-700">
              Paso {current} de {total} · {nQ} {nQ === 1 ? "pregunta" : "preguntas"}
            </p>
            <h2 className="mt-1 text-lg font-extrabold leading-snug text-zinc-900 md:text-xl font-serif">
              <i className={`${control.icon} mr-1.5 text-red-700`} aria-hidden />
              <span className="text-red-800">{control.baseControlCode}</span>
              {catalogLabel ? ` — ${catalogLabel}` : ""}
            </h2>
            <p className="mt-1 text-xs font-medium text-zinc-500 leading-snug">{control.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-800">{control.plainIntro}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTechnical((v) => !v)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 py-2.5 text-xs font-semibold text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50/50 hover:text-red-800"
          aria-expanded={showTechnical}
        >
          {showTechnical ? "Ocultar detalle tecnico" : "Ver detalle tecnico (codigos NIST)"}
          <i className={`fa-solid text-[12px] ${showTechnical ? "fa-chevron-up" : "fa-chevron-down"}`} aria-hidden />
        </button>

        {showTechnical && (
          <div className="mt-3 space-y-3 rounded-lg border border-amber-200/80 bg-amber-50/40 p-3 text-left">
            <p className="text-[12px] font-bold uppercase tracking-wider text-amber-900">Referencia marco de 10 y NIST</p>
            <p className="text-[13px] text-zinc-700">
              <span className="font-mono font-bold text-red-800">{control.baseControlCode}</span>
              {catalogLabel ? ` — ${catalogLabel}` : ""}
            </p>
            <p className="text-[13px] leading-relaxed text-zinc-600">{control.baseControlNote}</p>
            <p className="text-[12px] font-mono text-zinc-600 break-words leading-relaxed max-h-32 overflow-y-auto border border-amber-200/60 rounded bg-white/80 p-2">
              {control.subcategoryIds.join(", ")}
            </p>
            <p className="text-[12px] text-zinc-500">{control.description}</p>
          </div>
        )}
      </div>

      <div className="mb-5 rounded-lg border-l-4 border-l-red-400 bg-red-50/70 px-4 py-3 shadow-sm">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-bold text-red-800">
          <i className="fa-solid fa-circle-exclamation text-sm" aria-hidden />
          Por que importa este bloque
        </p>
        <p className="mt-1 text-[14px] leading-relaxed text-zinc-800">{control.plainRiskLine}</p>
      </div>

      <div className="mb-3 rounded-md bg-zinc-100/80 px-3 py-2">
        <p className="text-[12px] font-medium text-zinc-700 leading-relaxed">
          <strong className="inline-flex items-center gap-1.5 text-zinc-900">
            <i className="fa-solid fa-circle-info text-red-600 text-sm" aria-hidden />
            Como leer cada pregunta:
          </strong> NIST no publica un cuestionario Si/No; publica un <strong>Outcome</strong> (resultado deseado de la organizacion). La frase en español abajo es una traduccion/parafrasis para que puedas evaluar si eso se cumple. La frase en ingles gris es la del documento oficial (Anexo A, NIST.CSWP.29). Las 106 subcategorias del Core NIST CSF 2.0 son el marco unico de este instrumento.
        </p>
        <p className="text-[12px] text-zinc-600 mt-2">
          Responde segun la situacion <strong>hoy</strong> (no el objetivo futuro). Puedes volver atras y cambiar respuestas.
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-3 mb-5">
        {control.questions.map((q, qIdx) => (
          <div key={qIdx} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm hover:border-red-100 hover:shadow-md transition-shadow">
            <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-b border-zinc-100 pb-2">
              <span className="font-mono text-[13px] font-bold text-red-800">{q.subcategoryId}</span>
              <span className="text-[13px] text-zinc-500">{q.categoryEs}</span>
            </div>
            <p className="text-[14px] font-semibold text-zinc-900 mb-2 leading-relaxed">{questionPlainBody(q.text, q.subcategoryId)}</p>
            <div className="rounded-md border border-slate-200 bg-slate-50/90 px-3 py-2 mb-3">
              <p className="mb-1 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                <i className="fa-solid fa-language text-[12px]" aria-hidden />
                Outcome oficial NIST (ingles)
              </p>
              <p className="text-[13px] leading-snug text-slate-700 italic">{q.outcomeEn}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {([
                { val: 2, label: "Si, implementado", cls: "emerald", fa: "fa-check" as const },
                { val: 1, label: "Parcialmente", cls: "amber", fa: "fa-minus" as const },
                { val: 0, label: "No implementado", cls: "red", fa: "fa-xmark" as const },
              ] as const).map((opt) => {
                const selected = answers[qIdx] === opt.val;
                const base = "inline-flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-1.5 rounded-md border-2 transition-all";
                const styles = {
                  emerald: selected ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-zinc-200 text-zinc-500 hover:border-emerald-300 hover:text-emerald-700",
                  amber: selected ? "border-amber-500 bg-amber-50 text-amber-800" : "border-zinc-200 text-zinc-500 hover:border-amber-300 hover:text-amber-700",
                  red: selected ? "border-red-500 bg-red-50 text-red-800" : "border-zinc-200 text-zinc-500 hover:border-red-300 hover:text-red-700",
                };
                return (
                  <button type="button" key={opt.val} onClick={() => onAnswer(qIdx, opt.val)} className={`${base} ${styles[opt.cls]}`}>
                    <i className={`fa-solid ${opt.fa} text-[13px]`} aria-hidden />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-zinc-200 pt-5">
        <button type="button" onClick={onPrev} className="inline-flex items-center gap-2 rounded-md border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition-all hover:bg-zinc-50 hover:text-zinc-900">
          <i className="fa-solid fa-arrow-left text-xs" aria-hidden />
          Anterior
        </button>
        <span className="text-xs font-medium text-zinc-500">{control.baseControlCode} · paso {current} de {total}</span>
        {isLast ? (
          <button type="button" onClick={onResults} className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2 text-sm font-bold text-white shadow-sm ring-1 ring-red-300/50 transition-all hover:bg-red-700">
            Ver Resultados
            <i className="fa-solid fa-chart-pie text-xs" aria-hidden />
          </button>
        ) : (
          <button type="button" onClick={onNext} className="inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2 text-sm font-bold text-white shadow-sm ring-1 ring-red-300/50 transition-all hover:bg-red-700">
            Siguiente
            <i className="fa-solid fa-arrow-right text-xs" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── RESULTS COMPONENT ───
function Results({
  scores, answers, openCards, toggleCard, onExport, onExportExcel, onExportQuestionnaireExcel,
  onHistorial,
  governanceRecord,
}: {
  scores: { control: Control; score: number; level: ReturnType<typeof getMaturityLevel> }[];
  answers: Answers;
  openCards: Set<string>;
  toggleCard: (id: string) => void;
  onExport: () => void;
  onExportExcel: () => void;
  onExportQuestionnaireExcel: () => void;
  onHistorial: () => void;
  governanceRecord: GovernanceRecord;
}) {
  const [selectedControlId, setSelectedControlId] = useState<string>("");

  const overall = overallBlockAveragePercentFromAnswers(answers);
  const overallLevel = getMaturityLevel(overall);
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (overall / 100) * circumference;

  const levelColors: Record<string, string> = {
    critical: "bg-red-50 text-red-700 border-red-200",
    low: "bg-amber-50 text-amber-700 border-amber-200",
    medium: "bg-cyan-50 text-cyan-700 border-cyan-200",
    high: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const govMt =
    governanceRecord.measurementType && governanceRecord.measurementType in MEASUREMENT_TYPE_LABELS
      ? MEASUREMENT_TYPE_LABELS[governanceRecord.measurementType as keyof typeof MEASUREMENT_TYPE_LABELS]
      : "";

  useEffect(() => {
    if (!scores.length) return;
    if (!selectedControlId || !scores.some((s) => s.control.id === selectedControlId)) {
      setSelectedControlId(scores[0].control.id);
    }
  }, [scores, selectedControlId]);

  const selectedScore = scores.find((s) => s.control.id === selectedControlId) ?? scores[0];
  const selectedAnswers = selectedScore ? (answers[selectedScore.control.id] || {}) : {};
  const selectedChartStats = selectedScore
    ? selectedScore.control.questions.reduce(
      (acc, _q, qi) => {
        const val = selectedAnswers[qi];
        if (val === 2) acc.done += 1;
        else if (val === 1) acc.partial += 1;
        else if (val === 0) acc.notDone += 1;
        else acc.empty += 1;
        return acc;
      },
      { done: 0, partial: 0, notDone: 0, empty: 0 },
    )
    : { done: 0, partial: 0, notDone: 0, empty: 0 };
  const selectedTotalQuestions = selectedScore?.control.questions.length ?? 0;
  const selectedAnswered = selectedChartStats.done + selectedChartStats.partial + selectedChartStats.notDone;
  const selectedCoverage = selectedTotalQuestions > 0
    ? Math.round((selectedAnswered / selectedTotalQuestions) * 100)
    : 0;
  const selectedSegments = [
    {
      key: "done",
      label: "Si",
      count: selectedChartStats.done,
      cls: "bg-emerald-500",
      text: "text-emerald-700",
      soft: "bg-emerald-50 border-emerald-200",
    },
    {
      key: "partial",
      label: "Parcial",
      count: selectedChartStats.partial,
      cls: "bg-amber-500",
      text: "text-amber-700",
      soft: "bg-amber-50 border-amber-200",
    },
    {
      key: "notDone",
      label: "No",
      count: selectedChartStats.notDone,
      cls: "bg-red-500",
      text: "text-red-700",
      soft: "bg-red-50 border-red-200",
    },
    {
      key: "empty",
      label: "Sin respuesta",
      count: selectedChartStats.empty,
      cls: "bg-zinc-400",
      text: "text-zinc-700",
      soft: "bg-zinc-100 border-zinc-200",
    },
  ] as const;
  const selectedAverageScale = selectedTotalQuestions > 0
    ? ((selectedChartStats.done * 2) + (selectedChartStats.partial * 1)) / selectedTotalQuestions
    : 0;
  const selectedAveragePercent = Math.round((selectedAverageScale / 2) * 100);
  const selectedDominant = selectedSegments.reduce((max, cur) => (cur.count > max.count ? cur : max), selectedSegments[0]);
  const selectedAlertCount = selectedChartStats.notDone + selectedChartStats.empty;
  const selectedAlertPercent = selectedTotalQuestions > 0
    ? Math.round((selectedAlertCount / selectedTotalQuestions) * 100)
    : 0;
  let selectedReading = "Sin datos suficientes para interpretar este control.";
  if (selectedAveragePercent >= 80) {
    selectedReading = "Desempeno alto del control, con base solida de implementacion.";
  } else if (selectedAveragePercent >= 60) {
    selectedReading = "Desempeno medio, hay avance pero aun existen brechas.";
  } else if (selectedAveragePercent >= 40) {
    selectedReading = "Desempeno bajo, se recomienda priorizar plan de mejora.";
  } else {
    selectedReading = "Desempeno critico, requiere acciones inmediatas en este control.";
  }

  return (
    <div>
      <h2 className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-black text-center text-zinc-900 tracking-tight mb-8 font-serif">
        <i className="fa-solid fa-chart-pie text-red-600 text-2xl md:text-3xl" aria-hidden />
        Resultados de la evaluacion
      </h2>

      {governanceRecordHasAnyContent(governanceRecord) && (
        <div className="mb-6 rounded-xl border border-amber-200/80 bg-amber-50/40 px-4 py-3 shadow-sm ring-1 ring-amber-100/60">
          <p className="mb-2 inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-wider text-amber-900">
            <i className="fa-solid fa-landmark text-amber-800" aria-hidden />
            Registro de gobierno
          </p>
          <dl className="grid gap-1 text-[13px] text-zinc-800 sm:grid-cols-2">
            {governanceRecord.institutionName.trim() && (
              <>
                <dt className="font-semibold text-zinc-600">Institucion</dt>
                <dd>{governanceRecord.institutionName}</dd>
              </>
            )}
            {governanceRecord.scopeText.trim() && (
              <>
                <dt className="font-semibold text-zinc-600 sm:col-span-1">Alcance</dt>
                <dd className="whitespace-pre-wrap sm:col-span-1">{governanceRecord.scopeText}</dd>
              </>
            )}
            {(governanceRecord.responsibleName.trim() ||
              governanceRecord.responsibleRole.trim() ||
              governanceRecord.responsibleArea.trim()) && (
              <>
                <dt className="font-semibold text-zinc-600">Responsable</dt>
                <dd>
                  {[governanceRecord.responsibleName, governanceRecord.responsibleRole, governanceRecord.responsibleArea]
                    .filter(Boolean)
                    .join(" · ")}
                </dd>
              </>
            )}
            {govMt && (
              <>
                <dt className="font-semibold text-zinc-600">Tipo de medicion</dt>
                <dd>{govMt}</dd>
              </>
            )}
            {governanceRecord.policyReference.trim() && (
              <>
                <dt className="font-semibold text-zinc-600">Politica / plan</dt>
                <dd className="break-all">{governanceRecord.policyReference}</dd>
              </>
            )}
            {governanceRecord.notes.trim() && (
              <>
                <dt className="font-semibold text-zinc-600 sm:col-span-1">Notas</dt>
                <dd className="whitespace-pre-wrap sm:col-span-1">{governanceRecord.notes}</dd>
              </>
            )}
          </dl>
          <p className="mt-2 text-[12px] text-zinc-500">
            Edite en el inicio, seccion <strong className="text-zinc-600">Registro de gobierno</strong>. Se incluye en informe HTML, impresion y PDF.
          </p>
        </div>
      )}

      {/* Score Overview */}
      <div className="mb-6 grid items-center gap-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm ring-1 ring-red-50 md:grid-cols-[auto_1fr] md:p-8">
        <div className="relative w-36 h-36 mx-auto md:mx-0">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e7e5e4" strokeWidth="8" />
            <circle cx="60" cy="60" r="54" fill="none" stroke={overallLevel.color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={dashOffset} className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-zinc-900">{overall}%</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Madurez</span>
          </div>
        </div>
        <div className="text-center md:text-left">
          <h3 className="mb-1 text-lg font-extrabold text-zinc-900">
            Nivel: <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${levelColors[overallLevel.cls]}`}>{overallLevel.label}</span>
          </h3>
          <p className="mb-3 text-sm leading-relaxed text-zinc-600">{overallLevel.desc}</p>
          <p className="text-[13px] leading-relaxed text-zinc-600 border-t-2 border-red-100 pt-2">
            El Core NIST CSF 2.0 incluye <strong className="text-zinc-800">contexto organizacional</strong> (mision, leyes, partes interesadas) en categorias como{" "}
            <span className="font-mono text-red-800">GV.OC</span>; este cuestionario es el mismo para cualquier tipo de organizacion. La madurez mostrada arriba es el <strong className="text-zinc-800">promedio global</strong> y, al desplegar cada control, el porcentaje por bloque C0-C9.
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-[13px] text-slate-700 leading-relaxed">
        Esta herramienta es una herramienta de evaluación de madurez en ciberseguridad basada en el NIST Cybersecurity Framework (CSF) 2.0.
Su propósito es estimar el nivel de madurez organizacional frente a los resultados esperados (Outcomes) del Core del NIST CSF 2.0, identificando brechas, prioridades y oportunidades de mejora.
No sustituye la documentación oficial del NIST ni una auditoría formal, ni constituye asesoramiento legal o regulatorio. El NIST CSF se utiliza como marco de referencia internacionalmente reconocido y validado por expertos, tras el análisis comparativo de diversos marcos y normas (ISO, buenas prácticas y modelos de riesgo).
La herramienta está diseñada para auto‑diagnóstico, gestión del riesgo y mejora continua, y puede apoyar procesos de gobernanza, ERM (Gestion de riesgos empresariales) y toma de decisiones estratégicas. 
        </p>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {scores.map((s) => (
          <button
            type="button"
            key={s.control.id}
            onClick={() => setSelectedControlId(s.control.id)}
            className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg border transition-shadow hover:shadow-sm ${
              levelColors[s.level.cls]
            } ${selectedControlId === s.control.id ? "ring-2 ring-red-300" : ""}`}
            title="Ver grafico del control"
          >
            <i className={s.control.icon} aria-hidden />
            {s.control.baseControlCode}: {s.score}%
          </button>
        ))}
      </div>

      {selectedScore && (
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm ring-1 ring-red-50 print:hidden">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[12px] font-extrabold uppercase tracking-wider text-red-700">
              Grafico del control seleccionado
            </p>
            <p className="text-[12px] font-semibold text-zinc-600">
              {selectedScore.control.baseControlCode}: {selectedScore.control.name}
            </p>
          </div>
          <div className="mb-3 h-5 w-full overflow-hidden rounded-full border border-zinc-200 bg-zinc-100">
            {selectedSegments.map((seg) => {
              const width = selectedTotalQuestions > 0 ? (seg.count / selectedTotalQuestions) * 100 : 0;
              return (
                <span
                  key={seg.key}
                  className={`inline-block h-full ${seg.cls} transition-all duration-500`}
                  style={{ width: `${width}%` }}
                  title={`${seg.label}: ${seg.count} de ${selectedTotalQuestions}`}
                />
              );
            })}
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            {selectedSegments.map((seg) => (
              <div key={seg.key} className={`rounded-lg border px-3 py-2 ${seg.soft}`}>
                <p className={`text-[11px] font-bold uppercase tracking-wide ${seg.text}`}>{seg.label}</p>
                <p className="text-lg font-black text-zinc-900">{seg.count}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
            <div className="mb-1 flex items-center justify-between text-[12px] font-semibold text-zinc-700">
              <span>Cobertura respondida</span>
              <span>{selectedCoverage}% ({selectedAnswered}/{selectedTotalQuestions})</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${selectedCoverage}%` }}
              />
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-red-100 bg-red-50/40 px-3 py-3">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-red-700">
              Analisis descriptivo del control
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-4">
              <div className="rounded-md border border-zinc-200 bg-white px-2.5 py-2">
                <p className="text-[11px] font-semibold text-zinc-500">Promedio (0 a 2)</p>
                <p className="text-[15px] font-black text-zinc-900">{selectedAverageScale.toFixed(2)}</p>
              </div>
              <div className="rounded-md border border-zinc-200 bg-white px-2.5 py-2">
                <p className="text-[11px] font-semibold text-zinc-500">Promedio (%)</p>
                <p className="text-[15px] font-black text-zinc-900">{selectedAveragePercent}%</p>
              </div>
              <div className="rounded-md border border-zinc-200 bg-white px-2.5 py-2">
                <p className="text-[11px] font-semibold text-zinc-500">Estado dominante</p>
                <p className="text-[15px] font-black text-zinc-900">{selectedDominant.label}</p>
              </div>
              <div className="rounded-md border border-zinc-200 bg-white px-2.5 py-2">
                <p className="text-[11px] font-semibold text-zinc-500">Riesgo visible</p>
                <p className="text-[15px] font-black text-zinc-900">{selectedAlertPercent}%</p>
              </div>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-zinc-700">
              {selectedReading} Preguntas con riesgo visible (No + Sin respuesta):{" "}
              <strong className="text-zinc-900">{selectedAlertCount}</strong> de{" "}
              <strong className="text-zinc-900">{selectedTotalQuestions}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Detail Cards */}
      {scores.map((s) => {
        const isOpen = openCards.has(s.control.id);
        const chart = s.control.questions.reduce(
          (acc, _q, qi) => {
            const v = answers[s.control.id]?.[qi];
            if (v === 2) acc.done += 1;
            else if (v === 1) acc.partial += 1;
            else if (v === 0) acc.notDone += 1;
            else acc.empty += 1;
            return acc;
          },
          { done: 0, partial: 0, notDone: 0, empty: 0 },
        );
        const totalChart = s.control.questions.length || 1;
        const chartDonePct = chart.done > 0 ? Math.max((chart.done / totalChart) * 100, 4) : 0;
        const chartPartialPct = chart.partial > 0 ? Math.max((chart.partial / totalChart) * 100, 4) : 0;
        const chartNoPct = chart.notDone > 0 ? Math.max((chart.notDone / totalChart) * 100, 4) : 0;
        const chartEmptyPct = chart.empty > 0 ? Math.max((chart.empty / totalChart) * 100, 4) : 0;
        return (
          <div key={s.control.id} className="mb-2.5 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:border-red-100 hover:shadow-md">
            <button
              type="button"
              onClick={() => {
                setSelectedControlId(s.control.id);
                toggleCard(s.control.id);
              }}
              className="print-card-header flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-red-50/50"
            >
              <div className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm"
                style={{ background: s.level.color }}>{s.score}%</div>
              <span className="flex min-w-0 flex-1 items-center gap-2 text-sm font-bold text-zinc-900">
                <i className={`${s.control.icon} shrink-0 text-red-700`} aria-hidden />
                Control {s.control.baseControlCode}: {s.control.name}
              </span>
              <i className={`fa-solid fa-chevron-down print:hidden text-xs text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {isOpen && (
              <div className="border-t border-zinc-100 px-4 pb-4 pt-3">
                <p className="mb-2 text-[12px] font-extrabold uppercase tracking-wider text-amber-900">Control base (catalogo de 10)</p>
                <p className="mb-3 text-[12px] text-zinc-700">
                  <span className="font-mono font-bold text-red-700">{s.control.baseControlCode}</span>
                  {BASE_CONTROL_NAMES[s.control.baseControlCode] ? ` — ${BASE_CONTROL_NAMES[s.control.baseControlCode]}` : ""}
                </p>
                <p className="mb-3 text-[12px] leading-relaxed text-zinc-600">{s.control.baseControlNote}</p>
                <div className="mb-3 rounded-lg border border-zinc-200 bg-zinc-50/80 p-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-600">Grafico del control</p>
                  <div className="mt-1.5 rounded-lg border border-zinc-200 bg-white p-2">
                    <svg
                      viewBox="0 0 260 110"
                      className="h-28 w-full"
                      role="img"
                      aria-label="Grafico de barras por estado"
                    >
                      <line x1="16" y1="92" x2="244" y2="92" stroke="#d4d4d8" strokeWidth="1.5" />
                      <rect x="28" y={92 - (72 * chartDonePct) / 100} width="36" height={(72 * chartDonePct) / 100} fill="#10b981" rx="2" />
                      <rect x="84" y={92 - (72 * chartPartialPct) / 100} width="36" height={(72 * chartPartialPct) / 100} fill="#f59e0b" rx="2" />
                      <rect x="140" y={92 - (72 * chartNoPct) / 100} width="36" height={(72 * chartNoPct) / 100} fill="#ef4444" rx="2" />
                      <rect x="196" y={92 - (72 * chartEmptyPct) / 100} width="36" height={(72 * chartEmptyPct) / 100} fill="#a1a1aa" rx="2" />
                      <text x="46" y="106" textAnchor="middle" fontSize="10" fill="#52525b">Si</text>
                      <text x="102" y="106" textAnchor="middle" fontSize="10" fill="#52525b">Parcial</text>
                      <text x="158" y="106" textAnchor="middle" fontSize="10" fill="#52525b">No</text>
                      <text x="214" y="106" textAnchor="middle" fontSize="10" fill="#52525b">Sin resp.</text>
                    </svg>
                  </div>
                  <p className="mt-1.5 text-[11px] text-zinc-600">
                    Si: <strong className="text-zinc-800">{chart.done}</strong> · Parcial: <strong className="text-zinc-800">{chart.partial}</strong> · No: <strong className="text-zinc-800">{chart.notDone}</strong> · Sin respuesta: <strong className="text-zinc-800">{chart.empty}</strong>
                  </p>
                </div>

                <p className="mb-2 text-[13px] font-extrabold uppercase tracking-wider text-red-700">
                  Subcategorias: respuesta registrada
                </p>
                <div className="results-detail-scroll mb-4 max-h-[min(28rem,70vh)] space-y-2 overflow-y-auto pr-0.5 print:max-h-none print:overflow-visible">
                  {s.control.questions.map((q, qi) => {
                    const v = answers[s.control.id]?.[qi];
                    const st = v === undefined ? "—" : v === 2 ? "Si" : v === 1 ? "Parcial" : "No";
                    return (
                      <div
                        key={q.subcategoryId}
                        id={`result-sub-${s.control.id}-${q.subcategoryId}`}
                        className="print-question-block rounded-lg border border-zinc-200 bg-zinc-50/90 px-2.5 py-2 text-[13px] scroll-mt-24"
                      >
                        <div className="flex justify-between gap-2">
                          <span className="min-w-0 text-red-800">
                            <span className="font-mono font-bold">{q.subcategoryId}</span>
                            <span className="text-zinc-500 block text-[11px]">{q.categoryEs}</span>
                          </span>
                          <span className="shrink-0 text-zinc-700 font-semibold">Respuesta: {st}</span>
                        </div>
                        <p className="mt-1.5 text-[13px] leading-snug text-zinc-800">
                          <span className="font-semibold text-zinc-600">Pregunta: </span>
                          {questionPlainBody(q.text, q.subcategoryId)}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p className="rounded-md border border-emerald-200 bg-emerald-50/70 px-2.5 py-2 text-[12px] leading-snug text-emerald-900">
                  Para corregir brechas, use el archivo Excel exportado en <strong>Exportar Excel (Checklist)</strong>. Ahi encontrara recomendaciones en filas separadas y columna de checklist.
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Actions */}
      <div className="flex justify-center gap-3 mt-8 flex-wrap">
        <button type="button" onClick={() => onHistorial()} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-amber-400 bg-amber-50 px-6 py-2.5 text-sm font-bold text-amber-950 shadow-sm transition-all hover:bg-amber-100" title="Historial y comparacion de mediciones">
          <i className="fa-solid fa-chart-line" aria-hidden />
          Seguimiento y comparacion
        </button>
        <button type="button" onClick={() => { try { window.print(); } catch(e) { alert('Use Ctrl+P para imprimir/exportar a PDF'); } }} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-zinc-100 px-6 py-2.5 text-sm font-bold text-zinc-800 shadow-sm transition-all hover:bg-zinc-200">
          <i className="fa-solid fa-file-pdf" aria-hidden />
          Exportar PDF (Imprimir)
        </button>
        <button type="button" onClick={() => { try { onExport(); } catch(e) { alert('Error al exportar: ' + e); } }} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm ring-1 ring-red-300/50 transition-all hover:bg-red-700">
          <i className="fa-solid fa-file-code" aria-hidden />
          Descargar Informe (HTML)
        </button>
        <button type="button" onClick={() => { try { onExportExcel(); } catch(e) { alert('Error al exportar excel: ' + e); } }} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-6 py-2.5 text-sm font-bold text-emerald-900 shadow-sm transition-all hover:bg-emerald-100">
          <i className="fa-solid fa-file-excel" aria-hidden />
          Exportar Excel (Checklist)
        </button>
        <button type="button" onClick={() => { try { onExportQuestionnaireExcel(); } catch(e) { alert('Error al exportar cuestionario excel: ' + e); } }} className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-300 bg-blue-50 px-6 py-2.5 text-sm font-bold text-blue-900 shadow-sm transition-all hover:bg-blue-100">
          <i className="fa-solid fa-table-cells-large" aria-hidden />
          Exportar Excel (Cuestionario vacio)
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-xl border border-red-100 bg-gradient-to-br from-white to-red-50/70 p-5 text-center shadow-sm ring-1 ring-red-100/50">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-red-700">Plataforma academica y educativa</p>
        <p className="text-[12px] leading-relaxed text-zinc-700">
          <strong className="text-red-700">No afiliada ni respaldada por NIST.</strong> No reemplaza auditoria formal.
          Herramienta <strong className="text-red-700">uptlibre</strong>. Marco unico NIST CSF 2.0. Ningun dato salio de su navegador.
        </p>
        <p className="mt-2 text-[14px] font-bold text-red-700">
          <a href={PUBLIC_SITE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-red-600">
            <i className="fa-solid fa-globe text-base" aria-hidden />
            nistcsf.uptlibre.pe
          </a>
        </p>
        <p className="text-[12px] font-medium text-zinc-600">Libertad y Pensamiento</p>
        <p className="mt-2 text-[13px] text-zinc-600">
          <a
            href={UPTLIBRE_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-red-700 underline decoration-red-200 underline-offset-2 hover:text-red-800"
          >
            UPTLIBRE (www.uptlibre.pe)
          </a>
          {" "}
          — Grupo de Investigacion &quot;Libertad y Pensamiento&quot;, Facultad de Ingenieria — UPT
        </p>
      </div>
    </div>
  );
}

function SeguimientoScreen({
  answers,
  histTick,
  onMutate,
}: {
  answers: Answers;
  histTick: number;
  onMutate: () => void;
}) {
  const [list, setList] = useState<EvalSnapshot[]>([]);
  const [label, setLabel] = useState("");
  const [selA, setSelA] = useState("");
  const [selB, setSelB] = useState("");

  useEffect(() => {
    setList(loadSnapshots());
  }, [histTick]);

  const current = snapshotMetrics(answers);
  const newest = list[0];
  const matchesLatestSave =
    newest !== undefined && answersMapEqual(answers, newest.answers);
  const snapById = new Map(list.map((s) => [s.id, s]));
  const snapA = selA ? snapById.get(selA) : undefined;
  const snapB = selB ? snapById.get(selB) : undefined;
  const mA = snapA ? snapshotMetrics(snapA.answers) : null;
  const mB = snapB ? snapshotMetrics(snapB.answers) : null;

  const handleSave = () => {
    const id = saveSnapshot(label, answers);
    if (!id) {
      alert("No se pudo guardar. Revise el almacenamiento local del navegador.");
      return;
    }
    setLabel("");
    onMutate();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Eliminar esta medicion del historial?")) return;
    deleteSnapshot(id);
    if (selA === id) setSelA("");
    if (selB === id) setSelB("");
    onMutate();
  };

  return (
    <div>
      <h2 className="flex flex-wrap items-center justify-center gap-2 text-2xl md:text-3xl font-black text-center text-zinc-900 tracking-tight mb-2 font-serif">
        <i className="fa-solid fa-chart-line text-red-600 text-2xl md:text-3xl" aria-hidden />
        Seguimiento y mejora continua
      </h2>
      <p className="text-sm text-zinc-600 text-center mb-6 max-w-2xl mx-auto leading-relaxed">
        Los datos se guardan solo en este navegador (localStorage). Guarde mediciones y comparelas en el tiempo para ver evolucion (linea base, despues de capacitacion, fechas claras, etc.).
      </p>

      <div
        className={`mb-6 rounded-xl border bg-white p-5 shadow-sm ${
          list.length === 0
            ? "border-zinc-200"
            : matchesLatestSave
              ? "border-emerald-200 ring-1 ring-emerald-100/80"
              : "border-amber-200 ring-1 ring-amber-100/70"
        }`}
      >
        <p
          className={`mb-2 inline-flex flex-wrap items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider ${
            list.length === 0
              ? "text-zinc-600"
              : matchesLatestSave
                ? "text-emerald-800"
                : "text-amber-900"
          }`}
        >
          <i
            className={`fa-solid ${matchesLatestSave && list.length > 0 ? "fa-circle-check text-emerald-600" : list.length === 0 ? "fa-gauge-high text-zinc-400" : "fa-triangle-exclamation text-amber-600"}`}
            aria-hidden
          />
          {list.length === 0
            ? "Sesion actual — aun no hay mediciones en historial"
            : matchesLatestSave
              ? (
                  <>
                    Sesion actual — coincide con el ultimo guardado:{" "}
                    <span className="normal-case font-bold tracking-normal text-emerald-900">{newest.label}</span>
                  </>
                )
              : "Sesion actual — hay cambios sin guardar (o distintos al ultimo historial)"}
        </p>
        <p className="text-lg font-black text-zinc-900">Madurez global: {current.overall}%</p>
      </div>

      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
        <p className="mb-2 inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-wider text-amber-900">
          <i className="fa-solid fa-floppy-disk text-amber-800" aria-hidden />
          Guardar medicion
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <div className="flex-1">
            <label htmlFor="snap-label" className="text-[13px] font-semibold text-zinc-700 block mb-1">
              Etiqueta (opcional)
            </label>
            <input
              id="snap-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej. Linea base marzo 2026"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-red-700"
          >
            <i className="fa-solid fa-floppy-disk text-sm" aria-hidden />
            Guardar en historial
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-wider text-zinc-600">
          <i className="fa-solid fa-clock-rotate-left text-zinc-400" aria-hidden />
          Mediciones guardadas
        </p>
        {list.length === 0 ? (
          <p className="text-sm text-zinc-500">Aun no hay registros. Complete una evaluacion y pulse Guardar.</p>
        ) : (
          <ul className="space-y-2 max-h-56 overflow-y-auto">
            {list.map((s) => {
              const m = snapshotMetrics(s.answers);
              return (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-[13px]"
                >
                  <div>
                    <span className="font-semibold text-zinc-900">{s.label}</span>
                    <span className="text-zinc-500 block text-[12px]">
                      {new Date(s.createdAt).toLocaleString("es-CL")} · global {m.overall}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    className="inline-flex items-center gap-1 text-red-600 font-semibold hover:underline text-[12px]"
                  >
                    <i className="fa-solid fa-trash-can" aria-hidden />
                    Eliminar
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-wider text-zinc-600">
          <i className="fa-solid fa-code-compare text-zinc-400" aria-hidden />
          Comparar dos mediciones
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[13px] font-semibold text-zinc-700 block mb-1">Medicion A (referencia)</label>
            <select
              value={selA}
              onChange={(e) => setSelA(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-2 py-2 text-sm text-zinc-900"
            >
              <option value="">Elegir...</option>
              {list.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({new Date(s.createdAt).toLocaleDateString("es-CL")})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[13px] font-semibold text-zinc-700 block mb-1">Medicion B (comparar)</label>
            <select
              value={selB}
              onChange={(e) => setSelB(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 px-2 py-2 text-sm text-zinc-900"
            >
              <option value="">Elegir...</option>
              {list.map((s) => (
                <option key={`b-${s.id}`} value={s.id}>
                  {s.label} ({new Date(s.createdAt).toLocaleDateString("es-CL")})
                </option>
              ))}
            </select>
          </div>
        </div>
        {mA && mB && (
          <div className="overflow-x-auto rounded-lg border border-zinc-100">
            <table className="w-full text-left text-xs min-w-[320px]">
              <thead>
                <tr className="bg-zinc-100 text-zinc-700">
                  <th className="px-3 py-2 font-bold">Indicador</th>
                  <th className="px-3 py-2 font-bold">A</th>
                  <th className="px-3 py-2 font-bold">B</th>
                  <th className="px-3 py-2 font-bold">Delta (B - A)</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const row = { label: "Madurez global (promedio de los 10 bloques)", va: mA.overall, vb: mB.overall };
                  const d = row.vb - row.va;
                  return (
                    <tr className="border-t border-zinc-100">
                      <td className="px-3 py-2 font-medium text-zinc-800">{row.label}</td>
                      <td className="px-3 py-2 font-mono">{row.va}%</td>
                      <td className="px-3 py-2 font-mono">{row.vb}%</td>
                      <td className={`px-3 py-2 font-mono font-bold ${d > 0 ? "text-emerald-700" : d < 0 ? "text-red-600" : "text-zinc-500"}`}>
                        {d > 0 ? "+" : ""}
                        {d}%
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
        )}
        {(!mA || !mB) && <p className="text-[13px] text-zinc-500">Seleccione dos mediciones para ver diferencias.</p>}
      </div>
    </div>
  );
}
