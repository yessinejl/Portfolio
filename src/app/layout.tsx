import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProfileProvider } from "@/context/ProfileContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mon Portfolio Professionnel | Développeur Full-Stack",
  description: "Découvrez mon travail, mes compétences et mes projets de développement web de niveau professionnel.",
  keywords: ["Développeur Web", "React", "Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Portfolio SaaS"],
  authors: [{ name: "Votre Nom", url: "https://votre-portfolio.com" }],
  creator: "Votre Nom",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://votre-portfolio.com"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://votre-portfolio.com",
    title: "Mon Portfolio Professionnel | Développeur Full-Stack",
    description: "Découvrez mon travail, mes compétences et mes projets de développement web de niveau professionnel.",
    siteName: "Portfolio de Votre Nom",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Aperçu de mon portfolio professionnel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mon Portfolio Professionnel | Développeur Full-Stack",
    description: "Découvrez mon travail, mes compétences et mes projets de développement web de niveau professionnel.",
    images: ["/og-image.jpg"],
    creator: "@votre_twitter",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300`}
      >
        <ThemeProvider>
          <ProfileProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
