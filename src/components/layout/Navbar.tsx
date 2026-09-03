'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X, Globe } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/context/ProfileContext';
import { useLanguage, Language } from '@/context/LanguageContext';

interface NavLink {
  key: 'nav_home' | 'nav_skills' | 'nav_projects' | 'nav_contact';
  href: string;
}

const navLinks: NavLink[] = [
  { key: 'nav_home', href: '/' },
  { key: 'nav_skills', href: '#skills' },
  { key: 'nav_projects', href: '#projects' },
  { key: 'nav_contact', href: '#contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { profile } = useProfile();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const LanguageSelector = () => (
    <div className="relative flex items-center">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label="Select Language"
      >
        <option value="fr" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">FR</option>
        <option value="en" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">EN</option>
        <option value="ar" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">العربية</option>
      </select>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/75 dark:bg-slate-950/75 border-b border-slate-200/30 dark:border-slate-800/30 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Nom */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
            >
              {profile?.name || 'Yassine Jlassia'}
            </Link>
          </div>

          {/* Liens de navigation (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t(link.key)}
                </Link>
              );
            })}

            <div className="flex items-center gap-3 border-l border-slate-200/50 dark:border-slate-800/80 pl-6 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">
              {/* Sélecteur de Langue Desktop */}
              <LanguageSelector />

              {/* Bouton de bascule de thème */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors duration-200 cursor-pointer"
                aria-label="Changer de thème"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Commandes Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Sélecteur de Langue Mobile */}
            <LanguageSelector />

            {/* Bouton Thème Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
              aria-label="Changer de thème"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Bouton Menu Hamburger */}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer"
              aria-label="Ouvrir le menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 transition-all duration-300 ease-in-out">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
