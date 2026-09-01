import { Nunito, Ma_Shan_Zheng, Titan_One } from 'next/font/google'
import clsx from "clsx";
import '@/app/globals.css'
import '@/app/twemoji.css'
import { TiltedGridBackground } from '@/components/ui/Title-grid-background.js'
import { ThemeProviders } from './theme-providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { HeaderProvider } from '@/components/Header/HeaderContext'
import { SITE_METADATA } from '@/data/site-metadata'

export const metadata = {
  metadataBase: new URL(SITE_METADATA.siteUrl),
  title: {
    default: SITE_METADATA.title,
    template: `%s | ${SITE_METADATA.title}`,
  },
  description: SITE_METADATA.description,
  icons: {
    icon: '/favicon.ico',
  },
}

const FONT_PLAYPEN_SANS = Titan_One({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  variable: '--font-titan-one',
})

const chineseFont = Ma_Shan_Zheng({
  // subsets: ['chinese-simplified'], 
  subsets:['latin'],
  weight: '400', 
  display: 'swap',
  variable: '--font-cn-body',
})

// 配置英文字体（Nunito）
const englishFont = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'], // 选择常用字重
  variable: '--font-en-body',
})

export default function RootLayout({ children }) {
  return (
    <html 
    lang="en"
    className={clsx(
      'scroll-smooth',
      chineseFont.variable,
      englishFont.variable,
      FONT_PLAYPEN_SANS.variable
    )}
    suppressHydrationWarning
    >
      <head>
        <meta name="baidu-site-verification" content="codeva-MMXplx3EG1" />
        <meta name="msvalidate.01" content="E6102F9220389FDC31EFF5A009FDE6A5" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FFE4E1" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={clsx([
          'antialiased',
          'relative min-h-screen pl-[calc(100vw-100%)]',
          'flex flex-col',
          'bg-[#F5F5F5] text-neutral-900',
          'dark:bg-dark dark:text-gray-100',
        ])}
      >
          <TiltedGridBackground className="inset-x-0 top-0 z-[-1] h-[50vh]" />
          <HeaderProvider>
            <ThemeProviders>
              <Header/>
              <main className="mb-auto grow">
                {children}
              </main>
              <Footer/>
            </ThemeProviders>
          </HeaderProvider>
      </body>
    </html>
  )
}