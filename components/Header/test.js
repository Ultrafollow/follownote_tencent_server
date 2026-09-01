'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { createTimeline } from 'animejs'

// ...保持 EYE_PATHS 和 MOUTH_PATHS 不变...

export default function AnimatedThemeSwitch() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Refs 保持不变...
  const faceRef = useRef(null)
  const switchBGRef = useRef(null)
  const eyeLeftRef = useRef(null)
  const eyeRightRef = useRef(null)
  const mouthRef = useRef(null)

  // 新增初始位置状态
  const [initialPosition, setInitialPosition] = useState(50)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // 新增：初始化位置和背景
    const isDark = resolvedTheme === 'dark'
    const targetX = isDark ? -1 : 50
    const bgColor = isDark ? 'rgb(91,56,115)' : 'rgb(255,117,165)'
    
    // 立即应用初始位置
    if (faceRef.current) {
      faceRef.current.style.transform = `translateX(${targetX}px) rotate(0deg)`
    }
    if (switchBGRef.current) {
      switchBGRef.current.style.backgroundColor = bgColor
    }

    // 更新 classList
    if (isDark) {
      switchBGRef.current?.classList.add('on-shadow')
      switchBGRef.current?.classList.remove('off-shadow')
    } else {
      switchBGRef.current?.classList.add('off-shadow')
      switchBGRef.current?.classList.remove('on-shadow')
    }
  }, [mounted, resolvedTheme])

  const handleThemeToggle = () => {
    const isDark = theme === 'dark'
    const newTheme = isDark ? 'light' : 'dark'
    
    // 创建动画时间轴
    const tl = createTimeline({
      easing: 'easeOutExpo',
      duration: 1050,
    })

    tl.add('.face', {
      translateX: isDark ? 50 : -1,  // 修正方向
      rotate: isDark ? 360 : -360,   // 修正旋转方向
      backgroundColor: isDark ? 'rgb(243,255,148)' : 'rgb(110,240,225)',
    }, '+=500')
    .add('switchBG', {
      backgroundColor: isDark ? 'rgb(255,117,165)' : 'rgb(91,56,115)',
    }, '-=500')  // 调整时间偏移
    .add('eye-left', {
      d: [{ value: isDark ? EYE_PATHS.openLeft : EYE_PATHS.closedLeft }],
    }, '-=800')
    .add('eye-right', {
      d: [{ value: isDark ? EYE_PATHS.openRight : EYE_PATHS.closedRight }],
    }, '-=800')
    .add('mouth', {
      d: [{ value: isDark ? MOUTH_PATHS.open : MOUTH_PATHS.closed }],
    }, '-=800')

    setTheme(newTheme)
  }

  return (
    <div 
      ref={switchBGRef}
      className="switchBG relative h-10 w-20 rounded-[100px] shadow-switch transition-all duration-300"
    >
      <div
        ref={faceRef}
        className="face absolute left-0 top-0 h-10 w-10 rounded-full bg-[#6ef0e1] flex items-center justify-center cursor-pointer transition-transform duration-300"
        onClick={handleThemeToggle}
        role="button"
        aria-label="Toggle theme"
      >
        {/* SVG 部分保持不变... */}
      </div>
    </div>
  )
}