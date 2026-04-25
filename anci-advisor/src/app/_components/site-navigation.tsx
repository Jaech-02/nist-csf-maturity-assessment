import { CONTROLS } from "@/lib/data";

const TOTAL = CONTROLS.length;
const SCREEN_RESULTS = TOTAL + 1;
const SCREEN_CORE = TOTAL + 2;
const SCREEN_HISTORIAL = TOTAL + 3;

export type SiteNavigationProps = {
  screen: number;
  progress: number;
  onGoTo: (screen: number) => void;
  onRestartEval: () => void;
};

export function SiteNavigation({ screen, progress, onGoTo, onRestartEval }: SiteNavigationProps) {
  return (
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
            <button type="button" onClick={() => onGoTo(SCREEN_HISTORIAL)} className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-600 font-semibold transition-colors">
              <i className="fa-solid fa-chart-line text-[12px]" aria-hidden />
              Seguimiento
            </button>
            <span className="text-zinc-300">|</span>
            <button type="button" onClick={() => onGoTo(SCREEN_CORE)} className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-red-600 font-semibold transition-colors">
              <i className="fa-solid fa-sitemap text-[12px]" aria-hidden />
              Core CSF
            </button>
          </div>
        ) : (
          <>
            <div className="h-1.5 bg-red-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-red-400 via-red-500 to-amber-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center gap-0.5 overflow-x-auto pb-0.5 scrollbar-none">
              <button type="button" onClick={() => onGoTo(0)} className="inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-md whitespace-nowrap font-semibold text-zinc-600 hover:text-red-700 hover:bg-red-50 transition-all">
                <i className="fa-solid fa-house text-[12px]" aria-hidden />
                Inicio
              </button>
              {CONTROLS.map((c, i) => {
                const isActive = screen === i + 1;
                const isDone = screen > i + 1;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => onGoTo(i + 1)}
                    title={`${c.baseControlCode}: ${c.name}`}
                    className={`text-[11px] md:text-[12px] min-w-8 h-8 md:min-w-9 md:h-9 px-0.5 rounded-md flex items-center justify-center font-mono font-black transition-all ${isActive ? "bg-red-600 text-white shadow-md shadow-red-200 scale-110 ring-1 ring-red-300" : isDone ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "text-zinc-500 hover:text-red-700 hover:bg-red-50 border border-zinc-200 bg-white"}`}
                  >
                    {c.baseControlCode}
                  </button>
                );
              })}
              <div className="w-px h-6 bg-zinc-200 mx-1.5 shrink-0" />
              <button type="button" onClick={() => onGoTo(SCREEN_RESULTS)} className={`inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-md whitespace-nowrap font-semibold transition-all ${screen === SCREEN_RESULTS ? "bg-red-600 text-white shadow-md shadow-red-100" : "text-zinc-600 hover:text-red-700 hover:bg-red-50 border border-zinc-200 bg-white"}`}>
                <i className="fa-solid fa-chart-pie text-[12px]" aria-hidden />
                Resultados
              </button>
              <button type="button" onClick={() => onGoTo(SCREEN_HISTORIAL)} className={`inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-md whitespace-nowrap font-semibold transition-all ${screen === SCREEN_HISTORIAL ? "bg-amber-700 text-white shadow-md shadow-amber-100" : "text-zinc-600 hover:text-red-700 hover:bg-red-50 border border-zinc-200 bg-white"}`}>
                <i className="fa-solid fa-chart-line text-[12px]" aria-hidden />
                Seguimiento
              </button>
              <button type="button" onClick={() => onGoTo(SCREEN_CORE)} className={`inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-md whitespace-nowrap font-semibold transition-all ${screen === SCREEN_CORE ? "bg-red-700 text-white shadow-md shadow-red-100" : "text-zinc-600 hover:text-red-700 hover:bg-red-50 border border-zinc-200 bg-white"}`}>
                <i className="fa-solid fa-sitemap text-[12px]" aria-hidden />
                Core CSF
              </button>
              <button
                type="button"
                onClick={onRestartEval}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-zinc-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-800"
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
  );
}
