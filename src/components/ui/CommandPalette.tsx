'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  Code2, 
  FolderKanban, 
  Mail, 
  FileText, 
  Sun, 
  Moon, 
  ExternalLink, 
  X, 
  GraduationCap, 
  Sparkles,
  Command,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useProfile } from '@/context/ProfileContext';
import { useLanguage } from '@/context/LanguageContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { profile } = useProfile();
  const { t } = useLanguage();

  // Écoute du raccourci clavier Ctrl+K ou Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via parent if needed, handled in parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'sec-home',
      category: 'Navigation',
      label: t('nav_home') || 'Accueil',
      icon: User,
      action: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'sec-skills',
      category: 'Navigation',
      label: t('nav_skills') || 'Compétences',
      icon: Code2,
      action: () => {
        document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'sec-projects',
      category: 'Navigation',
      label: t('nav_projects') || 'Projets',
      icon: FolderKanban,
      action: () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'sec-timeline',
      category: 'Navigation',
      label: 'Parcours & Expériences',
      icon: GraduationCap,
      action: () => {
        document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'sec-contact',
      category: 'Navigation',
      label: t('nav_contact') || 'Contact',
      icon: Mail,
      action: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'act-cv',
      category: 'Actions Rapides',
      label: 'Télécharger le CV (PDF)',
      icon: FileText,
      badge: 'PDF',
      action: () => {
        window.open(profile?.cvUrl || '/cv.pdf', '_blank');
        onClose();
      }
    },
    {
      id: 'act-theme',
      category: 'Actions Rapides',
      label: theme === 'dark' ? 'Passer au Mode Clair' : 'Passer au Mode Sombre',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      }
    },
    {
      id: 'act-github',
      category: 'Liens Réseaux',
      label: 'Profil GitHub',
      icon: ExternalLink,
      action: () => {
        window.open(profile?.github_url || 'https://github.com', '_blank');
        onClose();
      }
    },
    {
      id: 'act-linkedin',
      category: 'Liens Réseaux',
      label: 'Profil LinkedIn',
      icon: ExternalLink,
      action: () => {
        window.open(profile?.linkedin_url || 'https://linkedin.com', '_blank');
        onClose();
      }
    }
  ];

  const filteredActions = actions.filter((act) =>
    act.label.toLowerCase().includes(query.toLowerCase()) ||
    act.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop de flou obscur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
        />

        {/* Modal Command Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Entête barre de recherche */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <Search className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une section, une action, un projet..."
              className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none"
            />
            {query ? (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-xs">
                ESC
              </kbd>
            )}
          </div>

          {/* Liste des résultats */}
          <div className="max-h-[340px] overflow-y-auto p-2 space-y-1">
            {filteredActions.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Aucun résultat trouvé pour "{query}"
              </div>
            ) : (
              filteredActions.map((act) => {
                const IconComponent = act.icon;
                return (
                  <button
                    key={act.id}
                    onClick={act.action}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {act.label}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          {act.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {act.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                          {act.badge}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer de la palette */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Navigation Rapide Portfolio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Utilisez</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
                ⌘K
              </kbd>
              <span>pour ouvrir à tout moment</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
