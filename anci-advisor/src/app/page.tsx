"use client";

import { useState, useCallback } from "react";
import { CONTROLS, CONTEXT_RECOMMENDATIONS, getMaturityLevel, GRADIENT_COLORS, type Control } from "@/lib/data";

type Answers = Record<string, Record<number, number>>;
type OrgContext = "ti" | "ot" | "critica";

const TOTAL = CONTROLS.length;

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [context, setContext] = useState<OrgContext>("ti");
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());

  const progress = Math.round((screen / (TOTAL + 1)) * 100);

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

  const goTo = (s: number) => {
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    const scores = calcScores();
    const overall = Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length);
    const ctx = CONTEXT_RECOMMENDATIONS[context];
    const date = new Date().toLocaleDateString("es-CL");
    const level = getMaturityLevel(overall);

    let html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Informe ANCI - TTPSEC</title>
<style>body{font-family:'Segoe UI',system-ui,sans-serif;max-width:900px;margin:0 auto;padding:2rem;color:#1e293b;background:#fff}
h1{color:#1e40af;border-bottom:3px solid #3b82f6;padding-bottom:.5rem}h2{color:#1e3a5f;margin-top:2rem;border-left:4px solid #3b82f6;padding-left:.75rem}
.score{font-size:3rem;font-weight:800;text-align:center;margin:1rem 0}.card{border:1px solid #e2e8f0;border-radius:8px;padding:1rem;margin:.75rem 0;page-break-inside:avoid}
.fw{background:#f1f5f9;border-radius:4px;padding:.5rem;margin:.25rem 0;font-size:.82rem}.fw strong{color:#1e40af}
.rec{padding:.3rem 0;font-size:.85rem}.rec::before{content:"\\25B6 ";color:#3b82f6}
.badge{display:inline-block;padding:.2rem .6rem;border-radius:12px;font-size:.75rem;font-weight:600}
.b-critical{background:#fee2e2;color:#dc2626}.b-low{background:#fef3c7;color:#d97706}.b-medium{background:#cffafe;color:#0891b2}.b-high{background:#d1fae5;color:#059669}
.disclaimer{margin-top:3rem;padding:1rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:.78rem;color:#64748b}
</style></head><body>`;
    html += `<h1>Informe de Evaluación de Ciberseguridad</h1>`;
    html += `<p><strong>Fecha:</strong> ${date} | <strong>Contexto:</strong> ${ctx.label}</p>`;
    html += `<p><strong>Metodología:</strong> 9 Básicos de la Ciberseguridad (ANCI) + Control 0</p>`;
    html += `<p><strong>Marcos:</strong> ISO 27001:2022 | NIST CSF 2.0 | NIST 800-53 Rev.5 | CIS v8.1 | ISA/IEC 62443 | NERC CIP</p>`;
    html += `<div class="score">${overall}% <span class="badge b-${level.cls}">${level.label}</span></div>`;
    html += `<p style="text-align:center">${level.desc}</p>`;
    html += `<p style="text-align:center;font-size:.85rem">${ctx.general}</p>`;
    html += `<h2>Resultados por Control</h2>`;

    scores.forEach((s) => {
      const rl = s.score <= 50 ? "low" : s.score <= 75 ? "medium" : "high";
      const recs = s.control.recommendations[rl] || [];
      html += `<div class="card"><h3>C${s.control.number}: ${s.control.name} <span class="badge b-${s.level.cls}">${s.score}%</span></h3>`;
      html += `<p style="font-size:.82rem;color:#64748b">${s.control.description}</p>`;
      html += `<h4 style="margin-top:.75rem;font-size:.82rem;color:#1e40af">Recomendaciones</h4>`;
      recs.forEach((r) => { html += `<div class="rec">${r}</div>`; });
      html += `<h4 style="margin-top:.75rem;font-size:.82rem;color:#1e40af">Mapeo a Marcos</h4>`;
      Object.entries(s.control.frameworks).forEach(([fw, ref]) => {
        html += `<div class="fw"><strong>${fw}:</strong> ${ref}</div>`;
      });
      html += `<h4 style="margin-top:.75rem;font-size:.82rem;color:#dc2626">MITRE ATT&CK</h4>`;
      html += `<p style="font-size:.78rem">${s.control.mitre.join(" | ")}</p></div>`;
    });

    html += `<div class="disclaimer"><strong>DISCLAIMER - TTPSEC</strong><br>
Este informe fue generado por el Asesor de Ciberseguridad de TTPSEC, basado en los 9 Básicos de la Ciberseguridad definidos por la Agencia Nacional de Ciberseguridad (ANCI) de Chile.
La evaluación es orientativa y no constituye una auditoría formal. Se recomienda complementar con evaluaciones profesionales de ciberseguridad.
Ningún dato fue almacenado, transmitido ni procesado fuera de su navegador.
Marcos de referencia: ISO/IEC 27001:2022, NIST CSF 2.0, NIST 800-53 Rev.5, CIS Controls v8.1, ISA/IEC 62443, NERC CIP.
Ley aplicable: Ley 21.663 sobre Ciberseguridad e Infraestructura Crítica de Chile.
<br><br><strong>www.ttpsec.ai</strong> — Software para el bien común</div></body></html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Informe_ANCI_TTPSEC_${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─── RENDER ───
  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black text-blue-900 tracking-tight">TTPSEC</h1>
              <p className="text-[11px] text-slate-500 font-medium">Asesor ANCI | 9 Básicos de Ciberseguridad</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Anónimo</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Seguro</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">Sin Rastreo</span>
          </div>
        </div>
      </header>

      {/* PROGRESS NAV */}
      <nav className="sticky top-[60px] z-40 bg-white border-b border-slate-200 px-4 py-2.5">
        <div className="max-w-6xl mx-auto">
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2.5">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1">
            <button onClick={() => goTo(0)} className={`text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap font-semibold transition-all ${screen === 0 ? "bg-blue-600 text-white" : screen > 0 ? "bg-emerald-50 text-emerald-700" : "text-slate-400"}`}>
              Inicio
            </button>
            {CONTROLS.map((c, i) => (
              <button key={c.id} onClick={() => goTo(i + 1)} className={`text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap font-semibold transition-all ${screen === i + 1 ? "bg-blue-600 text-white" : screen > i + 1 ? "bg-emerald-50 text-emerald-700" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}>
                {c.icon} C{c.number}
              </button>
            ))}
            <button onClick={() => { goTo(TOTAL + 1); }} className={`text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap font-semibold transition-all ${screen === TOTAL + 1 ? "bg-blue-600 text-white" : "text-slate-400"}`}>
              Resultados
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {/* WELCOME */}
          {screen === 0 && (
            <div className="animate-in text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-200">
                <svg viewBox="0 0 24 24" className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">Evaluación de Ciberseguridad</h2>
              <p className="text-base text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
                Evalúa el nivel de madurez de tu organización en los <strong className="text-slate-700">9 Básicos de la Ciberseguridad</strong> definidos por la ANCI, mas el <strong className="text-slate-700">Control 0: Gestión de Activos</strong>.
              </p>

              {/* Features */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: "\uD83D\uDD12", title: "100% Anónimo", desc: "Sin registro, sin cookies, sin tracking. Tu evaluación es completamente privada." },
                  { icon: "\uD83C\uDF10", title: "Marcos Internacionales", desc: "ISO 27001, NIST CSF 2.0, NIST 800-53, CIS v8.1, ISA 62443, NERC CIP." },
                  { icon: "\u26A1", title: "Resultados Inmediatos", desc: "Procesamiento 100% en tu navegador. Ningún dato sale de tu dispositivo." },
                ].map((f) => (
                  <div key={f.title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all">
                    <div className="text-3xl mb-3">{f.icon}</div>
                    <h3 className="font-bold text-slate-900 mb-1.5 text-sm">{f.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

              {/* Context */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Selecciona tu contexto organizacional:</h3>
                <div className="flex gap-3 justify-center flex-wrap">
                  {([
                    { value: "ti" as OrgContext, icon: "\uD83D\uDCBB", label: "TI Corporativo", desc: "Oficinas, servidores, nube" },
                    { value: "ot" as OrgContext, icon: "\u2699\uFE0F", label: "OT / ICS", desc: "SCADA, DCS, PLCs" },
                    { value: "critica" as OrgContext, icon: "\u26A1", label: "Infraestructura Crítica", desc: "Energía, agua, transporte" },
                  ]).map((opt) => (
                    <button key={opt.value} onClick={() => setContext(opt.value)}
                      className={`flex flex-col items-center gap-1 px-6 py-4 rounded-xl border-2 transition-all min-w-[150px] ${context === opt.value ? "border-blue-600 bg-blue-50 shadow-md shadow-blue-100" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                      <span className="text-2xl">{opt.icon}</span>
                      <span className="text-sm font-bold text-slate-800">{opt.label}</span>
                      <span className="text-[11px] text-slate-500">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => goTo(1)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl text-base shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all">
                Comenzar Evaluación
              </button>

              <p className="text-[11px] text-slate-400 mt-6">Basado en: Ley 21.663 | Instrucciones Generales ANCI 1-4 de 2025 | MITRE ATT&CK</p>

              {/* TTPSEC Disclaimer */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
                <p className="text-sm font-black text-blue-900 tracking-wide mb-1">TTPSEC</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Herramienta desarrollada por TTPSEC, basada en los 9 Básicos de la Ciberseguridad definidos por la Agencia Nacional de Ciberseguridad (ANCI) de Chile. Esta evaluación es orientativa y no constituye una auditoría formal. Ningún dato es almacenado ni transmitido.
                </p>
              </div>
            </div>
          )}

          {/* QUESTIONNAIRE SCREENS */}
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
                onResults={() => goTo(TOTAL + 1)}
                current={idx + 1}
                total={TOTAL}
              />
            </div>
          ))}

          {/* RESULTS */}
          {screen === TOTAL + 1 && (
            <div className="animate-in">
              <Results
                scores={calcScores()}
                context={context}
                openCards={openCards}
                toggleCard={toggleCard}
                onExport={exportReport}
                onRestart={() => { setAnswers({}); setOpenCards(new Set()); goTo(0); }}
              />
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center">
        <p className="text-xs text-slate-500 mb-1">
          <strong className="text-blue-900">TTPSEC</strong> | Asesor basado en los <strong>9 Básicos de la Ciberseguridad</strong> - ANCI Chile
        </p>
        <p className="text-[10px] text-slate-400 font-medium">Sin cookies | Sin registro | Sin analytics | Procesamiento 100% local | UTF-8</p>
        <p className="text-[10px] text-slate-400 font-mono mt-1">ISO/IEC 27001:2022 | NIST CSF 2.0 | NIST 800-53 Rev.5 | CIS v8.1 | ISA/IEC 62443 | NERC CIP</p>
        <p className="text-sm font-bold text-blue-800 mt-3">
          <a href="https://www.ttpsec.ai" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">www.ttpsec.ai</a>
        </p>
        <p className="text-xs text-slate-500 italic">Software para el bien común</p>
      </footer>
    </>
  );
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
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-13 h-13 shrink-0 rounded-xl bg-gradient-to-br ${GRADIENT_COLORS[idx]} flex items-center justify-center text-white font-black text-lg shadow-md`}>
          C{control.number}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{control.icon} {control.name}</h2>
          <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{control.description}</p>
        </div>
      </div>

      {/* Risk Box */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
        <p className="text-[11px] font-extrabold text-red-600 uppercase tracking-wider mb-1">Riesgo si no se implementa</p>
        <p className="text-sm text-slate-600 leading-relaxed">{control.riskIfMissing}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {control.mitre.map((m) => (
            <span key={m} className="text-[10px] font-mono px-2 py-0.5 bg-red-100 text-red-700 rounded border border-red-200">{m}</span>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-2"><strong>Impacto:</strong> {control.impact.join(" | ")}</p>
      </div>

      {/* Questions */}
      <div className="space-y-3 mb-5">
        {control.questions.map((q, qIdx) => (
          <div key={qIdx} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
            <p className="text-sm text-slate-800 font-medium mb-3 leading-relaxed">{q.text}</p>
            <div className="flex gap-2 flex-wrap">
              {([
                { val: 2, label: "Si, implementado", cls: "emerald" },
                { val: 1, label: "Parcialmente", cls: "amber" },
                { val: 0, label: "No implementado", cls: "red" },
              ] as const).map((opt) => {
                const selected = answers[qIdx] === opt.val;
                const base = "text-xs font-semibold px-3.5 py-1.5 rounded-lg border-2 transition-all";
                const styles = {
                  emerald: selected ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600",
                  amber: selected ? "border-amber-500 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600",
                  red: selected ? "border-red-500 bg-red-50 text-red-700" : "border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-600",
                };
                return (
                  <button key={opt.val} onClick={() => onAnswer(qIdx, opt.val)} className={`${base} ${styles[opt.cls]}`}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-5 border-t border-slate-200">
        <button onClick={onPrev} className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all">
          Anterior
        </button>
        <span className="text-xs text-slate-400 font-medium">Control {current} de {total}</span>
        {isLast ? (
          <button onClick={onResults} className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-sm transition-all">
            Ver Resultados
          </button>
        ) : (
          <button onClick={onNext} className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow-sm transition-all">
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}

// ─── RESULTS COMPONENT ───
function Results({
  scores, context, openCards, toggleCard, onExport, onRestart,
}: {
  scores: { control: Control; score: number; level: ReturnType<typeof getMaturityLevel> }[];
  context: OrgContext; openCards: Set<string>;
  toggleCard: (id: string) => void;
  onExport: () => void; onRestart: () => void;
}) {
  const overall = Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length);
  const overallLevel = getMaturityLevel(overall);
  const ctx = CONTEXT_RECOMMENDATIONS[context];
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (overall / 100) * circumference;

  const levelColors: Record<string, string> = {
    critical: "bg-red-50 text-red-700 border-red-200",
    low: "bg-amber-50 text-amber-700 border-amber-200",
    medium: "bg-cyan-50 text-cyan-700 border-cyan-200",
    high: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-black text-center text-slate-900 tracking-tight mb-8">Resultados de la Evaluación</h2>

      {/* Score Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-md mb-6 grid md:grid-cols-[auto_1fr] gap-6 items-center">
        <div className="relative w-36 h-36 mx-auto md:mx-0">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle cx="60" cy="60" r="54" fill="none" stroke={overallLevel.color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={dashOffset} className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900">{overall}%</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Madurez</span>
          </div>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-lg font-extrabold text-slate-900 mb-1">
            Nivel: <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${levelColors[overallLevel.cls]}`}>{overallLevel.label}</span>
          </h3>
          <p className="text-sm text-slate-500 mb-3 leading-relaxed">{overallLevel.desc}</p>
          <p className="text-sm text-slate-700 font-semibold">{ctx.label}</p>
          <p className="text-xs text-slate-500 leading-relaxed">{ctx.general}</p>
          <p className="text-xs text-blue-600 font-semibold mt-2">{ctx.priority}</p>
        </div>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {scores.map((s) => (
          <span key={s.control.id} className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${levelColors[s.level.cls]}`}>
            {s.control.icon} C{s.control.number}: {s.score}%
          </span>
        ))}
      </div>

      {/* Detail Cards */}
      {scores.map((s) => {
        const isOpen = openCards.has(s.control.id);
        const rl = s.score <= 50 ? "low" : s.score <= 75 ? "medium" : "high";
        const recs = s.control.recommendations[rl] || [];
        return (
          <div key={s.control.id} className="bg-white border border-slate-200 rounded-xl mb-2.5 overflow-hidden shadow-sm hover:shadow transition-shadow">
            <button onClick={() => toggleCard(s.control.id)} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors text-left">
              <div className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-sm"
                style={{ background: s.level.color }}>{s.score}%</div>
              <span className="flex-1 text-sm font-bold text-slate-800">{s.control.icon} Control {s.control.number}: {s.control.name}</span>
              <span className={`text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}>&#9660;</span>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                {/* Recommendations */}
                <p className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider mb-2">Recomendaciones para su nivel</p>
                <div className="space-y-1.5 mb-4">
                  {recs.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                      <span className="text-blue-500 text-[9px] mt-0.5 shrink-0">&#9654;</span> {r}
                    </div>
                  ))}
                </div>
                {/* Frameworks */}
                <p className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider mb-2">Mapeo a Marcos Internacionales</p>
                <div className="grid sm:grid-cols-2 gap-2 mb-4">
                  {Object.entries(s.control.frameworks).map(([fw, ref]) => (
                    <div key={fw} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      <p className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wide">{fw}</p>
                      <p className="text-[11px] text-slate-500 font-mono leading-relaxed">{ref}</p>
                    </div>
                  ))}
                </div>
                {/* MITRE */}
                <p className="text-[11px] font-extrabold text-red-600 uppercase tracking-wider mb-1.5">MITRE ATT&CK Asociado</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.control.mitre.map((m) => (
                    <span key={m} className="text-[10px] font-mono px-2 py-0.5 bg-red-50 text-red-600 rounded border border-red-200">{m}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Actions */}
      <div className="flex justify-center gap-3 mt-8 flex-wrap">
        <button onClick={() => window.print()} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-all">
          Exportar PDF (Imprimir)
        </button>
        <button onClick={onExport} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-all">
          Descargar Informe (HTML)
        </button>
        <button onClick={onRestart} className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all">
          Nueva Evaluación
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 text-center">
        <p className="text-sm font-black text-blue-900 tracking-wide mb-1">TTPSEC</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          Herramienta desarrollada por TTPSEC, basada en los 9 Básicos de la Ciberseguridad definidos por la Agencia Nacional de Ciberseguridad (ANCI) de Chile.
          La evaluación es orientativa y no constituye una auditoría formal. Se recomienda complementar con evaluaciones profesionales de ciberseguridad.
          Ningún dato fue almacenado, transmitido ni procesado fuera de su navegador.
          Marcos de referencia: ISO/IEC 27001:2022, NIST CSF 2.0, NIST 800-53 Rev.5, CIS Controls v8.1, ISA/IEC 62443, NERC CIP.
          Ley aplicable: Ley 21.663 sobre Ciberseguridad e Infraestructura Crítica de Chile.
        </p>
        <p className="text-sm font-bold text-blue-800 mt-2">
          <a href="https://www.ttpsec.ai" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">www.ttpsec.ai</a>
        </p>
        <p className="text-xs text-slate-500 italic">Software para el bien común</p>
      </div>
    </div>
  );
}
