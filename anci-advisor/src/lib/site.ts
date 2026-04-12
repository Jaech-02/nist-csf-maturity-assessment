/**
 * URL publica (compartir, OG, enlaces). En Docker/CI: build-arg NEXT_PUBLIC_SITE_URL.
 * Fallback para desarrollo local sin env.
 */
export const PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || "https://nistcsf.uptlibre.pe";

/** Portal del grupo de investigacion (sitio principal UPTLIBRE). */
export const UPTLIBRE_PORTAL_URL = "https://www.uptlibre.pe";

/**
 * Prefijo de assets si la app no esta en la raiz. Build: NEXT_PUBLIC_BASE_PATH.
 */
export const ASSET_BASE_PATH = (() => {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH?.trim();
  if (!raw) return "";
  const n = raw.replace(/\/+$/, "");
  return n.startsWith("/") ? n : `/${n}`;
})();
