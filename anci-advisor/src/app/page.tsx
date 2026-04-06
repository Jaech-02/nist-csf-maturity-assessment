"use client";

import { useState, useCallback, useEffect } from "react";
import { CONTROLS, CONTEXT_RECOMMENDATIONS, getMaturityLevel, GRADIENT_COLORS, type Control } from "@/lib/data";
import { APP_VERSION, APP_DATE } from "@/lib/version";

type Answers = Record<string, Record<number, number>>;
type OrgContext = "ti" | "ot" | "critica";

const TOTAL = CONTROLS.length;

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [context, setContext] = useState<OrgContext>("ti");
  const [openCards, setOpenCards] = useState<Set<string>>(new Set());
  const [sharePageUrl, setSharePageUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSharePageUrl(`${window.location.origin}${window.location.pathname}`);
    }
  }, []);

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
    html += `<p><strong>Marco de referencia:</strong> NIST Cybersecurity Framework (CSF) 2.0</p>`;
    html += `<div style="font-size:.78rem;color:#475569;margin:.75rem 0 1rem;padding:.75rem;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px"><strong style="color:#1e40af">Leyenda del mapeo NIST CSF 2.0</strong><br>
<strong>Funcion NIST:</strong> una de las seis del nucleo (GV, ID, PR, DE, RS, RC).<br>
<strong>Categoria NIST:</strong> codigo bajo esa funcion (p. ej. ID.AM, PR.AA). Un control puede listar varias.<br>
<strong>Subcategoria (ejemplo):</strong> item oficial tipo PR.AA-05; es un ejemplo representativo, no el catalogo completo.<br>
<strong>Objetivo (ANCI):</strong> eje en lenguaje de los basicos ANCI, no es etiqueta NIST. Ver <code>docs/NIST_CSF_MAPPING.md</code> en el repositorio.</div>`;
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
      html += `<h4 style="margin-top:.75rem;font-size:.82rem;color:#1e40af">Alineacion NIST CSF 2.0</h4>`;
      const n = s.control.nistCsf;
      html += `<div class="fw"><strong>Objetivo ANCI:</strong> ${n.objective}</div>`;
      html += `<div class="fw"><strong>Funcion y categoria NIST:</strong> ${n.functionCategory}</div>`;
      html += `<div class="fw"><strong>Ejemplo de subcategoria:</strong> ${n.subcategoryExample}</div>`;
      html += `<div class="fw"><strong>Por que este NIST:</strong> ${n.mappingWhy}</div>`;
      html += `<h4 style="margin-top:.75rem;font-size:.82rem;color:#dc2626">MITRE ATT&CK</h4>`;
      html += `<p style="font-size:.78rem">${s.control.mitre.join(" | ")}</p></div>`;
    });

    html += `<div class="disclaimer"><strong>PLATAFORMA ACADÉMICA Y EDUCATIVA - TTPSEC</strong><br>
Este sitio <strong>no está afiliado, asociado ni respaldado</strong> por ningún ente gubernamental, la ANCI, ni el Gobierno de Chile.
No reemplaza una auditoría formal de ciberseguridad ni constituye asesoría legal.
Herramienta independiente desarrollada por <strong>TTPSEC</strong>, alineada con los 9 Básicos de la Ciberseguridad publicados por la ANCI.
Ningún dato fue almacenado, transmitido ni procesado fuera de su navegador.
Marco de referencia: NIST Cybersecurity Framework (CSF) 2.0.
Ley aplicable: Ley 21.663 sobre Ciberseguridad e Infraestructura Crítica de Chile.
<br><br><strong>www.ttpsec.ai</strong> — Software para el bien común | Licencia MIT</div></body></html>`;

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
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <img src="/logo-ttpsec.png" alt="TTPSEC" className="h-8 md:h-10 w-auto flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-sm md:text-lg font-black text-blue-900 tracking-tight">TTPSEC</h1>
              <p className="text-[10px] md:text-[11px] text-slate-500 font-medium truncate">Asesor ANCI | 9 Básicos</p>
            </div>
          </div>
          <div className="hidden sm:flex gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Anónimo</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Seguro</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">Sin Rastreo</span>
          </div>
          {/* Mobile: compact single badge */}
          <div className="flex sm:hidden">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">100% Privado</span>
          </div>
        </div>
      </header>

      {/* PROGRESS NAV — hidden on Home */}
      <nav className={`sticky top-[60px] z-40 border-b px-4 py-2 transition-all duration-300 ${screen === 0 ? "bg-white border-slate-200" : "bg-slate-900 border-slate-700"}`}>
        <div className="max-w-6xl mx-auto">
          {screen === 0 ? (
            /* Home: simple breadcrumb */
            <div className="flex items-center justify-center gap-3 py-1">
              <span className="text-xs font-bold text-blue-600">Inicio</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-400">10 Controles</span>
              <span className="text-slate-300">|</span>
              <button onClick={() => goTo(TOTAL + 2)} className="text-xs text-slate-400 hover:text-blue-600 font-semibold transition-colors">Mapeo NIST</button>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="h-1 bg-slate-700 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              {/* Nav pills */}
              <div className="flex items-center gap-0.5 overflow-x-auto pb-0.5 scrollbar-none">
                <button onClick={() => goTo(0)} className="text-[11px] px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                  Inicio
                </button>
                {CONTROLS.map((c, i) => {
                  const isActive = screen === i + 1;
                  const isDone = screen > i + 1;
                  return (
                    <button key={c.id} onClick={() => goTo(i + 1)} title={c.name}
                      className={`text-[10px] md:text-xs w-7 h-7 md:w-9 md:h-9 rounded-md md:rounded-lg flex items-center justify-center font-black transition-all ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40 scale-110" : isDone ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-slate-500 hover:text-white hover:bg-slate-700 border border-slate-700"}`}>
                      {c.number}
                    </button>
                  );
                })}
                <div className="w-px h-6 bg-slate-600 mx-1.5 flex-shrink-0" />
                <button onClick={() => goTo(TOTAL + 1)} className={`text-[11px] px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${screen === TOTAL + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40" : "text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700"}`}>
                  Resultados
                </button>
                <button onClick={() => goTo(TOTAL + 2)} className={`text-[11px] px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${screen === TOTAL + 2 ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40" : "text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700"}`}>
                  Mapeo NIST
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* MAIN */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {/* WELCOME — HERO COVER */}
          {screen === 0 && (
            <div className="animate-in -mx-4">
              {/* ═══ DARK HERO ═══ */}
              <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden rounded-b-3xl">
                {/* Decoracion: no interceptar clics (el nav sticky usa z-40; el contenido debe quedar encima) */}
                <div className="absolute inset-0 hero-grid-pattern opacity-60 pointer-events-none z-0" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />

                <div className="relative z-[45] max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-20 text-center pointer-events-auto">
                  {/* Logo */}
                  <div className="animate-fade-in-up">
                    <img
                      src="/logo-ttpsec.png"
                      alt="TTPSEC" className="h-16 md:h-28 w-auto mx-auto mb-4 md:mb-6 drop-shadow-2xl animate-float"
                    />
                  </div>

                  {/* Title */}
                  <h2 className="animate-fade-in-up-d1 text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-1 md:mb-2 leading-tight">
                    Asesor de<br />
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">Ciberseguridad</span>
                  </h2>

                  {/* Subtitle */}
                  <p className="animate-fade-in-up-d2 text-sm md:text-xl text-blue-200/80 font-medium mt-2 md:mt-4 mb-4 md:mb-6">
                    9 Básicos de la ANCI + Control 0: Gestión de Activos
                  </p>

                  {/* Status badges */}
                  <div className="animate-fade-in-up-d3 flex flex-wrap justify-center gap-1.5 md:gap-2 mb-5 md:mb-8">
                    {[
                      { label: "Anónimo", color: "emerald" },
                      { label: "Seguro", color: "blue" },
                      { label: "Sin Rastreo", color: "purple" },
                      { label: "MIT License", color: "amber" },
                    ].map((b) => (
                      <span key={b.label} className="glass text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-white/90">
                        {b.label}
                      </span>
                    ))}
                  </div>

                  {/* Framework chips */}
                  <div className="animate-fade-in-up-d4 hidden md:flex flex-wrap justify-center gap-1.5 mb-10">
                    {["NIST CSF 2.0"].map((fw) => (
                      <span key={fw} className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md bg-white/5 text-blue-300/80 border border-white/10">
                        {fw}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="animate-fade-in-up-d5 relative z-[45]">
                    <button
                      type="button"
                      onClick={() => goTo(1)}
                      className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-bold px-8 md:px-10 py-3 md:py-4 rounded-2xl text-base md:text-lg shadow-2xl shadow-blue-500/25 hover:-translate-y-1 transition-all animate-pulse-glow"
                    >
                      Comenzar Evaluacion
                    </button>
                  </div>

                  {/* Social share */}
                  <div className="animate-fade-in-up-d5 flex items-center justify-center gap-1.5 md:gap-2 mt-5 md:mt-8 flex-wrap">
                    <span className="text-[10px] md:text-[11px] text-white/40 font-semibold mr-0.5">Compartir:</span>
                    <a href={sharePageUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePageUrl)}` : "#"}
                      onClick={!sharePageUrl ? (e) => e.preventDefault() : undefined}
                      target="_blank" rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-xs font-bold transition-colors ${!sharePageUrl ? "opacity-50 pointer-events-none" : ""}`}>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </a>
                    <a href={sharePageUrl ? `https://twitter.com/intent/tweet?text=${encodeURIComponent("Evalua tu ciberseguridad con los 9 Basicos de la ANCI")}&url=${encodeURIComponent(sharePageUrl)}` : "#"}
                      onClick={!sharePageUrl ? (e) => e.preventDefault() : undefined}
                      target="_blank" rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-xs font-bold transition-colors ${!sharePageUrl ? "opacity-50 pointer-events-none" : ""}`}>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      X
                    </a>
                    <a href={sharePageUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePageUrl)}` : "#"}
                      onClick={!sharePageUrl ? (e) => e.preventDefault() : undefined}
                      target="_blank" rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-xs font-bold transition-colors ${!sharePageUrl ? "opacity-50 pointer-events-none" : ""}`}>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                    <a href={sharePageUrl ? `https://wa.me/?text=${encodeURIComponent(`Evalua tu ciberseguridad con los 9 Basicos de la ANCI ${sharePageUrl}`)}` : "#"}
                      onClick={!sharePageUrl ? (e) => e.preventDefault() : undefined}
                      target="_blank" rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-xs font-bold transition-colors ${!sharePageUrl ? "opacity-50 pointer-events-none" : ""}`}>
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  </div>

                  {/* Legal line */}
                  <p className="text-[10px] text-white/25 mt-6">Ley 21.663 | Instrucciones Generales ANCI 1-4 de 2025 | MITRE ATT&CK</p>
                </div>

                {/* Bottom shimmer bar */}
                <div className="h-1 animate-shimmer" />
              </section>

              {/* ═══ LIGHT SECTION ═══ */}
              <div className="max-w-4xl mx-auto px-4 pt-10">
                {/* Features */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: "\uD83D\uDD12", title: "100% Anónimo", desc: "Sin registro, sin cookies, sin tracking. Tu evaluación es completamente privada." },
                    { icon: "\uD83C\uDF10", title: "NIST CSF 2.0", desc: "Recomendaciones y mapeo alineados al Cybersecurity Framework 2.0 del NIST." },
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
                <div className="mb-8 text-center">
                  <h3 className="text-sm font-bold text-slate-700 mb-4">Selecciona tu contexto organizacional:</h3>
                  <div className="flex gap-3 justify-center flex-wrap">
                    {([
                      { value: "ti" as OrgContext, icon: "\uD83D\uDCBB", label: "TI Corporativo", desc: "Oficinas, servidores, nube" },
                      { value: "ot" as OrgContext, icon: "\u2699\uFE0F", label: "OT / ICS", desc: "SCADA, DCS, PLCs" },
                      { value: "critica" as OrgContext, icon: "\u26A1", label: "Infraestructura Crítica", desc: "Energía, agua, transporte" },
                    ]).map((opt) => (
                      <button key={opt.value} onClick={() => setContext(opt.value)}
                        className={`flex flex-col items-center gap-0.5 md:gap-1 px-3 md:px-6 py-2.5 md:py-4 rounded-xl border-2 transition-all flex-1 min-w-[90px] md:min-w-[150px] ${context === opt.value ? "border-blue-600 bg-blue-50 shadow-md shadow-blue-100" : "border-slate-200 bg-white hover:border-slate-300"}`}>
                        <span className="text-lg md:text-2xl">{opt.icon}</span>
                        <span className="text-[11px] md:text-sm font-bold text-slate-800 leading-tight">{opt.label}</span>
                        <span className="text-[10px] text-slate-500 hidden sm:block">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-5 text-center">
                  <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-2">Plataforma académica y educativa</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Este sitio <strong className="text-amber-900">no está afiliado, asociado ni respaldado</strong> por ningún ente gubernamental, la ANCI, ni el Gobierno de Chile.
                    No reemplaza una auditoría formal de ciberseguridad ni constituye asesoría legal.
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    Herramienta independiente desarrollada por <strong className="text-blue-800">TTPSEC</strong>, alineada con los 9 Básicos de la Ciberseguridad publicados por la ANCI.
                    Ningún dato es almacenado ni transmitido fuera de tu navegador.
                  </p>
                </div>
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

          {/* Tabla mapeo ANCI - NIST CSF 2.0 */}
          {screen === TOTAL + 2 && (
            <div className="animate-in">
              <h2 className="text-2xl md:text-3xl font-black text-center text-slate-900 tracking-tight mb-2">Mapeo ANCI a NIST CSF 2.0</h2>
              <p className="text-sm text-slate-500 text-center mb-4">Cada fila enlaza un control ANCI con la funcion, la categoria y un ejemplo de subcategoria del nucleo oficial.</p>
              <NistMappingLegend className="mb-6 max-w-3xl mx-auto" />
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-md bg-white">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                      <th className="px-3 py-3 font-bold text-[11px]">Control</th>
                      <th className="px-3 py-3 font-bold text-[11px]">Nombre en la app</th>
                      <th className="px-3 py-3 font-bold text-[11px]">Objetivo (ANCI)</th>
                      <th className="px-3 py-3 font-bold text-[11px]">Funcion y categoria NIST</th>
                      <th className="px-3 py-3 font-bold text-[11px] min-w-[200px]">Subcategoria ejemplo</th>
                      <th className="px-3 py-3 font-bold text-[11px] min-w-[280px]">Por que este NIST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CONTROLS.map((c, i) => (
                      <tr key={c.id} className={`border-t border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"} hover:bg-blue-50 transition-colors`}>
                        <td className="px-3 py-2.5 font-black text-blue-700 whitespace-nowrap">C{c.number}</td>
                        <td className="px-3 py-2.5 font-bold text-slate-800">{c.name}</td>
                        <td className="px-3 py-2.5 text-slate-600">{c.nistCsf.objective}</td>
                        <td className="px-3 py-2.5 font-mono text-indigo-800 font-semibold text-[11px] leading-snug">{c.nistCsf.functionCategory}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-700 text-[11px] leading-snug">{c.nistCsf.subcategoryExample}</td>
                        <td className="px-3 py-2.5 text-slate-600 text-[11px] leading-snug max-w-md">{c.nistCsf.mappingWhy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">Referencia normativa:</strong>{" "}
                  <a href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NIST Cybersecurity Framework 2.0</a>
                  (CSWP 29). La leyenda de arriba define funcion, categoria y subcategoria; el detalle ampliado esta en <span className="font-mono text-slate-600">docs/NIST_CSF_MAPPING.md</span>.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Top row: 3 columns */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Col 1: Brand */}
            <div className="flex flex-col items-center md:items-start">
              <img src="/logo-ttpsec.png" alt="TTPSEC" className="h-12 w-auto mb-3" />
              <a href="https://www.ttpsec.ai" target="_blank" rel="noopener noreferrer" className="text-base font-black text-white hover:text-blue-400 tracking-tight transition-colors">
                www.ttpsec.ai
              </a>
              <p className="text-[11px] text-slate-400 mt-1 italic">Software para el bien común</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  v{APP_VERSION}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {APP_DATE}
                </span>
              </div>
            </div>

            {/* Col 2: Marco NIST */}
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">Marco de referencia</p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {["NIST CSF 2.0"].map((fw) => (
                  <span key={fw} className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5 text-blue-300/80 border border-white/10">{fw}</span>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                {["Sin cookies", "Sin registro", "Sin analytics", "100% local"].map((t) => (
                  <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">{t}</span>
                ))}
              </div>
            </div>

            {/* Col 3: Links */}
            <div className="flex flex-col items-center md:items-end gap-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Legal</p>
              <a href="https://github.com/ttpsecspa/ANCI/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"
                className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                MIT License
              </a>
              <a href="https://github.com/ttpsecspa/ANCI" target="_blank" rel="noopener noreferrer"
                className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors">
                GitHub
              </a>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-3 mb-1">Te fue útil?</p>
              <a href="https://www.linkedin.com/in/profesorsvargasy/details/recommendations/edit/write?profileFormEntryPoint=Detail" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A66C2] text-white text-xs font-bold hover:bg-[#004182] transition-all shadow-md hover:-translate-y-0.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                Recomendar en LinkedIn
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px] text-slate-600">
              © {new Date().getFullYear()} TTPSEC SPA — Asesor ANCI 9 Básicos de Ciberseguridad
            </p>
            <p className="text-[10px] font-mono text-slate-600">
              v{APP_VERSION} | {APP_DATE} | NIST CSF 2.0 | Ley 21.663 | MITRE ATT&CK
            </p>
          </div>
        </div>
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
          <details className="mt-2 text-[11px] text-slate-600">
            <summary className="cursor-pointer font-semibold text-blue-600 hover:text-blue-800 select-none">
              Por que este NIST en este control
            </summary>
            <p className="mt-1.5 leading-relaxed border-l-2 border-blue-200 pl-3">{control.nistCsf.mappingWhy}</p>
          </details>
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

