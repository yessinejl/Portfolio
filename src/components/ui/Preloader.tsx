'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Bloquer le scroll pendant le préchargement
    document.body.style.overflow = 'hidden';

    const duration = 1800; // 1.8 secondes au total
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(100, Math.round((currentStep / steps) * 100));
      setProgress(currentProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = 'auto';
        }, 300);
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  const getStatusText = (p: number) => {
    if (p < 30) return "Initialisation de l'environnement...";
    if (p < 65) return "Chargement du profil & des projets...";
    if (p < 95) return "Optimisation des performances...";
    return "Bienvenue sur mon portfolio !";
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white select-none overflow-hidden"
        >
          {/* Effets de halo lumineux d'arrière-plan */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-indigo-500/20 rounded-full blur-[90px] pointer-events-none" />

          {/* Grille d'arrière-plan géométrique subtile */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-sm px-6 w-full text-center">
            
            {/* Logo / Monogramme avec anneau d'impulsion */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-2xl shadow-blue-500/20"
            >
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  YJ
                </span>
              </div>
              <span className="absolute -inset-1 rounded-2xl bg-blue-500/20 animate-ping pointer-events-none" />
            </motion.div>

            {/* Pourcentage géant avec effet dégradé futuriste */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-baseline justify-center gap-1 mb-2"
            >
              <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-mono">
                {progress}
              </span>
              <span className="text-2xl font-bold text-blue-500">%</span>
            </motion.div>

            {/* Texte de statut dynamique */}
            <motion.p 
              key={getStatusText(progress)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs sm:text-sm font-medium text-slate-400 h-6 mb-8 tracking-wide"
            >
              {getStatusText(progress)}
            </motion.p>

            {/* Barre de progression avec brillance animée */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 shadow-inner">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-full relative"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              >
                {/* Lueur blanche sur la tête de la barre */}
                <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[2px] opacity-80 rounded-full" />
              </motion.div>
            </div>

            {/* Titre & sous-titre minimaliste */}
            <div className="mt-8 text-slate-500 text-[11px] uppercase tracking-[0.25em] font-semibold">
              Yassine Jlassia • Portfolio
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
