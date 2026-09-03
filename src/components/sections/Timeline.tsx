'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { TimelineItem } from '@/types/timeline';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Timeline() {
  const { t } = useLanguage();
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const docRef = doc(db, 'settings', 'timeline');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setItems(docSnap.data().items || []);
        }
      } catch (error) {
        console.error('Erreur chargement timeline:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  if (loading || items.length === 0) return null;

  const getOrgName = (org: string) => {
    if (org === 'Projet Académique' || org.toLowerCase() === 'academic project') {
      return t('timeline_academic');
    }
    return org;
  };

  const getPeriodText = (period: string) => {
    return period.replace(/Présent|Present/gi, t('timeline_present'));
  };

  return (
    <section id="experience" className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            {t('timeline_title')}
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="h-1 w-20 bg-blue-600 dark:bg-blue-500 mx-auto mt-4 rounded-full origin-left"
          />
        </div>

        <div className="relative ml-4 md:ml-8 rtl:ml-0 rtl:mr-4 rtl:md:mr-8 mt-8">
          {/* Ligne verticale de la timeline animée sur scroll */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute left-0 rtl:left-auto rtl:right-0 top-0 w-0.5 bg-gradient-to-b from-blue-600 via-indigo-500 to-slate-200 dark:to-slate-850 origin-top"
          />

          <div className="space-y-12">
            {items.map((item, index) => {
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ 
                    type: "spring",
                    stiffness: 80,
                    damping: 15,
                    duration: 0.6,
                    delay: Math.min(index * 0.1, 0.4) 
                  }}
                  className="relative pl-8 md:pl-12 rtl:pl-0 rtl:pr-8 rtl:md:pl-0 rtl:md:pr-12 group"
                >
                  {/* Point central avec icône */}
                  <div className="absolute -left-[21px] rtl:-left-auto rtl:-right-[21px] top-0 w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center z-10 shadow-sm bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    {item.type === 'experience' ? <Briefcase className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                  </div>

                  {/* Contenu de la carte */}
                  <div className="w-full">
                    <div className="p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 hover:-translate-y-1 transition-all duration-300">
                      
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                        {item.organization && (
                          <span className="flex items-center gap-1.5 text-slate-800 dark:text-white font-bold text-sm px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
                            {item.type === 'experience' ? <Briefcase className="w-4 h-4 text-blue-500" /> : <GraduationCap className="w-4 h-4 text-purple-500" />}
                            {getOrgName(item.organization)}
                          </span>
                        )}
                        {/* Période */}
                        <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-md">
                          <Calendar className="w-3.5 h-3.5" />
                          {getPeriodText(item.period)}
                        </span>
                      </div>

                      {item.description && (
                        <div className="text-slate-650 dark:text-slate-400 text-sm whitespace-pre-wrap leading-relaxed mb-4">
                          {item.description}
                        </div>
                      )}

                      {item.technologies && (
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                          {item.technologies.split(',').map((tech, idx) => {
                            if (!tech.trim()) return null;
                            return (
                              <span key={idx} className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                                {tech.trim()}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
