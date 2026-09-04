'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/context/ProfileContext';
import { useLanguage } from '@/context/LanguageContext';
import { FaGithub, FaLinkedin, FaFileArrowDown, FaReact, FaNodeJs } from 'react-icons/fa6';
import { ArrowRight, Mail } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';

export default function Hero() {
  const { profile } = useProfile();
  const { t, language } = useLanguage();

  // Définition des variantes d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 15,
      },
    },
  } as const;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8 bg-transparent transition-colors duration-300">
      
      {/* Motif de grille géométrique en arrière-plan */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.02)_1px,transparent_1px)] -z-20 pointer-events-none"
        style={{ 
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)', 
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)' 
        }}
      />

      {/* Effets lumineux décoratifs de fond - Orbes animées dérivantes */}
      <motion.div 
        animate={{ 
          x: [0, 40, -30, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.15, 0.9, 1]
        }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] bg-blue-500/15 dark:bg-blue-600/10 blur-[80px] sm:blur-[120px] rounded-full -z-10 pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          x: [0, -50, 40, 0],
          y: [0, 40, -50, 0],
          scale: [1, 0.85, 1.1, 1]
        }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-indigo-500/15 dark:bg-indigo-600/10 blur-[100px] sm:blur-[150px] rounded-full -z-10 pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          x: [0, 30, -30, 0],
          y: [0, 30, -30, 0],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 right-1/3 w-[200px] h-[200px] bg-purple-500/10 dark:bg-purple-600/5 blur-[90px] rounded-full -z-10 pointer-events-none" 
      />

      {/* Formes géométriques filaires flottantes et rotatives */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
        <motion.div 
          animate={{ y: [0, -30, 0], rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-1/4 left-[8%] w-8 h-8 rounded-lg border border-blue-500/20 dark:border-blue-400/10"
        />
        <motion.div 
          animate={{ y: [0, 40, 0], rotate: [360, 0] }}
          transition={{ repeat: Infinity, duration: 16, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-1/4 right-[10%] w-12 h-12 rounded-full border border-purple-500/20 dark:border-purple-400/10"
        />
        <motion.div 
          animate={{ y: [0, -25, 0], rotate: [0, -360] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 0.2 }}
          className="absolute top-1/3 right-[20%] w-6 h-6 border-t-2 border-l-2 border-indigo-500/20 dark:border-indigo-400/10 transform rotate-45"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], x: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut", delay: 0.8 }}
          className="absolute bottom-1/3 left-[15%] w-5 h-5 rounded-full bg-blue-500/10 dark:bg-blue-400/5"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
      >
        {/* Colonne Gauche : Contenu Texte */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left rtl:lg:text-right space-y-6 sm:space-y-8">
          
          {/* Badge Intro */}
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200/50 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-medium"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t('hero_availability')}
          </motion.div>

          {/* Titre principal */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 dark:text-white"
          >
            {t('hero_hello')}{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              {profile?.name || 'Yassine Jlassia'}
            </span>
          </motion.h1>

          {/* Animation Pro - TypeAnimation */}
          <motion.div 
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-350 h-10 sm:h-12 flex items-center justify-center lg:justify-start rtl:lg:justify-end"
          >
            <TypeAnimation
              key={language}
              sequence={[
                profile?.title || t('hero_title_dev'),
                2000,
                t('hero_title_creator'),
                2000,
                t('hero_title_enthusiast'),
                2000,
                t('hero_title_problem'),
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-200 dark:to-white bg-clip-text text-transparent"
            />
          </motion.div>

          {/* Sous-titre descriptif */}
          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed mt-2"
          >
            {t('hero_description')}
          </motion.p>

          {/* Boutons d'action (CTA) */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto"
          >
            <a
              href="#projects"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {t('hero_projects_cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </a>
            <a
              href={profile?.cvUrl || "/cv.pdf"}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/60 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-250 font-semibold hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200"
            >
              {t('hero_cv_cta')}
              <FaFileArrowDown className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
            </a>
          </motion.div>

          {/* Liens réseaux sociaux */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-5 pt-4"
          >
            <a
              href={profile?.github_url || "https://github.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-900/50 shadow-sm transition-all duration-200"
              aria-label="GitHub"
            >
              <FaGithub className="w-5.5 h-5.5" />
            </a>
            <a
              href={profile?.linkedin_url || "https://linkedin.com/in/Yassinejlassia"}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-900/50 shadow-sm transition-all duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5.5 h-5.5" />
            </a>
            <a
              href={profile?.email ? `mailto:${profile.email}` : "mailto:yacinejlassia@gmail.com"}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-900/50 shadow-sm transition-all duration-200"
              aria-label="Email"
            >
              <Mail className="w-5.5 h-5.5" />
            </a>
          </motion.div>

        </div>

        {/* Colonne Droite : Photo de profil interactive et Badges flottants */}
        <div className="lg:col-span-5 flex justify-center items-center relative py-12 lg:py-0 w-full">
          {profile?.photoUrl && (
            <motion.div
              variants={itemVariants}
              className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96"
            >
              {/* Halos lumineux d'arrière-plan de la photo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-650 rounded-[2.5rem] transform rotate-6 scale-105 opacity-20 blur-xl animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[2rem] transform -rotate-3 scale-102 opacity-40 dark:opacity-30"></div>
              
              {/* Cadre de la photo avec bordure organique asymétrique et effet premium */}
              <div className="relative w-full h-full overflow-hidden rounded-[2.5rem_1.5rem_4rem_2rem] border-4 border-white dark:border-slate-850 shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={profile.photoUrl}
                  alt={profile.name || "Yassine Jlassia"}
                  className="w-full h-full object-cover"
                />
              </div>

            </motion.div>
          )}
        </div>

      </motion.div>
    </section>
  );
}