// Leyenda NIST CSF 2.0 (funcion / categoria / subcategoria) — sin tildes en strings de codigo
function NistMappingLegend({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-blue-200 bg-blue-50/80 p-4 text-left ${className}`}>
      <p className="text-[11px] font-extrabold text-blue-800 uppercase tracking-wider mb-2">Leyenda del mapeo NIST CSF 2.0</p>
      <ul className="text-[11px] text-slate-700 space-y-2 leading-relaxed list-none">
        <li>
          <span className="font-bold text-slate-900">Funcion NIST:</span> una de las seis del nucleo oficial (GV, ID, PR, DE, RS, RC). En la tabla aparece con nombre largo, p. ej. ID (Identify).
        </li>
        <li>
          <span className="font-bold text-slate-900">Categoria NIST:</span> codigo despues del punto bajo esa funcion (p. ej. ID.AM, PR.AA, PR.PS). Agrupa temas del documento NIST. Un control puede mostrar varias si el tema cruza funciones.
        </li>
        <li>
          <span className="font-bold text-slate-900">Subcategoria (ejemplo):</span> codigo oficial tipo PR.AA-05 o ID.AM-01 mas una frase del NIST. Es <span className="font-semibold">un ejemplo representativo</span> por control, no el listado completo de subcategorias que podrian aplicar.
        </li>
        <li>
          <span className="font-bold text-slate-900">Objetivo (ANCI):</span> eje en lenguaje de los basicos ANCI; no es una etiqueta del NIST.
        </li>
        <li>
          <span className="font-bold text-slate-900">Por que este NIST:</span> en cada control, texto que explica la razon del enlace a funcion, categoria y ejemplo (mismo contenido que en <span className="font-mono">data.ts</span>).
        </li>
      </ul>
      <p className="text-[10px] text-slate-500 mt-3 leading-relaxed">
        Fuente de los codigos: nucleo NIST CSF 2.0 (CSWP 29). Detalle en el repo: <span className="font-mono text-slate-600">docs/NIST_CSF_MAPPING.md</span>
      </p>
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

      <NistMappingLegend className="mb-6" />

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
                {/* Alineacion NIST CSF 2.0 */}
                <p className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider mb-2">Alineacion NIST CSF 2.0</p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-4 space-y-1.5">
                  <p className="text-[11px] text-slate-600"><span className="font-bold text-slate-800">Objetivo (ANCI):</span> {s.control.nistCsf.objective}</p>
                  <p className="text-[11px] text-slate-600"><span className="font-bold text-slate-800">Funcion y categoria NIST:</span>{" "}<span className="font-mono text-indigo-800">{s.control.nistCsf.functionCategory}</span></p>
                  <p className="text-[11px] text-slate-600"><span className="font-bold text-slate-800">Ejemplo de subcategoria:</span>{" "}<span className="font-mono text-slate-700">{s.control.nistCsf.subcategoryExample}</span></p>
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-200 mt-2"><span className="font-bold text-slate-800">Por que este NIST:</span> {s.control.nistCsf.mappingWhy}</p>
                </div>
                {/* MITRE */}
                <p className="text-[11px] font-extrabold text-red-600 uppercase tracking-wider mb-1.5">MITRE ATT&CK (contexto de amenazas)</p>
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
        <button type="button" onClick={() => { try { window.print(); } catch(e) { alert('Use Ctrl+P para imprimir/exportar a PDF'); } }} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-all cursor-pointer">
          Exportar PDF (Imprimir)
        </button>
        <button type="button" onClick={() => { try { onExport(); } catch(e) { alert('Error al exportar: ' + e); } }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-all cursor-pointer">
          Descargar Informe (HTML)
        </button>
        <button type="button" onClick={() => { onRestart(); }} className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer">
          Nueva Evaluación
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-5 text-center">
        <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-2">Plataforma académica y educativa</p>
        <p className="text-xs text-slate-600 leading-relaxed">
          Este sitio <strong className="text-amber-900">no está afiliado, asociado ni respaldado</strong> por ningún ente gubernamental, la ANCI, ni el Gobierno de Chile.
          No reemplaza una auditoría formal de ciberseguridad ni constituye asesoría legal.
          Herramienta independiente desarrollada por <strong className="text-blue-800">TTPSEC</strong>.
          Ningún dato fue almacenado, transmitido ni procesado fuera de su navegador.
          Marco de madurez: <strong className="text-slate-700">NIST CSF 2.0</strong>.
        </p>
        <p className="text-sm font-bold text-blue-800 mt-2">
          <a href="https://www.ttpsec.ai" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">www.ttpsec.ai</a>
        </p>
        <p className="text-xs text-slate-500 italic">Software para el bien común</p>
      </div>
    </div>
  );
}
