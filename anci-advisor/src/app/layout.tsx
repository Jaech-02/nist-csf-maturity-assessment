import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TTPSEC | Asesor ANCI - 9 Básicos de Ciberseguridad",
  description: "Evaluación anónima de ciberseguridad basada en los 9 Básicos de la ANCI. Sin registro, sin cookies, sin tracking. Recomendaciones ISO 27001, NIST CSF, NIST 800-53, CIS v8.1, ISA 62443, NERC CIP.",
  robots: "index, follow",
  authors: [{ name: "TTPSEC", url: "https://www.ttpsec.ai" }],
  keywords: ["ciberseguridad", "ANCI", "9 básicos", "ISO 27001", "NIST CSF", "NIST 800-53", "CIS Controls", "ISA 62443", "NERC CIP", "evaluación", "Chile", "TTPSEC", "seguridad informática"],
  openGraph: {
    title: "TTPSEC | Asesor ANCI - 9 Básicos de Ciberseguridad",
    description: "Evalúa el nivel de madurez de tu organización en ciberseguridad. 100% anónimo, sin registro, con recomendaciones alineadas a ISO, NIST, CIS, ISA y NERC CIP.",
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
    description: "Evalúa tu ciberseguridad con los 9 Básicos de la ANCI. Anónimo, seguro, sin registro. Recomendaciones ISO, NIST, CIS, ISA, NERC CIP.",
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
