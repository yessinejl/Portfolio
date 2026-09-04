'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Code2, Layers, Award, Zap } from 'lucide-react';

interface StatItem {
  value: number;
  suffix: string;
  labelKey: 'stats_projects' | 'stats_technologies' | 'stats_code_quality' | 'stats_experience';
  icon: React.ReactNode;
  color: string;
  glowColor: string;
}

function useCountUp(target: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime: number | null = null;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startValue + (target - startValue) * eased));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(step);
  }, [target, duration, startCounting]);

  return count;
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useCountUp(stat.value, 1800 + index * 200, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="relative group flex flex-col items-center justify-center px-6 py-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/40 bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm hover:border-blue-300/60 dark:hover:border-blue-700/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        boxShadow: isInView ? `0 0 0 0 ${stat.glowColor}` : 'none',
      }}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at center, ${stat.glowColor}15 0%, transparent 70%)` }}
      />

      {/* Icon */}
      <div
        className={`mb-3 p-2.5 rounded-xl ${stat.color} transition-transform duration-300 group-hover:scale-110`}
      >
        {stat.icon}
      </div>

      {/* Animated Number */}
      <div className="flex items-baseline gap-0.5">
        <span className="text-3xl sm:text-4xl font-extrabold tabular-nums bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          {count}
        </span>
        <span className="text-2xl sm:text-3xl font-extrabold text-blue-500 dark:text-blue-400">
          {stat.suffix}
        </span>
      </div>

      {/* Label */}
      <p className="mt-1.5 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 text-center leading-tight">
        {t(stat.labelKey)}
      </p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-3/4 rounded-full transition-all duration-500"
        style={{ background: `linear-gradient(to right, transparent, ${stat.glowColor}, transparent)` }}
      />
    </motion.div>
  );
}

export default function StatsCounter() {
  const stats: StatItem[] = [
    {
      value: 5,
      suffix: '+',
      labelKey: 'stats_projects',
      icon: <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      color: 'bg-blue-50 dark:bg-blue-900/30',
      glowColor: '#3b82f6',
    },
    {
      value: 8,
      suffix: '+',
      labelKey: 'stats_technologies',
      icon: <Code2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      color: 'bg-indigo-50 dark:bg-indigo-900/30',
      glowColor: '#6366f1',
    },
    {
      value: 100,
      suffix: '%',
      labelKey: 'stats_code_quality',
      icon: <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      color: 'bg-purple-50 dark:bg-purple-900/30',
      glowColor: '#a855f7',
    },
    {
      value: 2,
      suffix: '+',
      labelKey: 'stats_experience',
      icon: <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      color: 'bg-cyan-50 dark:bg-cyan-900/30',
      glowColor: '#06b6d4',
    },
  ];

  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Subtle separator line above */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.labelKey} stat={stat} index={index} />
        ))}
      </div>
    </section>
  );
}
