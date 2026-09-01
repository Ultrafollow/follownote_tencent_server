// 导入必要模块
'use client'
import { clsx } from 'clsx'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ReactMediumImageZoom from 'react-medium-image-zoom'

// 全局缓存已加载图片路径
let loadedImages = []

// 自定义 Hook 跟踪图片加载状态
function useImageLoadedState(src) {
  const pathname = usePathname()
  const uniqueImagePath = pathname + '__' + src
  const [loaded, setLoaded] = useState(loadedImages.includes(uniqueImagePath))
  
  return [
    loaded,
    () => {
      if (!loaded) {
        loadedImages.push(uniqueImagePath)
        setLoaded(true)
      }
    }
  ]
}

// 图片组件定义
export function Image(props) {
  const { alt, src, loading = 'lazy', style, className, ...rest } = props
  const [loaded, onLoad] = useImageLoadedState(src)

  return (
    <div className={clsx(
      'image-container relative overflow-hidden',
      !loaded && 'animate-pulse [animation-duration:4s]',
      className
    )}>
      <NextImage
        className={clsx(
          'transition-all duration-500 [transition-timing-function:cubic-bezier(.4,0,.2,1)]',
          'h-full max-h-full w-full object-center',
          loaded ? 'blur-0' : 'blur-xl'
        )}
        src={src}
        alt={alt}
        style={{ objectFit: 'cover', ...style }}
        loading={loading}
        priority={loading === 'eager'}
        quality={100}
        onLoad={onLoad}
        {...rest}
      />
    </div>
  )
}

// 图片缩放组件
export function Zoom(props) {
  const { children, classDialog, ...rest } = props
  return (
    <ReactMediumImageZoom
      zoomMargin={20}
      classDialog={clsx([
        '[&_[data-rmiz-modal-img]]:rounded-lg',
        '[&_[data-rmiz-btn-unzoom]]:hidden',
        '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80',
        classDialog
      ])}
      {...rest}
    >
      {children}
    </ReactMediumImageZoom>
  )
}