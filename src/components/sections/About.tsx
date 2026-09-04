'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '@/context/ProfileContext';
import { useLanguage } from '@/context/LanguageContext';

export default function About() {
  const { profile } = useProfile();
  const { t } = useLanguage();

  if (!profile || (!profile.about && !profile.photoUrl)) {
    return null;
  }

  return (
    <section id="about" className="py-24 bg-transparent transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          
          {/* Photo */}
          {profile.photoUrl && (
            <motion.div
              initial={{ opacity: 0, x: -60, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                type: "spring",
                stiffness: 70,
                damping: 15,
                duration: 0.7 
              }}
              className="w-full md:w-5/12 flex justify-center"
            >
              <div className="relative">
                {/* Décoration d'arrière-plan */}
                <div className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded-[3rem] transform rotate-6 scale-105 opacity-20 blur-lg"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[2rem] transform -rotate-3 scale-105 opacity-50"></div>
                
                <img
                  src={profile.photoUrl}
                  alt={profile.name || "Photo de profil"}
                  className="relative z-10 w-64 h-64 md:w-80 md:h-80 object-cover rounded-[2rem] border-4 border-white dark:border-slate-800 shadow-xl"
                />
              </div>
            </motion.div>
          )}

          {/* Text */}
          {profile.about && (
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                type: "spring",
                stiffness: 70,
                damping: 15,
                duration: 0.7,
                delay: 0.15 
              }}
              className="w-full md:w-7/12 text-center md:text-left rtl:md:text-right"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                {t('about_title')}
              </h2>
              <div className="h-1 w-20 bg-blue-600 dark:bg-blue-500 rounded-full mb-8 mx-auto md:mx-0 rtl:md:mr-0 rtl:md:ml-auto"></div>
              
              <div className="text-lg text-slate-655 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {profile.about}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}
