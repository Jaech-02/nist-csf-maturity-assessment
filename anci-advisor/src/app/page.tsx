"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
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
import { NIST_CSF_INFORMATIVE_REFERENCES_URL, NIST_CSF_PORTAL_URL } from "@/lib/nist-links";
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

const BASE = ASSET_BASE_PATH;
const PUBLIC_SITE = PUBLIC_SITE_URL;
const REPO_URL = "https://github.com/Jaech-02/nist-csf-maturity-assessment";
import { APP_VERSION, APP_DATE } from "@/lib/version";

type Answers = Record<string, Record<number, number>>;

/** Orientacion del catalogo solo como recomendacion si hay brecha (No o Parcial). */
function showImplementationGuidance(answer: number | undefined): boolean {
  return answer === 0 || answer === 1;
}

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
              <ul className="mt-1 space-y-2 text-[11px] leading-relaxed text-zinc-600">
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
              <label htmlFor="gov-institution" className={label}>
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
              <label htmlFor="gov-scope" className={label}>
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
              <label htmlFor="gov-resp-name" className={label}>
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
              <label htmlFor="gov-resp-role" className={label}>
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
              <label htmlFor="gov-resp-area" className={label}>
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
              <label htmlFor="gov-measure-type" className={label}>
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
              <label htmlFor="gov-policy" className={label}>
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
              <label htmlFor="gov-notes" className={label}>
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
      html += `<h4 style="margin-top:.75rem;font-size:.82rem;color:#b91c1c">Subcategorias: respuesta y recomendaciones</h4>`;
      s.control.questions.forEach((q, qi) => {
        const v = ans[qi];
        const label = v === undefined ? "sin respuesta" : v === 2 ? "implementado" : v === 1 ? "parcial" : "no";
        const preguntaEs = escHtml(questionPlainBody(q.text, q.subcategoryId));
        html += `<div class="fw"><strong>${q.subcategoryId}</strong> (${escHtml(q.categoryEs)})<br><span style="font-size:.78rem;line-height:1.35;display:block;margin:.25rem 0;color:#444"><strong>Pregunta:</strong> ${preguntaEs}</span><span style="font-size:.78rem">Respuesta: <strong>${label}</strong></span>`;
        const ex = q.implementationExamplesEs;
        if (ex?.length && showImplementationGuidance(v)) {
          html += `<details style="margin-top:.35rem;border-radius:6px;border:1px solid #a7f3d0;background:#ecfdf5;overflow:hidden"><summary style="cursor:pointer;padding:.4rem .55rem;font-size:.74rem;font-weight:700;color:#14532d;list-style:none">Recomendacion del catalogo (${ex.length} lineas) </summary><ul style="margin:0;padding:.35rem .55rem .55rem 1.25rem;font-size:.74rem;color:#365314;line-height:1.35;border-top:1px solid #a7f3d0">`;
          ex.forEach((line) => {
            html += `<li>${escHtml(line)}</li>`;
          });
          html += `</ul></details>`;
        }
        html += `</div>`;
      });
      html += `<div class="fw" style="margin-top:.5rem"><strong>Funcion dominante:</strong> ${s.control.csf.function} — ${s.control.csf.category}</div></div>`;
    });

    html += `<div class="disclaimer"><strong>PLATAFORMA ACADEMICA Y EDUCATIVA - uptlibre</strong><br>
No afiliada ni respaldada por NIST ni por el gobierno de EE.UU. El CSF es marco voluntario; esta herramienta es una aproximacion educativa.
No reemplaza auditoria formal ni asesoria legal. <strong><a href="${PUBLIC_SITE}">${PUBLIC_SITE.replace("https://", "")}</a></strong> — Ningun dato salio de su navegador.
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

  // ─── RENDER ───
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 overflow-x-hidden">
      {/* HEADER: marca + producto + confianza */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-red-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 ring-1 ring-zinc-200 shadow-sm">
              <img src={`${BASE}/logo_uptlibre.png`} alt="uptlibre" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm md:text-lg font-black text-zinc-900 tracking-tight font-serif">uptlibre</h1>
              <p className="text-[10px] md:text-[11px] text-zinc-600 font-medium truncate">NIST CSF 2.0 | Madurez</p>
              <a
                href={UPTLIBRE_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 block max-w-[11rem] truncate text-[9px] font-semibold text-red-700 hover:text-red-800 hover:underline sm:max-w-none"
              >
                UPTLIBRE — Libertad y Pensamiento (UPT)
              </a>
            </div>
          </div>
          <div className="hidden sm:flex gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              <i className="fa-solid fa-user-secret text-[11px]" aria-hidden />
              Anonimo
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200">
              <i className="fa-solid fa-shield-halved text-[11px]" aria-hidden />
              Seguro
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200">
              <i className="fa-solid fa-ban text-[11px]" aria-hidden />
              Sin Rastreo
            </span>
          </div>
          {/* Mobile: compact single badge */}
          <div className="flex sm:hidden">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              <i className="fa-solid fa-user-shield text-[10px]" aria-hidden />
              100% Privado
            </span>
          </div>
        </div>
      </header>

      {/* NAV: progreso y acceso a Core (mismo contenido, contenedor alineado al shell) */}
      <nav
        className={`sticky top-[60px] z-40 border-b px-4 py-2 transition-all duration-300 ${screen === 0 ? "bg-zinc-50/95 border-zinc-200/80 backdrop-blur-sm" : "bg-white/95 border-red-100 shadow-sm backdrop-blur-sm"}`}
        aria-label="Navegacion de evaluacion"
      >
        <div className="max-w-6xl mx-auto">
          {screen === 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600">
                <i className="fa-solid fa-house text-[13px]" aria-hidden />
                Inicio
              </span>
              <span className="text-zinc-300">|</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600">
                <i className="fa-solid fa-layer-group text-[12px] text-zinc-400" aria-hidden />
                10 controles (C0-C9) · 106 subcategorias
              </span>
              <span className="text-zinc-300">|</span>
              <button type="button" onClick={() => goTo(SCREEN_HISTORIAL)} className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-600 font-semibold transition-colors">
                <i className="fa-solid fa-chart-line text-[12px]" aria-hidden />
                Seguimiento
              </button>
              <span className="text-zinc-300">|</span>
              <button type="button" onClick={() => goTo(SCREEN_CORE)} className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-600 font-semibold transition-colors">
                <i className="fa-solid fa-sitemap text-[12px]" aria-hidden />
                Core CSF
              </button>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="h-1.5 bg-red-100 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-red-400 via-red-500 to-amber-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              {/* Nav pills */}
              <div className="flex items-center gap-0.5 overflow-x-auto pb-0.5 scrollbar-none">
                <button type="button" onClick={() => goTo(0)} className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap font-semibold text-zinc-600 hover:text-red-700 hover:bg-red-50 transition-all">
                  <i className="fa-solid fa-house text-[12px]" aria-hidden />
                  Inicio
                </button>
                {CONTROLS.map((c, i) => {
                  const isActive = screen === i + 1;
                  const isDone = screen > i + 1;
                  return (
                    <button type="button" key={c.id} onClick={() => goTo(i + 1)} title={`${c.baseControlCode}: ${c.name}`}
                      className={`text-[9px] md:text-[10px] min-w-8 h-8 md:min-w-9 md:h-9 px-0.5 rounded-md flex items-center justify-center font-mono font-black transition-all ${isActive ? "bg-red-600 text-white shadow-md shadow-red-200 scale-110 ring-1 ring-red-300" : isDone ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "text-zinc-500 hover:text-red-700 hover:bg-red-50 border border-zinc-200 bg-white"}`}>
                      {c.baseControlCode}
                    </button>
                  );
                })}
                <div className="w-px h-6 bg-zinc-200 mx-1.5 shrink-0" />
                <button type="button" onClick={() => goTo(SCREEN_RESULTS)} className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap font-semibold transition-all ${screen === SCREEN_RESULTS ? "bg-red-600 text-white shadow-md shadow-red-100" : "text-zinc-600 hover:text-red-700 hover:bg-red-50 border border-zinc-200 bg-white"}`}>
                  <i className="fa-solid fa-chart-pie text-[12px]" aria-hidden />
                  Resultados
                </button>
                <button type="button" onClick={() => goTo(SCREEN_HISTORIAL)} className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap font-semibold transition-all ${screen === SCREEN_HISTORIAL ? "bg-amber-700 text-white shadow-md shadow-amber-100" : "text-zinc-600 hover:text-red-700 hover:bg-red-50 border border-zinc-200 bg-white"}`}>
                  <i className="fa-solid fa-chart-line text-[12px]" aria-hidden />
                  Seguimiento
                </button>
                <button type="button" onClick={() => goTo(SCREEN_CORE)} className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap font-semibold transition-all ${screen === SCREEN_CORE ? "bg-red-700 text-white shadow-md shadow-red-100" : "text-zinc-600 hover:text-red-700 hover:bg-red-50 border border-zinc-200 bg-white"}`}>
                  <i className="fa-solid fa-sitemap text-[12px]" aria-hidden />
                  Core CSF
                </button>
                <button
                  type="button"
                  onClick={restartEval}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-zinc-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-800"
                  title="Borra todas las respuestas del cuestionario en este navegador"
                >
                  <i className="fa-solid fa-rotate-right text-[11px]" aria-hidden />
                  Nueva evaluacion
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

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
                    <span className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">Ciberseguridad NIST CSF</span>
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
                      <span key={b.label} className="glass text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-zinc-700">
                        {b.label}
                      </span>
                    ))}
                  </div>

                  {/* Framework chips */}
                  <div className="animate-fade-in-up-d4 hidden md:flex flex-wrap justify-center gap-1.5 mb-10">
                    {CSF_FUNCTIONS.map((f) => (
                      <span key={f.code} className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md bg-white/90 text-zinc-700 border border-red-100 shadow-sm" title={f.nameEn}>
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
                  <p className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-[10px] text-zinc-500">
                    <i className="fa-solid fa-book-open text-[10px] text-zinc-400" aria-hidden />
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
                                <p className="mt-3 text-left text-[11px] font-semibold leading-snug text-zinc-800 sm:text-center">
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
                <table className="w-full text-left text-xs min-w-[720px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm">
                      <th className="px-3 py-3 font-bold text-[11px]">Ctrl</th>
                      <th className="px-3 py-3 font-bold text-[11px]">ID</th>
                      <th className="px-3 py-3 font-bold text-[11px]">Fn</th>
                      <th className="px-3 py-3 font-bold text-[11px]">Categoria</th>
                      <th className="px-3 py-3 font-bold text-[11px]">Resultado (oficial EN)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CSF_CATALOG_ITEMS.map((row, i) => (
                      <tr key={row.id} className={`border-t border-zinc-100 ${i % 2 === 0 ? "bg-white" : "bg-red-50/30"} hover:bg-red-50/80 transition-colors`}>
                        <td className="px-3 py-2 font-mono font-black text-red-600">C{row.phase - 1}</td>
                        <td className="px-3 py-2 font-mono font-semibold text-zinc-900">{row.id}</td>
                        <td className="px-3 py-2 font-mono font-semibold text-red-700">{row.function}</td>
                        <td className="px-3 py-2 text-zinc-800">{row.categoryKey} — {row.categoryEs}</td>
                        <td className="px-3 py-2 text-zinc-600 leading-relaxed">{row.outcomeEn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  <strong className="text-zinc-800">Resultado (oficial EN):</strong> Outcome del Anexo A (NIST.CSWP.29). Las preguntas en español del evaluador ayudan a autoevaluar la cercania a cada Outcome del Core.
                </p>
              </div>
            </div>
          )}
            </article>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t-2 border-red-200 bg-white text-zinc-800 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.06)]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Top row: 3 columns */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Col 1: Brand */}
            <div className="flex flex-col items-center md:items-start">
              <div className="mb-3 rounded-lg bg-white p-2 ring-1 ring-zinc-200 shadow-sm">
                <img src={`${BASE}/logo_uptlibre.png`} alt="uptlibre" className="h-10 w-auto" />
              </div>
              <a href={PUBLIC_SITE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-base font-black text-zinc-900 hover:text-red-600 tracking-tight transition-colors font-serif">
                <i className="fa-solid fa-globe text-red-600 text-lg" aria-hidden />
                nistcsf.uptlibre.pe
              </a>
              <p className="text-[11px] text-zinc-600 mt-2 font-semibold">Libertad y Pensamiento</p>
              <a
                href={UPTLIBRE_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-[11px] font-bold text-red-700 hover:text-red-800 transition-colors"
              >
                <i className="fa-solid fa-flask text-sm" aria-hidden />
                UPTLIBRE — www.uptlibre.pe
              </a>
              <p className="text-[10px] text-zinc-500 mt-1 max-w-xs text-center md:text-left leading-snug">
                Grupo de Investigacion &quot;Libertad y Pensamiento&quot;
                <br />
                Facultad de Ingenieria — UPT
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200">
                  v{APP_VERSION}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {APP_DATE}
                </span>
              </div>
            </div>

            {/* Col 2: Frameworks */}
            <div className="flex flex-col items-center">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
                <i className="fa-solid fa-book-bookmark text-zinc-400" aria-hidden />
                Marco de referencia
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-red-50 text-red-800 border border-red-200">
                  <i className="fa-solid fa-shield-halved text-[11px]" aria-hidden />
                  NIST CSF 2.0
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                {["Sin cookies", "Sin registro", "Sin analytics", "100% local"].map((t) => (
                  <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-600">{t}</span>
                ))}
              </div>
            </div>

            {/* Col 3: Links */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                <i className="fa-solid fa-scale-balanced text-zinc-400" aria-hidden />
                Legal y codigo
              </p>
              <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                <i className="fa-solid fa-file-contract text-sm" aria-hidden />
                MIT License
              </a>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600 hover:text-red-600 transition-colors">
                <i className="fa-brands fa-github text-sm" aria-hidden />
                GitHub — nist-csf-maturity-assessment
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-zinc-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px] text-zinc-500">
              © {new Date().getFullYear()} uptlibre — Asesor madurez NIST CSF 2.0
            </p>
            <p className="text-[10px] font-mono text-zinc-500">
              v{APP_VERSION} | {APP_DATE} | Sin afiliacion NIST
            </p>
          </div>
        </div>
      </footer>

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
            {(control.id === "p1" || control.id === "p2" || control.id === "p3" || control.id === "p5") && (
              <p className="mt-2 text-[10px] leading-snug text-zinc-600">
                Este bloque concentra <strong>gobernanza (GV)</strong> y/o <strong>evaluacion de riesgos (ID.RA)</strong>, pilares centrales del Core para dirigir y priorizar el riesgo.
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTechnical((v) => !v)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 py-2.5 text-xs font-semibold text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50/50 hover:text-red-800"
          aria-expanded={showTechnical}
        >
          {showTechnical ? "Ocultar detalle tecnico" : "Ver detalle tecnico (codigos NIST)"}
          <i className={`fa-solid text-[10px] ${showTechnical ? "fa-chevron-up" : "fa-chevron-down"}`} aria-hidden />
        </button>

        {showTechnical && (
          <div className="mt-3 space-y-3 rounded-lg border border-amber-200/80 bg-amber-50/40 p-3 text-left">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">Referencia marco de 10 y NIST</p>
            <p className="text-[11px] text-zinc-700">
              <span className="font-mono font-bold text-red-800">{control.baseControlCode}</span>
              {catalogLabel ? ` — ${catalogLabel}` : ""}
            </p>
            <p className="text-[11px] leading-relaxed text-zinc-600">{control.baseControlNote}</p>
            <p className="text-[10px] font-mono text-zinc-600 break-words leading-relaxed max-h-32 overflow-y-auto border border-amber-200/60 rounded bg-white/80 p-2">
              {control.subcategoryIds.join(", ")}
            </p>
            <p className="text-[10px] text-zinc-500">{control.description}</p>
          </div>
        )}
      </div>

      <div className="mb-5 rounded-lg border-l-4 border-l-red-400 bg-red-50/70 px-4 py-3 shadow-sm">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-red-800">
          <i className="fa-solid fa-circle-exclamation text-sm" aria-hidden />
          Por que importa este bloque
        </p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-800">{control.plainRiskLine}</p>
      </div>

      <div className="mb-3 rounded-md bg-zinc-100/80 px-3 py-2">
        <p className="text-xs font-medium text-zinc-700 leading-relaxed">
          <strong className="inline-flex items-center gap-1.5 text-zinc-900">
            <i className="fa-solid fa-circle-info text-red-600 text-sm" aria-hidden />
            Como leer cada pregunta:
          </strong> NIST no publica un cuestionario Si/No; publica un <strong>Outcome</strong> (resultado deseado de la organizacion). La frase en español abajo es una traduccion/parafrasis para que puedas evaluar si eso se cumple. La frase en ingles gris es la del documento oficial (Anexo A, NIST.CSWP.29). Las 106 subcategorias del Core NIST CSF 2.0 son el marco unico de este instrumento.
        </p>
        <p className="text-xs text-zinc-600 mt-2">
          Responde segun la situacion <strong>hoy</strong> (no el objetivo futuro). Puedes volver atras y cambiar respuestas.
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-3 mb-5">
        {control.questions.map((q, qIdx) => (
          <div key={qIdx} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm hover:border-red-100 hover:shadow-md transition-shadow">
            <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-b border-zinc-100 pb-2">
              <span className="font-mono text-[11px] font-bold text-red-800">{q.subcategoryId}</span>
              <span className="text-[11px] text-zinc-500">{q.categoryEs}</span>
            </div>
            <p className="text-sm font-semibold text-zinc-900 mb-2 leading-relaxed">{questionPlainBody(q.text, q.subcategoryId)}</p>
            <div className="rounded-md border border-slate-200 bg-slate-50/90 px-3 py-2 mb-3">
              <p className="mb-1 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                <i className="fa-solid fa-language text-[10px]" aria-hidden />
                Outcome oficial NIST (ingles)
              </p>
              <p className="text-[11px] leading-snug text-slate-700 italic">{q.outcomeEn}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {([
                { val: 2, label: "Si, implementado", cls: "emerald", fa: "fa-check" as const },
                { val: 1, label: "Parcialmente", cls: "amber", fa: "fa-minus" as const },
                { val: 0, label: "No implementado", cls: "red", fa: "fa-xmark" as const },
              ] as const).map((opt) => {
                const selected = answers[qIdx] === opt.val;
                const base = "inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-md border-2 transition-all";
                const styles = {
                  emerald: selected ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-zinc-200 text-zinc-500 hover:border-emerald-300 hover:text-emerald-700",
                  amber: selected ? "border-amber-500 bg-amber-50 text-amber-800" : "border-zinc-200 text-zinc-500 hover:border-amber-300 hover:text-amber-700",
                  red: selected ? "border-red-500 bg-red-50 text-red-800" : "border-zinc-200 text-zinc-500 hover:border-red-300 hover:text-red-700",
                };
                return (
                  <button type="button" key={opt.val} onClick={() => onAnswer(qIdx, opt.val)} className={`${base} ${styles[opt.cls]}`}>
                    <i className={`fa-solid ${opt.fa} text-[11px]`} aria-hidden />
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
  scores, answers, openCards, toggleCard, onExport,
  onHistorial,
  governanceRecord,
}: {
  scores: { control: Control; score: number; level: ReturnType<typeof getMaturityLevel> }[];
  answers: Answers;
  openCards: Set<string>;
  toggleCard: (id: string) => void;
  onExport: () => void;
  onHistorial: () => void;
  governanceRecord: GovernanceRecord;
}) {
  type OrientModalState = {
    subcategoryId: string;
    categoryEs: string;
    lines: string[];
  };
  const [orientModal, setOrientModal] = useState<OrientModalState | null>(null);
  const orientCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!orientModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOrientModal(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    orientCloseRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [orientModal]);

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

  const hasAnyLocalExamples = scores.some((s) => {
    const ans = answers[s.control.id] || {};
    return s.control.questions.some((q, qi) => {
      const v = ans[qi];
      return (q.implementationExamplesEs?.length ?? 0) > 0 && showImplementationGuidance(v);
    });
  });

  const govMt =
    governanceRecord.measurementType && governanceRecord.measurementType in MEASUREMENT_TYPE_LABELS
      ? MEASUREMENT_TYPE_LABELS[governanceRecord.measurementType as keyof typeof MEASUREMENT_TYPE_LABELS]
      : "";

  return (
    <div>
      <h2 className="flex items-center justify-center gap-2 text-2xl md:text-3xl font-black text-center text-zinc-900 tracking-tight mb-8 font-serif">
        <i className="fa-solid fa-chart-pie text-red-600 text-2xl md:text-3xl" aria-hidden />
        Resultados de la evaluacion
      </h2>

      {governanceRecordHasAnyContent(governanceRecord) && (
        <div className="mb-6 rounded-xl border border-amber-200/80 bg-amber-50/40 px-4 py-3 shadow-sm ring-1 ring-amber-100/60">
          <p className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
            <i className="fa-solid fa-landmark text-amber-800" aria-hidden />
            Registro de gobierno
          </p>
          <dl className="grid gap-1 text-[11px] text-zinc-800 sm:grid-cols-2">
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
          <p className="mt-2 text-[10px] text-zinc-500">
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
          <p className="text-[11px] leading-relaxed text-zinc-600 border-t-2 border-red-100 pt-2">
            El Core NIST CSF 2.0 incluye <strong className="text-zinc-800">contexto organizacional</strong> (mision, leyes, partes interesadas) en categorias como{" "}
            <span className="font-mono text-red-800">GV.OC</span>; este cuestionario es el mismo para cualquier tipo de organizacion. La madurez mostrada arriba es el <strong className="text-zinc-800">promedio global</strong> y, al desplegar cada control, el porcentaje por bloque C0-C9.
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center">
        <p className="text-[11px] text-slate-700 leading-relaxed">
          Las listas de <strong>Outcomes</strong> y el texto oficial del Core estan en{" "}
          <a href={NIST_CSF_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-red-700 underline hover:text-red-800">
            NIST Cybersecurity Framework
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" aria-hidden />
          </a>
          {" "}(documento CSF 2.0 y publicacion NIST.CSWP.29). Esta herramienta es educativa y no sustituye al PDF de NIST.
        </p>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {scores.map((s) => (
          <span key={s.control.id} className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${levelColors[s.level.cls]}`}>
            <i className={s.control.icon} aria-hidden />
            {s.control.baseControlCode}: {s.score}%
          </span>
        ))}
      </div>

      {/* Detail Cards */}
      {scores.map((s) => {
        const isOpen = openCards.has(s.control.id);
        return (
          <div key={s.control.id} className="mb-2.5 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-shadow hover:border-red-100 hover:shadow-md">
            <button
              type="button"
              onClick={() => toggleCard(s.control.id)}
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
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-amber-900">Control base (catalogo de 10)</p>
                <p className="mb-3 text-[10px] text-zinc-700">
                  <span className="font-mono font-bold text-red-700">{s.control.baseControlCode}</span>
                  {BASE_CONTROL_NAMES[s.control.baseControlCode] ? ` — ${BASE_CONTROL_NAMES[s.control.baseControlCode]}` : ""}
                </p>
                <p className="mb-3 text-[10px] leading-relaxed text-zinc-600">{s.control.baseControlNote}</p>

                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-red-700">
                  Subcategorias: respuesta y recomendaciones
                </p>
                <p className="mb-2 text-[10px] leading-snug text-zinc-500">
                  Recomendaciones del catalogo NIST solo si la respuesta es <strong className="text-zinc-700">No</strong> o <strong className="text-zinc-700">Parcial</strong>. Con <strong className="text-zinc-700">Si</strong> no se muestran. Sin respuesta, tampoco.
                </p>
                <div className="results-detail-scroll mb-4 max-h-[min(28rem,70vh)] space-y-2 overflow-y-auto pr-0.5 print:max-h-none print:overflow-visible">
                  {s.control.questions.map((q, qi) => {
                    const v = answers[s.control.id]?.[qi];
                    const st = v === undefined ? "—" : v === 2 ? "Si" : v === 1 ? "Parcial" : "No";
                    const ex = q.implementationExamplesEs;
                    const n = ex?.length ?? 0;
                    const showGuide = n > 0 && showImplementationGuidance(v);
                    return (
                      <div
                        key={q.subcategoryId}
                        id={`result-sub-${s.control.id}-${q.subcategoryId}`}
                        className="print-question-block rounded-lg border border-zinc-200 bg-zinc-50/90 px-2.5 py-2 text-[10px] scroll-mt-24"
                      >
                        <div className="flex justify-between gap-2">
                          <span className="min-w-0 text-red-800">
                            <span className="font-mono font-bold">{q.subcategoryId}</span>
                            <span className="text-zinc-500 block text-[9px]">{q.categoryEs}</span>
                          </span>
                          <span className="shrink-0 text-zinc-700 font-semibold">Respuesta: {st}</span>
                        </div>
                        <p className="mt-1.5 text-[10px] leading-snug text-zinc-800">
                          <span className="font-semibold text-zinc-600">Pregunta: </span>
                          {questionPlainBody(q.text, q.subcategoryId)}
                        </p>
                        {showGuide && (
                          <>
                            <div className="mt-2 border-t border-zinc-200/90 pt-2 print:hidden">
                              <button
                                type="button"
                                onClick={() =>
                                  setOrientModal({
                                    subcategoryId: q.subcategoryId,
                                    categoryEs: q.categoryEs,
                                    lines: ex!,
                                  })
                                }
                                className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-2 py-1 text-[10px] font-semibold text-red-700 shadow-sm transition-colors hover:border-red-300 hover:bg-red-50"
                              >
                                <i className="fa-solid fa-up-right-from-square text-[9px]" aria-hidden />
                                Ver recomendacion ({n} {n === 1 ? "linea" : "lineas"})
                              </button>
                            </div>
                            <div className="mt-2 hidden border-t border-emerald-200 bg-emerald-50/80 px-2 py-2 print:block">
                              <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-900">
                                Recomendacion del catalogo
                              </p>
                              <ol className="mt-1 list-decimal space-y-1 pl-4 text-[9px] leading-snug text-zinc-800">
                                {ex!.map((line, li) => (
                                  <li key={li}>{line}</li>
                                ))}
                              </ol>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {orientModal && (
        <div
          className="no-print fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-zinc-900/50 backdrop-blur-[2px]"
            aria-label="Cerrar recomendacion"
            onClick={() => setOrientModal(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="orient-dialog-title"
            className="relative flex max-h-[min(88dvh,40rem)] w-full max-w-lg flex-col rounded-t-2xl border border-zinc-200 bg-white shadow-2xl ring-1 ring-zinc-200/80 sm:max-h-[min(85vh,36rem)] sm:rounded-2xl"
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-100 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <h3 id="orient-dialog-title" className="font-mono text-sm font-bold text-red-800">
                  {orientModal.subcategoryId}
                </h3>
                <p className="mt-0.5 text-[10px] text-zinc-500">{orientModal.categoryEs}</p>
                <p className="mt-1 text-[10px] font-semibold text-amber-900">
                  Recomendacion(es)
                </p>
                <p className="mt-1 text-[10px] leading-snug text-zinc-600">
                  Referencia: material alineado con{" "}
                  <strong className="text-zinc-800">Download CSF 2.0 Informative Reference in the Core</strong>{" "}
                  (NIST CSF 2.0 Informative References).{" "}
                  <a
                    href={NIST_CSF_INFORMATIVE_REFERENCES_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-red-700 underline decoration-red-200 underline-offset-2 hover:text-red-800"
                  >
                    nist.gov/cyberframework/informative-references
                    <i className="fa-solid fa-arrow-up-right-from-square ml-0.5 text-[9px]" aria-hidden />
                  </a>
                  . Lo mostrado aqui sigue el catalogo de este documento.
                </p>
              </div>
              <button
                ref={orientCloseRef}
                type="button"
                onClick={() => setOrientModal(null)}
                className="shrink-0 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-[10px] font-bold text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                Cerrar
              </button>
            </div>
            <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 text-[11px] leading-relaxed text-zinc-800 sm:px-5">
              {orientModal.lines.map((line, i) => (
                <li key={i} className="flex gap-2.5 border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                  <span className="shrink-0 font-mono text-[10px] font-bold text-emerald-800">{i + 1}.</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-xl border border-red-100 bg-gradient-to-br from-white to-red-50/70 p-5 text-center shadow-sm ring-1 ring-red-100/50">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-red-700">Plataforma academica y educativa</p>
        <p className="text-xs leading-relaxed text-zinc-700">
          <strong className="text-red-700">No afiliada ni respaldada por NIST.</strong> No reemplaza auditoria formal.
          Herramienta <strong className="text-red-700">uptlibre</strong>. Marco unico NIST CSF 2.0. Ningun dato salio de su navegador.
        </p>
        <p className="mt-2 text-sm font-bold text-red-700">
          <a href={PUBLIC_SITE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-red-600">
            <i className="fa-solid fa-globe text-base" aria-hidden />
            nistcsf.uptlibre.pe
          </a>
        </p>
        <p className="text-xs font-medium text-zinc-600">Libertad y Pensamiento</p>
        <p className="mt-2 text-[11px] text-zinc-600">
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
        <p className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
          <i className="fa-solid fa-floppy-disk text-amber-800" aria-hidden />
          Guardar medicion
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <div className="flex-1">
            <label htmlFor="snap-label" className="text-[11px] font-semibold text-zinc-700 block mb-1">
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
        <p className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-zinc-600">
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
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-[11px]"
                >
                  <div>
                    <span className="font-semibold text-zinc-900">{s.label}</span>
                    <span className="text-zinc-500 block text-[10px]">
                      {new Date(s.createdAt).toLocaleString("es-CL")} · global {m.overall}%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    className="inline-flex items-center gap-1 text-red-600 font-semibold hover:underline text-[10px]"
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
        <p className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-zinc-600">
          <i className="fa-solid fa-code-compare text-zinc-400" aria-hidden />
          Comparar dos mediciones
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Medicion A (referencia)</label>
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
            <label className="text-[11px] font-semibold text-zinc-700 block mb-1">Medicion B (comparar)</label>
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
        {(!mA || !mB) && <p className="text-[11px] text-zinc-500">Seleccione dos mediciones para ver diferencias.</p>}
      </div>
    </div>
  );
}
