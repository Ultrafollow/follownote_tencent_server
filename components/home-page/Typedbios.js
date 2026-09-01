'use client'

import { clsx } from 'clsx'
import { useEffect, useRef } from 'react'
import Typed from 'typed.js'
import Twemoji from '@/components/ui/Twemoji'

// 创建 Typed.js 实例的函数
function createTypedInstance(el) {
  return new Typed(el, {
    stringsElement: '#bios',     // 指定文本内容来源元素
    typeSpeed: 40,               // 打字速度（单位：毫秒）
    backSpeed: 10,               // 回退删除速度
    loop: true,                  // 启用无限循环
    backDelay: 1000              // 回退前的暂停时间
  })
}

export function TypedBios() {
  // 使用 ref 绑定 DOM 元素
  const el = useRef(null)
  // 存储 Typed 实例的 ref
  const typed = useRef(null)

  // 组件挂载/卸载时的生命周期管理
  useEffect(() => {
    if (el.current) {
      // 清理旧实例
      typed.current?.destroy()
      // 创建新实例
      typed.current = createTypedInstance(el.current)
    }
    // 组件卸载时销毁实例
    return () => typed.current?.destroy()
  }, []) // 空依赖数组表示只运行一次

  return (
    <div className={clsx(
      'flex min-h-8 items-center gap-0.5', // 基础布局
      [
        // 自定义光标样式
        '[&_.typed-cursor]:inline-block',   // 光标显示为行内块
        '[&_.typed-cursor]:w-2',            // 光标宽度 0.5rem (8px)
        '[&_.typed-cursor]:h-5.5',         // 光标高度 1.375rem (22px)
        '[&_.typed-cursor]:text-transparent', // 隐藏默认字符
        '[&_.typed-cursor]:bg-red-400',   // 亮色模式光标颜色
        'dark:[&_.typed-cursor]:bg-slate-100' // 暗色模式光标颜色
      ]
    )}>
      {/* 隐藏的文本源 */}
      <ul id="bios" className="hidden">
        <li>I am living in Zhuhai, Guangdong Province, China.</li>
        <li>I am a graduate student in Sun Yat-sen University.</li>
        <li>My major is resources and environment, but more geophysics.</li>
        <li>My hometown is Quanzhou, Fujian Province.</li>

        <li>
            I'm a basketball fan.
          <span className="ml-1">
            <Twemoji emoji="basketball" />
          </span>
        </li>
        <li>
            I'm a big fan of Kawhi Leonard and Stephen Curry.
          <span className="ml-1">
            <Twemoji emoji="five-hand" />
            <Twemoji emoji="chef" />
          </span>
        </li>
      </ul>
      
      {/* Typed.js 渲染的目标元素 */}
      <span 
        ref={el} 
        className="text-neutral-900 dark:text-neutral-200" 
      />
    </div>
  )
}