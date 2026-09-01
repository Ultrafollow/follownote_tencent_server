// components/Header/LogoTitle.js
'use client'
import { clsx } from 'clsx'
import { TITLE_PATH } from '@/components/ui/SvgPath'
import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

const rnd = (m, n) => Math.floor(Math.random() * (n - m + 1)) + m;

export const LogoTitle = ({ className }) => {
  const { theme,resolvedTheme } = useTheme()
  const svgRef = useRef(null);
  const particlesRef = useRef([]);

  const generateFire = () => {
    const container = svgRef.current.parentElement;
    const firecount = (container.offsetWidth / 50) * 8;
    
    // 先清除已有粒子
    particlesRef.current.forEach(p => p.remove());
    particlesRef.current = [];

    for (let i = 0; i <= firecount; i++) {
      const size = rnd(8, 12);
      const particle = document.createElement('span');
      particle.className = 'particle-fire absolute animate-fire z-10';
      particle.style.cssText = `
        top: ${rnd(40, 70)}%;
        left: ${rnd(0, 100)}%;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${rnd(0, 20) / 10}s;
        background-color: ${resolvedTheme === 'dark' ? 'rgba(59,130,246,0.6)' : 'rgba(255,193,7,0.6)'};
      `;
      container.appendChild(particle);
      particlesRef.current.push(particle);
    }
  };

  const clearFire = () => {
    particlesRef.current.forEach(p => p.remove());
    particlesRef.current = [];
  };

  useEffect(() => {
    const container = svgRef.current?.parentElement;
    if (!container) return;

    const handleMouseEnter = () => generateFire();
    const handleMouseLeave = () => clearFire();

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      clearFire(); // 组件卸载时清理
    };
  }, [resolvedTheme]);

  return (
    <div className='relative h-10 w-40' ref={svgRef}>
      <svg 
        viewBox="300 9000 22000 1000" 
        className={clsx('h-full w-full', className)}
        >
        <g fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="50">
          <path 
            stroke="transparent" 
            fill='transparent' 
            className='line' 
            d={TITLE_PATH} 
          />
        </g>
      </svg>
    </div>
  )
}