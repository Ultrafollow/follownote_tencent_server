'use client'
import { clsx } from 'clsx'
import { Image } from '@/components/ui/Image'
import { Link } from '@/components/ui/Link'
import { SITE_METADATA } from '@/data/site-metadata'
import { GrowingUnderline } from '@/components/ui/Growing-underline'
import { createTimeline, animate, createScope, createSpring, createDraggable, svg} from 'animejs';
import { useEffect, useRef, useState } from 'react'
import { TITLE_PATH } from '@/components/ui/SvgPath'
import {LogoTitle} from '@/components/Header/LogoTitle'


export function Logo(className) {
  const root = useRef(null)
  const scope = useRef(null)
  useEffect(() => {
  
    scope.current = createScope({ root }).add( self => {
      const Logobounce = animate('.logo', {
        scale: [
          { to: 1.25, ease: 'inOut(3)', duration: 200 },
          { to: 1, ease: createSpring({ stiffness: 300 }) }
        ],
        loop: true,
        loopDelay: 250,
      });
      // Make the logo draggable around its center
      createDraggable('.logo', {
        container: [0, 0, 0, 0],
        releaseEase: createSpring({ stiffness: 200 })
      });
      const Svgpath = animate(svg.createDrawable('.line'), {
        draw: ['0 0', '0 1'],
        stroke:"currentColor" ,
        ease: 'inOutQuad',
        duration: 3000,
        loop: false,
      });
      const t1 = createTimeline()
      .sync(Svgpath)
      .add('.line',{
        fill: ['transparent','currentColor'], 
        duration: 1000,
        easing: 'easeInOutQuad'
      },'-=2000')
    });
    return () => scope.current.revert()

  }, []);

  return (
    <div ref={root} className='flex items-center gap-2 rounded-xl p-2'>
      <Image
        src="/static/images/logo.png"
        alt={SITE_METADATA.headerTitle}
        width={80}
        height={80}
        className="logo h-10 w-10 rounded-xl"
        loading="eager"
      />
      <GrowingUnderline className='hover:bg-[length:100%_50%] duration-[1000ms]'>
      <Link
        href="/"
        aria-label={SITE_METADATA.headerTitle}
        className='overflow-hidden'
      >
        <LogoTitle/>
      </Link>
      </GrowingUnderline>
    </div>
  )
}
