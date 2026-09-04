'use client';

import React from 'react';

import Link from 'next/link';
import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { useProfile } from '@/context/ProfileContext';

export default function Footer() {
  const { profile } = useProfile();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo / Nom */}
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {currentYear} {profile?.name || 'Yassine Jlassia'}. Tous droits réservés.
            </p>
          </div>

          {/* Réseaux sociaux */}
          <div className="flex items-center space-x-6">
            <Link
              href={profile?.github_url || "https://github.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              aria-label="Profil GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </Link>
            <Link
              href={profile?.linkedin_url || "https://linkedin.com/in/Yassinejlassia"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              aria-label="Profil LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </Link>
            <Link
              href={`mailto:${profile?.email || 'yacinejlassia@gmail.com'}`}
              className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              aria-label="Envoyer un email"
            >
              <Mail className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
