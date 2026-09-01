// app/ClientProviders.jsx
'use client' // 标记为客户端组件

import { SessionProvider } from 'next-auth/react';
import { HeaderProvider } from '@/components/Header/HeaderContext';
import { ThemeProviders } from './theme-providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { TiltedGridBackground } from '@/components/ui/Title-grid-background.js';

export default function ClientProviders({ children }) {
  return (
    <SessionProvider>
      <TiltedGridBackground className="inset-x-0 top-0 z-[-1] h-[50vh]" />
      <HeaderProvider>
        <ThemeProviders>
          <Header />
          <main className="mb-auto grow">
            {children}
          </main>
          <Footer />
        </ThemeProviders>
      </HeaderProvider>
    </SessionProvider>
  );
}