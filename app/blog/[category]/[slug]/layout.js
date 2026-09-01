'use client'
// app/blog/[category]/[slug]/layout.js
import '@/app/globals.css'
import '@/app/prism-dracula.css'
import 'github-markdown-css'
import { useEffect } from 'react'
import Discussion from '@/components/Comment/Discussion.jsx'
import { useTheme } from 'next-themes' // 导入 useTheme 钩子
import ScrollLinked from '@/components/ui/TopBar'

export default function BlogLayout({ children }) {
  const { theme } = useTheme()
    // 复制按钮功能
  useEffect(() => {
    const handleCopy = async (event) => {
      const button = event.currentTarget;
      const codeContent = button.parentElement.querySelector('code').textContent;
      
      try {
        await navigator.clipboard.writeText(codeContent);
        button.classList.add('copied');
        setTimeout(() => button.classList.remove('copied'), 500);
      } catch (err) {
        console.error('复制失败:', err);
        button.classList.add('error');
        setTimeout(() => button.classList.remove('error'), 500);
      }
    };
  
    const btns = document.querySelectorAll('.copy-code-button');
    btns.forEach(btn => btn.addEventListener('click', handleCopy));
  
    return () => {
      btns.forEach(btn => btn.removeEventListener('click', handleCopy));
    };
  }, []);

  // toc定位
  useEffect(()=>{
    const scrollPaddingTop = 6 * 16
    // 这是所有标题从上到下
    var hs = [];
    document.querySelectorAll('.content-wrapper>h1>a, .content-wrapper>h2>a, .content-wrapper>h3>a, .content-wrapper>h4>a')
      .forEach(n=>hs.push(n));

    // 这是所有的toc标题
    var ts = []
    document.querySelectorAll('.toc-wrapper li>a').forEach(a=>ts.push(a));

    const handle = () => {
      let activeIndex = 0;
      for (var i=0; i<hs.length; i++) {
        let {y} = hs[i].getBoundingClientRect();
        if (y >= 20 + scrollPaddingTop) {
          break;
        }
        if (y < 20 + scrollPaddingTop) {
          activeIndex = i;
        }
      }
      let href = hs[activeIndex]? hs[activeIndex].href : null;
      for (var i=0; i<ts.length; i++) {
        if (href == ts[i].href) {
          if (!ts[i].classList.contains('active')) {
            ts[i].classList.add('active');
          }
        } else {
          ts[i].classList.remove('active');
        }
      }
    }
    handle();
    document.addEventListener('scroll', handle)
    return ()=>document.removeEventListener('scroll', handle)
  }, []);

  return (
    <>
      <div className='markdown-root'>
        <div className='markdown-body'>
          <ScrollLinked/>
          {children}
        </div>
      </div>
      <div className='container mx-auto py-12 px-40'>
        <Discussion theme={theme}/>
      </div>
    </> 
  )
}