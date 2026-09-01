'use client'
import clsx from 'clsx';
import { usePathname} from 'next/navigation';
import { useState } from 'react';
// import { Container } from '@/components/ui/Container';
import { GrowingUnderline } from '@/components/ui/Growing-underline';
import { Link } from '@/components/ui/Link';
import { HEADER_NAV_LINKS } from '@/data/navigation';
import { Logo } from './Logo';
import AnimatedThemeSwitch from './Switch';
import DocSearch from '@/components/Search/DocSearch';
import { useHeader } from './HeaderContext';
import Twemoji from '@/components/ui/Twemoji.js';

export function Header( { children }) {
  const pathname = usePathname();
  const { visible } = useHeader();
  const [menuOpen, setMenuOpen] = useState(false);
  if (!visible) return null;

  return (
    <div
      as="header"
      className={clsx(
        'relative mx-auto w-full max-w-[100%] px-3 md:max-w-[772px] xl:max-w-[65%] xl:px-7',
        'bg-[#FFFAF0]/75 py-2 backdrop-blur dark:bg-gray-800/75',
        'shadow-sm saturate-100 md:rounded-2xl',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <Logo />
        <div className="flex items-center gap-4 max-h-5">
          {/* 桌面端导航 */}
          <div className="hidden gap-1.5 xl:flex">
            <DocSearch />
            {HEADER_NAV_LINKS.map(({ title, href }) => {
              const isActive = pathname === href;
              return (
                <Link key={title} href={href} className="px-3 py-1 font-medium">
                  <GrowingUnderline
                    className={clsx(isActive && 'bg-[length:100%_50%]')}
                  >
                    {title}
                  </GrowingUnderline>
                </Link>
              );
            })}
          </div>
          <div className="block xl:hidden">
            <AnimatedThemeSwitch />
          </div>
          {/* 移动端导航 */}
          <button
            className="xl:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="打开菜单"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          {/* 下拉菜单 */}
          <div
            className={clsx(
              "absolute left-0 right-0 top-full mx-auto bg-white dark:bg-gray-800 z-50 xl:hidden shadow-lg transition-all duration-200",
              menuOpen
                ? "max-h-[500px] opacity-100 pointer-events-auto"
                : "max-h-0 opacity-0 pointer-events-none",
              "overflow-hidden"
            )}
            style={{ width: '100%' }}
          >
            {/* 关闭按钮 */}
            <button
              className="flex ml-auto m-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMenuOpen(false)}
              aria-label="关闭菜单"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor">
                <path d="M6 6l12 12M6 18L18 6" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {HEADER_NAV_LINKS.map(({ title, href, emoji }) => (
              <Link
                key={title}
                href={href}
                className={clsx(
                  "flex items-center py-3 px-4 w-full rounded font-medium text-base transition-colors",
                  pathname === href && "bg-gray-100 dark:bg-gray-700"
                )}
                onClick={() => setMenuOpen(false)}
              >
                <Twemoji emoji={emoji} size="base" />
                <span className="ml-3">{title}</span>
              </Link>
            ))}
            <div className="mt-4 w-full px-4 pb-2">
              <DocSearch />
            </div>
          </div>
          <div
            data-orientation="vertical"
            role="separator"
            className="hidden h-4 w-px shrink-0 bg-gray-200 dark:bg-gray-600 md:block"
          />
          <div className="flex items-center gap-4 mr-4">
            {children}
            <div className="hidden xl:block">
              <AnimatedThemeSwitch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}