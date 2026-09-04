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
  gradient: string;
  glow: string;
  borderGlow: string;
}

const statsData: StatItem[] = [
  {
    id: 'projects',
    icon: <FolderGit2 className="w-6 h-6" />,
    number: 5,
    suffix: '+',
    labelFr: 'Projets Complexes',
    labelEn: 'Complex Projects',
    labelAr: 'مشاريع معقدة',
    gradient: 'from-blue-500 to-blue-700',
    glow: 'rgba(59,130,246,0.35)',
    borderGlow: 'rgba(59,130,246,0.2)',
  },
  {
    id: 'technologies',
    icon: <Code2 className="w-6 h-6" />,
    number: 10,
    suffix: '+',
    labelFr: 'Technologies Maîtrisées',
    labelEn: 'Technologies Mastered',
    labelAr: 'تقنيات متقنة',
    gradient: 'from-indigo-500 to-violet-600',
    glow: 'rgba(99,102,241,0.35)',
    borderGlow: 'rgba(99,102,241,0.2)',
  },
  {
    id: 'quality',
    icon: <Sparkles className="w-6 h-6" />,
    number: 100,
    suffix: '%',
    labelFr: 'Code Propre & Structuré',
    labelEn: 'Clean & Structured Code',
    labelAr: 'كود نظيف ومنظم',
    gradient: 'from-purple-500 to-pink-600',
    glow: 'rgba(168,85,247,0.35)',
    borderGlow: 'rgba(168,85,247,0.2)',
  },
  {
    id: 'languages',
    icon: <Languages className="w-6 h-6" />,
    number: 3,
    suffix: '',
    labelFr: 'Langues Maîtrisées',
    labelEn: 'Languages Spoken',
    labelAr: 'لغات متقنة',
    gradient: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.35)',
    borderGlow: 'rgba(16,185,129,0.2)',
  },
];

function AnimatedCounter({
  value,
  duration = 2.0,
}: {
  value: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

function StatCard({ item, index }: { item: StatItem; index: number }) {
  const { language } = useLanguage();
  const [hovered, setHovered] = useState(false);

  const getLabel = () => {
    if (language === 'en') return item.labelEn;
    if (language === 'ar') return item.labelAr;
    return item.labelFr;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.55,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl cursor-default overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? item.borderGlow : 'rgba(148,163,184,0.12)'}`,
        boxShadow: hovered
          ? `0 0 35px ${item.glow}, 0 8px 30px rgba(0,0,0,0.08)`
          : '0 2px 12px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
      }}
    >
      {/* Background glow blob */}
      <motion.div
        animate={{ opacity: hovered ? 0.18 : 0 }}
        transition={{ duration: 0.35 }}
        className={`absolute inset-0 bg-gradient-to-br ${item.gradient} blur-2xl rounded-2xl`}
      />

      {/* Top shimmer line */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.gradient} origin-left rounded-t-2xl`}
      />

      {/* Icon */}
      <motion.div
        animate={{ scale: hovered ? 1.12 : 1, rotate: hovered ? 8 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`relative z-10 mb-4 p-3.5 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}
        style={{ boxShadow: `0 6px 20px ${item.glow}` }}
      >
        {item.icon}
      </motion.div>

      {/* Number */}
      <div className="relative z-10 flex items-baseline gap-0.5 mb-1.5">
        <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
          {item.prefix}
          <AnimatedCounter value={item.number} duration={1.8 + index * 0.15} />
        </span>
        <span
          className={`text-3xl sm:text-4xl font-black bg-gradient-to-br ${item.gradient} bg-clip-text text-transparent`}
        >
          {item.suffix}
        </span>
      </div>

      {/* Label */}
      <p className="relative z-10 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 leading-snug max-w-[120px]">
        {getLabel()}
      </p>
    </motion.div>
  );
}

export default function StatsBanner() {
  return (
    <section
      id="stats"
      className="relative py-8 sm:py-10 bg-transparent transition-colors duration-300 z-10"
    >
      {/* Decorative top separator */}
      <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none">
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glass container */}
        <div
          className="relative rounded-3xl p-1"
          style={{
            background:
              'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.04) 50%, rgba(59,130,246,0.08) 100%)',
            border: '1px solid rgba(148,163,184,0.12)',
          }}
        >
          {/* Inner content */}
          <div
            className="rounded-[1.4rem] px-4 sm:px-8 py-6 backdrop-blur-2xl bg-white/55 dark:bg-slate-950/60"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {statsData.map((item, index) => (
                <StatCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom separator */}
      <div className="absolute bottom-0 inset-x-0 flex justify-center pointer-events-none">
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-indigo-400/30 to-transparent" />
      </div>
    </section>
  );
}
