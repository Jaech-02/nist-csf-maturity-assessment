import { ASSET_BASE_PATH, PUBLIC_SITE_URL, UPTLIBRE_PORTAL_URL } from "@/lib/site";
import { APP_VERSION, APP_DATE } from "@/lib/version";

const BASE = ASSET_BASE_PATH;
const PUBLIC_SITE = PUBLIC_SITE_URL;
const REPO_URL = "https://github.com/Jaech-02/nist-csf-maturity-assessment";

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-red-200 bg-white text-zinc-800 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.06)]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
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

        <div className="mt-8 border-t border-zinc-100 pt-4">
          <p className="mx-auto max-w-2xl text-center text-[10px] sm:text-[11px] leading-relaxed text-zinc-500">
            <span className="sr-only">Aviso: </span>
            Plataforma de evaluacion de madurez en ciberseguridad basada en NIST CSF 2.0. Uso orientado a autoevaluacion y mejora continua. No reemplaza evaluaciones formales ni documentacion oficial del NIST.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px] text-zinc-500">
              © {new Date().getFullYear()} uptlibre — Asesor madurez NIST CSF 2.0
            </p>
            <p className="text-[10px] font-mono text-zinc-500">
              v{APP_VERSION} | {APP_DATE} | Sin afiliacion NIST
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
