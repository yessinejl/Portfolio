'use client';

import React, { useRef, MouseEvent } from 'react';

export default function SpotlightWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full group/spotlight overflow-hidden"
    >
      {/* Halo lumineux principal (indigo) qui suit la souris */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-500 -z-30 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(99, 102, 241, 0.08), transparent 80%)`,
        }}
      />
      
      {/* Halo lumineux secondaire (bleu) qui suit la souris */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-500 -z-30 pointer-events-none"
        style={{
          background: `radial-gradient(350px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(59, 130, 246, 0.06), transparent 75%)`,
        }}
      />
      
      {children}
    </div>
  );
}
