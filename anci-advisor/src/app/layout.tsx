import type { Metadata } from "next";
import "./globals.css";
import { ASSET_BASE_PATH, PUBLIC_SITE_URL } from "@/lib/site";

const SITE = PUBLIC_SITE_URL.replace(/\/$/, "");

/** Raster para OG/Twitter: muchas redes ignoran SVG en og:image. */
const OG_IMAGE_PATH = `${ASSET_BASE_PATH}/open-graph.png`.replace(/\/{2,}/g, "/") || "/open-graph.png";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE}/`),
  title: "Asesor NIST CSF 2.0 - Madurez en ciberseguridad",
  description: "Evaluacion anonima de madurez basada en el NIST Cybersecurity Framework (CSF) 2.0. Sin registro, sin cookies, sin tracking. 100% local en el navegador.",
  robots: "index, follow",
  authors: [{ name: "uptlibre", url: PUBLIC_SITE_URL }],
  keywords: ["ciberseguridad", "NIST CSF", "NIST CSF 2.0", "madurez", "evaluacion", "uptlibre", "seguridad informatica", "infraestructura critica"],
  openGraph: {
    title: "Asesor NIST CSF 2.0",
    description: "Evalua madurez con el Core del NIST CSF 2.0. Anonimo, sin registro, sin datos en servidor.",
    url: SITE,
    siteName: "NIST CSF 2.0",
    locale: "es",
    type: "website",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1024,
        height: 572,
        type: "image/png",
        alt: "Asesor NIST CSF 2.0 - infografia de madurez y funciones del marco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Asesor NIST CSF 2.0",
    description: "Evalua madurez con NIST CSF 2.0. Anonimo y local en tu navegador.",
    images: [OG_IMAGE_PATH],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" dir="ltr">
      <head>
        <meta name="referrer" content="no-referrer" />
        <meta name="theme-color" content="#f87171" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="license" href="https://github.com/Jaech-02/nist-csf-maturity-assessment/blob/main/LICENSE" />
      </head>
      <body className="bg-zinc-50 text-zinc-900 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
