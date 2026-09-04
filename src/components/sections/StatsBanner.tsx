'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FolderGit2, Code2, Sparkles, Languages } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface StatItem {
  id: string;
  icon: React.ReactNode;
  number: number;
  suffix: string;
  prefix?: string;
  labelFr: string;
  labelEn: string;
  labelAr: string;
}

const statsData: StatItem[] = [
  {
    id: 'projects',
    icon: <FolderGit2 className="w-6 h-6 text-blue-500" />,
    number: 5,
    suffix: '+',
    labelFr: 'Projets Majeurs Réalisés',
    labelEn: 'Major Projects Delivered',
    labelAr: 'مشاريع رئيسية مكتملة',
  },
  {
    id: 'technologies',
    icon: <Code2 className="w-6 h-6 text-indigo-500" />,
    number: 10,
    suffix: '+',
    labelFr: 'Technologies & Frameworks',
    labelEn: 'Technologies & Frameworks',
    labelAr: 'تقنيات وأطر عمل',
  },
  {
    id: 'quality',
    icon: <Sparkles className="w-6 h-6 text-purple-500" />,
    number: 100,
    suffix: '%',
    labelFr: 'Code Propre & Architecture',
    labelEn: 'Clean Architecture & Code',
    labelAr: 'كود نظيف وبنية متطورة',
  },
  {
    id: 'languages',
    icon: <Languages className="w-6 h-6 text-emerald-500" />,
    number: 3,
    suffix: '',
    labelFr: 'Langues (FR, EN, AR)',
    labelEn: 'Languages (FR, EN, AR)',
    labelAr: 'لغات (فرنسية، إنجليزية، عربية)',
  },
];

function AnimatedCounter({ value, duration = 1.8 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const steps = 40;
    const increment = value / steps;
    const stepTime = (duration * 1000) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function StatsBanner() {
  const { language } = useLanguage();

  const getLabel = (item: StatItem) => {
    if (language === 'en') return item.labelEn;
    if (language === 'ar') return item.labelAr;
    return item.labelFr;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.12,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  } as const;

  return (
    <section className="py-10 bg-transparent transition-colors duration-300 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-blue-500/5"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x dark:divide-slate-800/80 divide-slate-200/80 rtl:divide-x-reverse">
            {statsData.map((item, index) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`flex flex-col items-center text-center group ${
                  index !== 0 ? 'pt-6 sm:pt-0 sm:px-4' : 'sm:pr-4'
                }`}
              >
                {/* Icône avec effet de halo au survol */}
                <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/50 mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm">
                  {item.icon}
                </div>

                {/* Valeur numérique animée */}
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono flex items-center justify-center">
                  {item.prefix}
                  <AnimatedCounter value={item.number} />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    {item.suffix}
                  </span>
                </div>

                {/* Libellé */}
                <p className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 tracking-wide">
                  {getLabel(item)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
