'use client'

import { useEffect, useRef, useState} from 'react'
import { useTheme } from 'next-themes'
import { createTimeline} from 'animejs'
import clsx from 'clsx'

// SVG 路径数据保持不变
const EYE_PATHS = {
  openLeft: "M60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30Z",
  closedLeft: "M60 0.0002C60 16.5687 46.5685 30.0002 30 30.0002C13.4315 30.0002 0 16.5687 0 0.0002C0 0.0002 13.4315 5.5 30 5.5C46.5685 5.5 60 0.0002 60 0.0002Z",
  openRight: "M208 31C208 47.5685 194.569 61 178 61C161.431 61 148 47.5685 148 31C148 14.4315 161.431 1 178 1C194.569 1 208 14.4315 208 31Z",
  closedRight: "M208 1C208 17.5685 194.569 31 178 31C161.431 31 148 17.5685 148 1C148 1 161.431 9 178 9C194.569 9 208 1 208 1Z"
}

const MOUTH_PATHS = {
  open: "M77 60H130V73.5C130 88.1355 118.136 100 103.5 100C88.8645 100 77 88.1355 77 73.5V60Z",
  closed: "M77 30H130V30.3375C130 30.7034 118.136 31 103.5 31C88.8645 31 77 30.7034 77 30.3375V30Z"
}

export default function AnimatedThemeSwitch() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isAnimating = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = () => {
    if (!mounted ||isAnimating.current) return
    isAnimating.current = true
    const isDark = theme === 'dark';
    const newTheme = isDark ? 'light' : 'dark';

    const tl = createTimeline({
      easing: 'easeOutExpo',
      duration: 1050,
      onComplete: () => {
        isAnimating.current = false
        setTheme(newTheme)
      }
    });

    tl.add('.face',{
      translateX: isDark ? 0 : 40,
      rotate: isDark ? -360 : 360,
      backgroundColor: isDark ? 'rgb(243,255,148)':'rgb(110,240,225)' ,
    }, 0)
    .add('.switchBG',{
      backgroundColor: isDark ? 'rgb(255,117,165)':'rgb(91,56,115)',
    }, 0)
    .add('.eye-left',{
      d: !isDark ? EYE_PATHS.closedLeft : EYE_PATHS.openLeft,
    }, '-=1200')
    .add('.eye-right',{
      d: !isDark ? EYE_PATHS.closedRight : EYE_PATHS.openRight,
    }, '-=1210')
    .add('.mouth',{
      d: !isDark ? MOUTH_PATHS.closed : MOUTH_PATHS.open ,
    }, '-=1210');
    return () => tl.remove()
  };
  const bgClassName = clsx(
    'switchBG',
    'relative h-8 w-16 rounded-[100px]' ,
    'bg-[rgb(255,117,165)]' ,
    'dark:bg-[rgb(91,56,115)]' ,
    'transition-shadow duration-800',
    'shadow-onshadow' ,
    'dark:shadow-offshadow' ,
  );
  const faceClassName = clsx(
    'face' ,
    'absolute left-0 top-0 h-8 w-8 rounded-full' ,
    'bg-[rgb(243,255,148)]' ,
    'dark:bg-[rgb(110,240,225)]' ,
    'flex items-center justify-center cursor-pointer',
    'dark:translate-x-[40px] transition-transform duration-[1050ms]',
  );
  const pulseClassName = clsx(
    'face',
    'absolute left-0 top-0 h-8 w-8 rounded-full',
    'bg-gray-200',
    'dark:bg-gray-600',
    'dark:translate-x-[40px]',
    'animate-pulse'
  );
  return (
    <div
      className= {bgClassName}
    >
      {!mounted ? (
      <div className={pulseClassName} />
    ) : (
      <div
        className={faceClassName}
        onClick={handleThemeToggle}
        role="button"
        aria-label="Toggle theme"
      >
        <svg 
          viewBox="0 0 208 100"
          className="w-[70%] h-[70%]"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            className="mouth"
            d={mounted ? (resolvedTheme === 'dark' ? MOUTH_PATHS.closed : MOUTH_PATHS.open) : MOUTH_PATHS.open}
            fill="#E76060"
          />
          <path
            className="eye-left"
            d={mounted ? (resolvedTheme === 'dark' ? EYE_PATHS.closedLeft : EYE_PATHS.openLeft) : EYE_PATHS.openLeft}
            fill="#474747"
          />
          <path
            className="eye-right"
            d={mounted ? (resolvedTheme === 'dark' ? EYE_PATHS.closedRight : EYE_PATHS.openRight) : EYE_PATHS.openRight}
            fill="#474747"
          />
        </svg>
      </div>
    )}
    </div>
  )
}