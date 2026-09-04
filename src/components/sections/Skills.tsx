'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaReact, 
  FaNodeJs, 
  FaDocker, 
  FaGitAlt, 
  FaFigma 
} from 'react-icons/fa6';
import { Code2, Laptop, Wrench, Lightbulb, Server, Database } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { SkillCategory } from '@/types/skill';
import { useLanguage } from '@/context/LanguageContext';

const ICON_MAP: Record<string, React.ReactNode> = {
  Code2: <Code2 className="w-6 h-6 text-blue-500" />,
  Laptop: <Laptop className="w-6 h-6 text-indigo-500" />,
  Wrench: <Wrench className="w-6 h-6 text-purple-500" />,
  Lightbulb: <Lightbulb className="w-6 h-6 text-pink-500" />,
  Server: <Server className="w-6 h-6 text-green-500" />,
  Database: <Database className="w-6 h-6 text-orange-500" />
};

const DEFAULT_SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Backend",
    iconName: "Server",
    skills: [
      { name: "Java / Spring Boot", level: "Expert" },
      { name: "Python (Django / FastAPI / Flask)", level: "Avancé" },
      { name: "PHP / Symfony 6", level: "Avancé" }
    ]
  },
  {
    title: "Frontend & Mobile",
    iconName: "Laptop",
    skills: [
      { name: "React.js / React Native", level: "Expert" },
      { name: "Angular 16", level: "Avancé" },
      { name: "Flutter", level: "Avancé" },
      { name: "HTML5 / CSS3 / JavaScript / TypeScript", level: "Expert" }
    ]
  },
  {
    title: "Bases de Données & IA",
    iconName: "Database",
    skills: [
      { name: "MySQL / PostgreSQL", level: "Expert" },
      { name: "SQL Server", level: "Avancé" },
      { name: "Scikit-learn / Machine Learning", level: "Intermédiaire" }
    ]
  },
  {
    title: "Outils & Méthodologies",
    iconName: "Wrench",
    skills: [
      { name: "Git / GitHub", level: "Expert" },
      { name: "API REST / JWT + OAuth2", level: "Expert" },
      { name: "Postman / Stripe API", level: "Avancé" },
      { name: "Agilité / Résolution de problèmes", level: "Expert" }
    ]
  }
];

export default function Skills() {
  const { t } = useLanguage();
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>(DEFAULT_SKILL_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const docRef = doc(db, 'settings', 'skills');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().categories?.length) {
          setSkillCategories(docSnap.data().categories);
        }
      } catch (error) {
        console.error('Erreur chargement compétences:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
  } as const;

  return (
    <section id="skills" className="py-20 bg-transparent transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
          >
            {t('skills_title')}
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
            {t('skills_subtitle')}
          </motion.p>
        </div>

        {/* Grille de compétences */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 15 } }}
              className="group p-6 sm:p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700/80 transition-all duration-300"
            >
              {/* En-tête de la carte */}
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  {ICON_MAP[category.iconName] || <Code2 className="w-6 h-6 text-blue-500" />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {category.title}
                </h3>
              </div>

              {/* Liste des compétences */}
              <div className="space-y-4">
                {category.skills.map((skill, sIndex) => {
                  const getSkillLevelTranslation = (lvl: string) => {
                    const l = lvl.toLowerCase();
                    if (l === 'expert' || l === 'خبير') return t('skills_expert');
                    if (l === 'avancé' || l === 'advanced' || l === 'متقدم') return t('skills_advanced');
                    return t('skills_intermediate');
                  };
                  
                  return (
                    <div key={sIndex} className="space-y-2">
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-slate-700 dark:text-slate-350">{skill.name}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/30 dark:border-slate-800">
                          {getSkillLevelTranslation(skill.level)}
                        </span>
                      </div>
                      {/* Barre de niveau factice mais stylisée */}
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ 
                            width: skill.level === 'Expert' || skill.level === 'خبير' ? '95%' : skill.level === 'Avancé' || skill.level === 'Advanced' || skill.level === 'متقدم' ? '80%' : '60%' 
                          }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Logos technologiques flottants decoratifs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.45, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-16 dark:opacity-20 select-none pointer-events-none"
        >
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
            <FaReact className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 dark:text-blue-400" />
          </motion.div>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.2 }}>
            <FaNodeJs className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 dark:text-green-400" />
          </motion.div>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.4 }}>
            <FaDocker className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-500" />
          </motion.div>
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut", delay: 0.1 }}>
            <FaGitAlt className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500 dark:text-orange-400" />
          </motion.div>
          <motion.div animate={{ y: [0, -9, 0] }} transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.3 }}>
            <FaFigma className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500 dark:text-pink-400" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
