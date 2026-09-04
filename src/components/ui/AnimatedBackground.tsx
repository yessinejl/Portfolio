'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Couleurs vives pour l'effet NÉON / VIBRANT
    const colors = [
      { r: 99, g: 102, b: 241 },  // Indigo (#6366f1)
      { r: 59, g: 130, b: 246 },  // Bleu (#3b82f6)
      { r: 168, g: 85, b: 247 },  // Violet (#a855f7)
      { r: 14, g: 165, b: 233 },  // Cyan (#0ea5e9)
      { r: 236, g: 72, b: 153 },  // Rose néon (#ec4899)
    ];

    // Initialisation des particules dynamiques
    const particleCount = Math.min(Math.floor(width / 18), 85);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: { r: number; g: number; b: number };
      pulseSpeed: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.5 + 1.2,
        alpha: Math.random() * 0.6 + 0.3,
        color,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    // Position de la souris
    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    // Boucle d'animation
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      // Dessin des particules et des liaisons néon
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Déplacement
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Rebondissement doux sur les bords
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Effet d'attraction/répulsion fluide au passage du curseur
        const dxMouse = p1.x - mouse.x;
        const dyMouse = p1.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < 180) {
          const angle = Math.atan2(dyMouse, dxMouse);
          const force = (180 - distMouse) / 180;
          p1.x += Math.cos(angle) * force * 2.2;
          p1.y += Math.sin(angle) * force * 2.2;

          // Dessiner une ligne néon brillante entre la souris et la particule
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p1.x, p1.y);
          const lineMouseAlpha = (1 - distMouse / 180) * 0.45;
          ctx.strokeStyle = `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${lineMouseAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Variation d'opacité en pulsation
        const pulsedAlpha = p1.alpha + Math.sin(time + i) * 0.15;
        const currentAlpha = Math.max(0.1, Math.min(1, pulsedAlpha));

        // Dessiner la particule néon
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${currentAlpha})`;
        ctx.fill();

        // Halo lumineux autour des grosses particules
        if (p1.radius > 2.5) {
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, p1.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${currentAlpha * 0.15})`;
          ctx.fill();
        }

        // Liaisons entre particules proches
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 150) * 0.25;
            ctx.strokeStyle = `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Canvas Particules & Toile Néon */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-70 dark:opacity-60 transition-opacity duration-500"
      />

      {/* Orbe Flottant 1 - Bleu Néon (Haut Gauche) */}
      <motion.div
        animate={{
          x: [0, 100, -70, 0],
          y: [0, -110, 80, 0],
          scale: [1, 1.3, 0.85, 1],
          rotate: [0, 120, 240, 360],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[5%] left-[8%] w-[480px] h-[480px] rounded-full bg-gradient-to-br from-blue-600/25 via-indigo-600/20 to-cyan-500/15 blur-[100px] dark:blur-[120px]"
      />

      {/* Orbe Flottant 2 - Violet / Magenta (Milieu Droit) */}
      <motion.div
        animate={{
          x: [0, -110, 90, 0],
          y: [0, 90, -100, 0],
          scale: [1, 0.8, 1.25, 1],
          rotate: [360, 240, 120, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.5,
        }}
        className="absolute top-[35%] right-[3%] w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-purple-600/25 via-pink-600/20 to-indigo-600/15 blur-[120px] dark:blur-[140px]"
      />

      {/* Orbe Flottant 3 - Cyan / Émeraude Néon (Bas Gauche) */}
      <motion.div
        animate={{
          x: [0, 80, -60, 0],
          y: [0, 70, -60, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
        className="absolute bottom-[10%] left-[20%] w-[460px] h-[460px] rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-teal-400/15 blur-[110px] dark:blur-[130px]"
      />

      {/* Orbe Flottant 4 - Rose Néon Vibrant (Centre) */}
      <motion.div
        animate={{
          x: [0, -60, 50, 0],
          y: [0, -50, 70, 0],
          scale: [0.9, 1.15, 1, 0.9],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4.5,
        }}
        className="absolute top-[60%] right-[30%] w-[350px] h-[350px] rounded-full bg-pink-500/15 dark:bg-pink-600/20 blur-[90px]"
      />

      {/* Formes Géométriques Filigranes Flottantes et Rotatives */}
      <motion.div
        animate={{
          rotate: [0, 360],
          y: [0, -40, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/3 left-1/4 w-32 h-32 border border-indigo-500/15 dark:border-indigo-400/15 rounded-3xl transform rotate-12 pointer-events-none"
      />

      <motion.div
        animate={{
          rotate: [360, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-1/3 right-1/4 w-40 h-40 border border-purple-500/15 dark:border-purple-400/15 rounded-full pointer-events-none"
      />
    </div>
  );
}
