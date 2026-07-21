import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./layout/NavBar";
import Footer from "./layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { institution } from "@/config/institution";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "IES Nuevo Horizonte | Educación Superior en Jujuy",
  description: "Instituto de Educación Superior Nuevo Horizonte. Formación técnica y profesional en San Salvador de Jujuy.",
  keywords: "IESNH, Instituto de Educación Superior Nuevo Horizonte, carreras, tecnicaturas, Jujuy, Argentina",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "IES Nuevo Horizonte",
    title: "IES Nuevo Horizonte | Educación Superior en Jujuy",
    description: "Formación técnica y profesional en San Salvador de Jujuy.",
    images: [{ url: "/instituto.jpg", alt: "Instituto de Educación Superior Nuevo Horizonte" }],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: institution.name,
    alternateName: institution.shortName,
    address: {
      "@type": "PostalAddress",
      streetAddress: institution.address,
      addressLocality: institution.city,
      addressRegion: institution.province,
      postalCode: institution.postalCode,
      addressCountry: "AR",
    },
    telephone: institution.primaryPhone.label,
    sameAs: [institution.social.facebook, institution.social.instagram],
  };

  return (
    <html lang="es-AR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
