import type { Metadata } from "next";
import "./globals.css";

const METADATA_BASE_FALLBACK = "http://localhost:3000";

function resolveMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return new URL(`${METADATA_BASE_FALLBACK}/`);
  }
  const origin = raw.replace(/\/$/, "");
  try {
    return new URL(`${origin}/`);
  } catch {
    return new URL(`${METADATA_BASE_FALLBACK}/`);
  }
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: "TTPSEC | Asesor ANCI - 9 Básicos de Ciberseguridad",
  description: "Evaluacion anonima basada en los 9 Basicos de la ANCI y Control 0. Sin registro ni tracking. Mapeo y recomendaciones alineadas a NIST CSF 2.0.",
  robots: "index, follow",
  authors: [{ name: "TTPSEC", url: "https://www.ttpsec.ai" }],
  keywords: ["ciberseguridad", "ANCI", "9 basicos", "NIST CSF 2.0", "NIST Cybersecurity Framework", "evaluacion", "Chile", "TTPSEC", "madurez"],
  openGraph: {
    title: "TTPSEC | Asesor ANCI - 9 Básicos de Ciberseguridad",
    description: "Evalua la madurez en ciberseguridad con los Basicos ANCI. 100% anonimo. Recomendaciones alineadas a NIST CSF 2.0.",
    url: "https://www.ttpsec.ai",
    siteName: "TTPSEC - Asesor ANCI",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TTPSEC - Asesor de Ciberseguridad ANCI Chile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TTPSEC | Asesor ANCI - 9 Básicos de Ciberseguridad",
    description: "Evalua tu ciberseguridad con los 9 Basicos de la ANCI. Anonimo y local. Marco de referencia: NIST CSF 2.0.",
    images: ["/og-image.png"],
    creator: "@ttpsec",
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
        <meta name="theme-color" content="#1e40af" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="license" href="https://github.com/ttpsecspa/ANCI/blob/main/LICENSE" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
