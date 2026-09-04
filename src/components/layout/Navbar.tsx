'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, X, Command, Search, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/context/ProfileContext';
import { useLanguage, Language } from '@/context/LanguageContext';
import ScrollProgressBar from '@/components/ui/ScrollProgressBar';
import CommandPalette from '@/components/ui/CommandPalette';

interface NavLink {
  key: 'nav_home' | 'nav_skills' | 'nav_projects' | 'nav_contact';
  labelFallback: string;
  href: string;
}

const navLinks: NavLink[] = [
  { key: 'nav_home', labelFallback: 'Accueil', href: '#hero' },
  { key: 'nav_skills', labelFallback: 'Compétences', href: '#skills' },
  { key: 'nav_projects', labelFallback: 'Projets', href: '#projects' },
  { key: 'nav_contact', labelFallback: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { profile } = useProfile();
  const { language, setLanguage, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Détection du scroll et de la section active via IntersectionObserver
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const sectionIds = ['hero', 'skills', 'projects', 'contact'];
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.3,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Écouteur global pour raccourci Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const LanguageSelector = () => (
    <div className="relative flex items-center">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        aria-label="Select Language"
      >
        <option value="fr" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">FR</option>
        <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">EN</option>
        <option value="ar" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">AR</option>
      </select>
    </div>
  );

  return (
    <>
      {/* Barre de progression du scroll au sommet */}
      <ScrollProgressBar />

      {/* Palette de commande modale (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Conteneur fixe centré pour la Navbar Flottante Glass Pill */}
      <header className="fixed top-3 left-0 right-0 z-50 px-4 pointer-events-none">
        <nav
          className={`max-w-5xl mx-auto pointer-events-auto transition-all duration-300 rounded-full border shadow-xl backdrop-blur-xl ${
            isScrolled
              ? 'bg-white/85 dark:bg-slate-950/85 border-slate-200/80 dark:border-slate-800/80 shadow-slate-900/10 dark:shadow-blue-500/10 py-2 px-4 sm:px-6'
              : 'bg-white/70 dark:bg-slate-950/70 border-slate-200/50 dark:border-slate-800/50 py-2.5 px-4 sm:px-6'
          }`}
        >
          <div className="flex items-center justify-between">
            
            {/* Logo / Nom + Status Badge */}
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="flex items-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[2px] shadow-sm group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-white dark:bg-slate-950 rounded-full flex items-center justify-center">
                    <span className="text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      {(profile?.name || 'Yassine Jlassia').charAt(0)}
                    </span>
                  </div>
                </div>
                
                <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors hidden xs:inline-block">
                  {profile?.name?.split(' ')[0] || 'Yassine'}
                  <span className="text-blue-600 dark:text-blue-400">.dev</span>
                </span>
              </Link>

              {/* Badge de statut clignotant "Disponible" */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Disponible</span>
              </div>
            </div>

            {/* Liens de navigation avec slider pilule Framer Motion (Desktop) */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100/60 dark:bg-slate-900/60 p-1 rounded-full border border-slate-200/40 dark:border-slate-800/40 relative">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href;
                const isHovered = hoveredSection === link.href;
                const label = t(link.key) || link.labelFallback;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onMouseEnter={() => setHoveredSection(link.href)}
                    onMouseLeave={() => setHoveredSection(null)}
                    onClick={() => setActiveSection(link.href)}
                    className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-colors z-10 ${
                      isActive
                        ? 'text-white'
                        : isHovered
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {/* Arrière-plan animé de l'onglet actif */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-md shadow-blue-500/25 -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Effet de survol léger si non actif */}
                    {isHovered && !isActive && (
                      <motion.div
                        layoutId="hoverTabPill"
                        className="absolute inset-0 bg-slate-200/60 dark:bg-slate-800/60 rounded-full -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}

                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Actions Droite : Command Palette + Langue + Thème */}
            <div className="flex items-center gap-2">
              
              {/* Bouton Trigger Command Palette (Ctrl+K) */}
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200/50 dark:border-slate-700/50 transition-all cursor-pointer group"
                title="Ouvrir la palette de commande (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Rechercher</span>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="sm:hidden p-2 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 cursor-pointer"
                aria-label="Rechercher"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Sélecteur de Langue */}
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>

              {/* Bouton de bascule de Thème */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50 transition-all cursor-pointer shadow-xs"
                aria-label="Changer de thème"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              {/* Bouton Menu Mobile (Hamburger) */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 md:hidden rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                aria-label="Ouvrir le menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>
          </div>
        </nav>
      </header>

      {/* Menu Mobile Tiroir Flottant */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-20 left-4 right-4 z-50 md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Disponible pour opportunités</span>
              </div>
              <LanguageSelector />
            </div>

            <div className="space-y-1.5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href;
                const label = t(link.key) || link.labelFallback;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      setActiveSection(link.href);
                      setIsOpen(false);
                    }}
                    className={`block px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsCommandPaletteOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold w-full justify-center"
              >
                <Command className="w-4 h-4" />
                <span>Ouvrir la Command Palette (Ctrl+K)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
