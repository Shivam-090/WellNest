import { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function PetalCanvas() {
  const containerRef = useRef(null);
  const { petalBurstTrigger } = useTheme();

  // Background gentle falling petals
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const petals = ['🌸', '🌺', '🪷', '🌷'];
    const initialPetals = [];

    for (let i = 0; i < 18; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.textContent = petals[Math.floor(Math.random() * petals.length)];
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.fontSize = `${10 + Math.random() * 12}px`;
      petal.style.animationDuration = `${8 + Math.random() * 12}s`;
      petal.style.animationDelay = `${Math.random() * 10}s`;
      petal.style.opacity = `${0.25 + Math.random() * 0.35}`;
      container.appendChild(petal);
      initialPetals.push(petal);
    }

    return () => {
      initialPetals.forEach((p) => p.remove());
    };
  }, []);

  // Burst effect triggered on navigation / actions
  useEffect(() => {
    if (petalBurstTrigger === 0) return;
    const container = containerRef.current;
    if (!container) return;

    const petals = ['🌸', '🌺', '🪷', '🌷', '🌸', '✨'];
    const createdPetals = [];

    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      p.textContent = petals[Math.floor(Math.random() * petals.length)];
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = '-20px';
      p.style.fontSize = `${12 + Math.random() * 14}px`;
      p.style.animationDuration = `${2.5 + Math.random() * 2}s`;
      p.style.animationDelay = `${Math.random() * 0.5}s`;
      p.style.opacity = `${0.6 + Math.random() * 0.4}`;
      p.style.zIndex = '9999';
      container.appendChild(p);
      createdPetals.push(p);

      setTimeout(() => {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 4500);
    }
  }, [petalBurstTrigger]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
