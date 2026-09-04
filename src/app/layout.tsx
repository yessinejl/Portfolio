import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cairo, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ProfileProvider } from "@/context/ProfileContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Preloader from "@/components/ui/Preloader";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

export const metadata: Metadata = {
  title: "Yassine Jlassia | Développeur Full-Stack & Mobile",
  description: "Portfolio professionnel de Yassine Jlassia, Développeur Full-Stack spécialisé en Java, Spring Boot, React, Angular, Python et Flutter.",
  keywords: ["Yassine Jlassia", "Développeur Full-Stack", "Spring Boot", "React", "Angular", "Python", "Django", "Flutter", "Symfony"],
  authors: [{ name: "Yassine Jlassia", url: "https://github.com/Yassinejlassia" }],
  creator: "Yassine Jlassia",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-yassine.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${plusJakartaSans.variable} ${cairo.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300`}
      >
        <ThemeProvider>
          <AnimatedBackground />
          <Preloader />
          <LanguageProvider>
            <ProfileProvider>
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </ProfileProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
