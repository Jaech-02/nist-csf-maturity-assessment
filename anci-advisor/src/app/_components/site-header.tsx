import { ASSET_BASE_PATH, UPTLIBRE_PORTAL_URL } from "@/lib/site";

const BASE = ASSET_BASE_PATH;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-red-200/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 ring-1 ring-zinc-200 shadow-sm">
            <img src={`${BASE}/logo_uptlibre.png`} alt="uptlibre" className="max-h-full max-w-full object-contain" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[14px] md:text-lg font-black text-zinc-900 tracking-tight font-serif">uptlibre</h1>
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
        <div className="flex sm:hidden">
          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
            <i className="fa-solid fa-user-shield text-[10px]" aria-hidden />
            100% Privado
          </span>
        </div>
      </div>
    </header>
  );
}
