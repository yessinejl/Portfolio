'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Project } from '@/types/project';
import { FaGithub } from 'react-icons/fa6';
import { ArrowRight, Code, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';

export default function Projects() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('Tous');

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        
        const projectsQuery = query(
          collection(db, 'projects'),
          orderBy('created_at', 'desc')
        );
        const querySnapshot = await getDocs(projectsQuery);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];

        setProjects(data);
        extractTags(data);
      } catch (err) {
        console.error('Erreur Firebase lors de la récupération des projets :', err);
        setProjects([]);
        setTags(['Tous']);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Extraire la liste unique des tags de tous les projets
  const extractTags = (projectsList: Project[]) => {
    const allTags = new Set<string>();
    projectsList.forEach((project) => {
      if (project.tags && Array.isArray(project.tags)) {
        project.tags.forEach((tag) => allTags.add(tag));
      }
    });
    setTags(['Tous', ...Array.from(allTags)]);
  };

  // Filtrer les projets lors du changement de tag
  useEffect(() => {
    if (selectedTag === 'Tous') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => project.tags && project.tags.includes(selectedTag))
      );
    }
  }, [selectedTag, projects]);

  return (
    <section id="projects" className="py-20 bg-transparent transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            {t('projects_title')}
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="h-1 w-20 bg-blue-600 dark:bg-blue-500 mx-auto mt-4 rounded-full origin-left"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 text-slate-600 dark:text-slate-400 text-lg"
          >
            {t('projects_subtitle')}
          </motion.p>
        </div>

        {/* Filtres par Technologie */}
        {!loading && tags.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {tags.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium border transition-colors duration-250 cursor-pointer ${
                    isActive
                      ? 'border-blue-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 border-slate-200/50 dark:border-slate-800'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }} // Évite les micro-sauts de rendu 3D
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-500/15"
                      style={{ originY: '0px', zIndex: -1 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tag === 'Tous' ? t('projects_all_tags') : tag}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Grille des projets */}
        {loading ? (
          // Affichage du Skeleton Loader
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div 
                key={n} 
                className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-48 bg-slate-200 dark:bg-slate-900 w-full" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-900 rounded-md w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-900 rounded-md w-full" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-900 rounded-md w-5/6" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 bg-slate-200 dark:bg-slate-900 rounded-full w-16" />
                    <div className="h-6 bg-slate-200 dark:bg-slate-900 rounded-full w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
            <Code className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-650 dark:text-slate-400 font-semibold mb-2">
              {t('projects_none')}
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              {t('projects_none_admin')}
            </p>
          </div>
        ) : (
          // Rendu des Cartes de Projets avec conteneur scroll reveal
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, type: "spring", stiffness: 70, damping: 15 }}
          >
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -6, scale: 1.015 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      layout: { duration: 0.3 }
                    }}
                    key={project.id}
                    className="group flex flex-col h-full rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md overflow-hidden hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative"
                  >
                    {/* Ligne d'accent supérieure dégradée épurée */}
                    <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity" />

                    {/* Corps de la carte épurée */}
                    <div className="flex flex-col flex-grow p-6">
                      
                      {/* En-tête : Icône + Badge Featured + Liens */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                            <Code className="w-4 h-4" />
                          </div>
                          {project.featured && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              Projet Phare
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1.5">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                              aria-label="Code source sur GitHub"
                            >
                              <FaGithub className="w-4 h-4" />
                            </a>
                          )}
                          {project.demo_url && (
                            <a
                              href={project.demo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                              aria-label="Démo live"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Titre & Description */}
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {project.description}
                      </p>

                      {/* Liste des tags sous forme de badges épurés */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/50 dark:border-slate-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Bouton d'action "En savoir plus" */}
                      <div className="pt-4 border-t border-slate-150 dark:border-slate-900 mt-auto">
                        <Link
                          href={`/projects/${project.id}`}
                          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
                        >
                          {t('projects_learn_more')}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                        </Link>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

      </div>
    </section>
  );
}
