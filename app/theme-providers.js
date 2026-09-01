'use client'

import { ThemeProvider } from 'next-themes'
import { SITE_METADATA } from '@/data/site-metadata'

export function ThemeProviders({children}) {
  return (
    <ThemeProvider attribute="class" defaultTheme={SITE_METADATA.theme} enableSystem>
      {children}
    </ThemeProvider>
  )
}
