'use client'
import Image from 'next/image'
import { SITE_METADATA } from '@/data/site-metadata'

function Logo() {
  return (
    <div className='rounded-xl p-2'>
      <Image
        src="/static/images/logo.png"
        alt={SITE_METADATA.headerTitle}
        width={100}
        height={100}
        className="logo h-20 w-20 rounded-xl"
        priority
      />
    </div>
  )
}



export default function Loading() {
 
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white dark:bg-gray-900">
      <div className="mb-8 flex flex-1 items-end animate-bounce">
        <Logo />
      </div>
      <div className="flex flex-1 items-start">
        <div className="flex space-x-2">
          <div className="h-3 w-3 animate-pulse rounded-full bg-blue-600"></div>
          <div className="h-3 w-3 animate-pulse rounded-full bg-blue-600 animation-delay-150"></div>
          <div className="h-3 w-3 animate-pulse rounded-full bg-blue-600 animation-delay-300"></div>
        </div>
      </div>
    </div>
  )
  }