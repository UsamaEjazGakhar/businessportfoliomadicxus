import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Medicxus Group – Empowering Healthcare. Transforming Lives.",
  description:
    "Medicxus Group is a diversified healthcare technology conglomerate uniting education, diagnostics, MBBS consultancy and IT solutions for a healthier world.",
  metadataBase: new URL("https://medicxus.com"),
  openGraph: {
    title: "Medicxus Group",
    description: "Empowering Healthcare. Transforming Lives.",
    url: "https://medicxus.com",
    siteName: "Medicxus Group Portal",
    images: [{ url: "/assets/og-image.jpg", width: 1200, height: 630, alt: "Medicxus Group" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medicxus Group",
    description: "Empowering Healthcare. Transforming Lives.",
    images: ["/assets/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  name: "Medicxus Group",
  url: "https://medicxus.com",
  logo: "https://medicxus.com/assets/logo.png",
  sameAs: [
    "https://linkedin.com/company/medicxus",
    "https://twitter.com/medicxus",
    "https://facebook.com/medicxus",
  ],
  department: [
    { "@type": "EducationalOrganization", name: "Care Institute of Health Sciences" },
    { "@type": "MedicalBusiness", name: "Medicxus Diagnostic" },
    { "@type": "Organization", name: "Study Abroad MBBS Project" },
    { "@type": "Organization", name: "Healthcare IT Solutions" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSans.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-outfit bg-canvas text-heading antialiased overflow-x-hidden">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
