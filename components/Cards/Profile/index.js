'use client' // Next.js 客户端组件标记
import { clsx } from 'clsx' // 类名合并工具
import React, { useCallback, useEffect, useRef, useState } from 'react' // React核心API
import { Image } from '@/components/ui/Image' // 自定义图片组件
// import { SpotifyNowPlaying } from '@/components/ui/now-playing' // 音乐播放组件
import { SITE_METADATA } from '@/data/site-metadata' // 站点配置数据
import { ProfileCardInfo } from './profile-info' // 个人信息子组件

export function ProfileCard() {
    // 使用 ref 获取卡片容器DOM
    const ref = useRef(null) 
    // 状态管理动态旋转样式
    const [style, setStyle] = useState({})
    
    // 定义鼠标移动处理（带性能优化）
    const onMouseMove = useCallback((e) => {
      // 仅在大屏设备生效
      if (!ref.current || window.innerWidth < 1280) return 
      
      // 获取鼠标坐标
      const { clientX, clientY } = e
      // 获取元素位置信息
      const { width, height, x, y } = ref.current.getBoundingClientRect()
      
      // 计算相对坐标
      const mouseX = clientX - x
      const mouseY = clientY - y
      
      // 动态计算旋转角度（-15°~15°）
      const rotate = {
        x: 15 - (mouseY / height) * 30, // 垂直旋转
        y: -15 + (mouseX / width) * 30  // 水平旋转
      }
      
      // 更新旋转样式
      setStyle({
        transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
      })
    }, []) // 空依赖数组表示只创建一次
  
    // 鼠标离开复位处理
    const onMouseLeave = useCallback(() => {
      setStyle({ transform: 'rotateX(0deg) rotateY(0deg)' })
    }, [])
  
    // 事件监听设置
    useEffect(() => {
      const currentRef = ref.current
      if (!currentRef) return
      
      // 添加事件监听
      currentRef.addEventListener('mousemove', onMouseMove)
      currentRef.addEventListener('mouseleave', onMouseLeave)
  
      // 清理函数（组件卸载时触发）
      return () => {
        currentRef.removeEventListener('mousemove', onMouseMove)
        currentRef.removeEventListener('mouseleave', onMouseLeave)
      }
    }, [onMouseMove, onMouseLeave]) // 依赖项确保最新回调
  
    // 渲染结构
    return (
      /* 外层容器：控制透视和悬停缩放 */
      <div 
        className="z-10 mb-8 scale-[200px] transition-all duration-200 ease-out hover:z-50 md:mb-0 md:hover:scale-[1.15]"
        style={{ perspective: '600px' }} // 创建3D透视空间
        ref={ref} // 绑定DOM引用
      >
        {/* 卡片主体：应用动态旋转 */}
        <div
          style={style} // 动态旋转样式
          className={clsx(
            'flex flex-col transition-all duration-200 ease-out md:rounded-lg', // 基础布局
            'bg-white shadow-demure dark:bg-dark dark:shadow-mondegreen', // 明暗主题背景
            'outline outline-1 outline-gray-100 dark:outline-gray-600' // 边框样式
          )}
        >
          {/* 站点LOGO图片 */}
          <Image
            src={SITE_METADATA.personalPicture}
            alt={SITE_METADATA.title}
            width={600} 
            height={350}
            style={{
              objectPosition: '50% 40%', // 图片焦点位置
              aspectRatio: '400/240'    // 固定宽高比
            }}
            loading="eager" // 优先加载
          />
          
          {/* 个人信息组件 */}
          <ProfileCardInfo />
          
          {/* 底部渐变装饰条 */}
          <span className="h-1.5 bg-gradient-to-r from-red-400 via-lime-500 to-purple-600" />
        </div>
      </div>
    )
  }