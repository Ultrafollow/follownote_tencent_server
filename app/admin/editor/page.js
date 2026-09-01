'use client'

import '@/app/globals.css';
import '@/app/prism-dracula.css';
import 'github-markdown-css';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from 'next-themes'; 
import { getMDXComponent } from 'mdx-bundler/client';
import { TreeWrapper } from '@/components/Plugins/Antd';
import { Container } from '@/components/ui/Container';
import Editor from '@/components/Notes/Editor'; 
import { createClient } from '@/utils/supabase/client';
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';
import matter from 'gray-matter'

export default function NotePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { resolvedTheme } = useTheme(); 
  
  // 状态管理
  const [error, setError] = useState(null);
  const [compiledCode, setCompiledCode] = useState(null);
  const [compileError, setCompileError] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentSlug, setCurrentSlug] = useState('');
  const [isContentModified, setIsContentModified] = useState(false);
  const [checkingAllowed, setCheckingAllowed] = useState(false);
  
  // 移动端预览状态
  const [showPreview, setShowPreview] = useState(false);
  const supabase = useMemo(() => {
    if (!session?.supabaseAccessToken) return null
    return createClient(session.supabaseAccessToken)
  }, [session?.supabaseAccessToken])

  const stableUpdateContent = useCallback((content) => {
    setEditorContent(content);
    setSaveSuccess(false);
    setIsContentModified(true);
  }, []);

  // 保存函数
  const handleSave = useCallback(async () => {
    if (!session?.user?.id) {
      alert('请先登录后再保存');
      return;
    }
    const checkUserAllowed = async (userId) => {
      const res = await fetch('/api/CheckKey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      })
      const data = await res.json()
      return data.isAllowed
    }
    const isAllowed = await checkUserAllowed(session.user.id)
    setCheckingAllowed(false); // 校验结束，隐藏动画
    if (!isAllowed) {
      alert(`当前用户无保存权限，请附上你的用户ID：${session.user.id}，联系站长开放权限！`)
      return
    }
    if (!editorContent.trim()) {
      setError('内容不能为空');
      return;
    }
    
    const { data: metadata } = matter(editorContent);
    const slug = metadata.title
      .replace(/\s+/g, '-')
      .replace(/[^\w\u4e00-\u9fa5-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
      
    const category = prompt('请输入笔记分类（例如：技术、生活）：');
    if (category === null) {
      alert('已取消保存');
      return;
    }
    
    if (!category.trim()) {
      alert('分类不能为空');
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('mdx_documents')
        .insert({ 
          content: editorContent, 
          user_id: session.user.id, 
          category: category.trim(), 
          title: slug 
        })
        .select();

      if (supabaseError) throw new Error(supabaseError.message);
      
      setCurrentCategory(category.trim());
      setCurrentSlug(slug);
      setSaveSuccess(true);
      setIsContentModified(false);
    } catch (err) {
      setError(`保存失败：${err.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [editorContent, supabase, session]);
  
  // 保存成功后跳转
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
        const postPath = `${currentCategory}/${currentSlug}`;
        router.push(`/admin/editor/${session.user.id}/${postPath}/edit`);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [saveSuccess, currentCategory, currentSlug, router, session]);

  // 内容未保存确认
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isContentModified) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isContentModified]);

  // MDX编译
  useEffect(() => {
    let isActive = true;
    let abortController = new AbortController();
    
    const compileMDX = async () => {
      try {
        if (!editorContent) return;
        
        setIsCompiling(true);
        const response = await fetch('/api/mdx/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mdxContent: editorContent }),
          signal: abortController.signal,
        });
        
        if (isActive && response.ok) {
          const { code, error: compileError } = await response.json();
          setCompiledCode(code);
          setCompileError(compileError);
        }
      } catch (err) {
        if (isActive && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (isActive) setIsCompiling(false);
      }
    };
    
    const timeout = setTimeout(compileMDX, 800);
    
    return () => {
      clearTimeout(timeout);
      abortController.abort();
      isActive = false;
    };
  }, [editorContent]);

  // 切换预览状态
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  if (error) return <div className="p-4 text-red-600">错误：{error}</div>;

  const MDXComponent = compiledCode ? getMDXComponent(compiledCode) : null;

  return (
    <div className="mt-8 min-h-screen rounded-2xl bg-gray-50 p-4 dark:bg-gray-700">
      {/* 顶部操作栏 */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving || !editorContent.trim() || checkingAllowed}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:bg-blue-300 transition-colors"
        >
          {checkingAllowed
            ? '鉴权...'
            : isSaving
              ? '保存中...'
              : '保存笔记'}
        </button>
        
        {/* 移动端预览切换按钮 */}
        <button
          onClick={togglePreview}
          className="md:hidden px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors"
        >
          {showPreview ? '编辑' : '预览'}
        </button>
        
        {saveSuccess && (
          <span className="text-green-500">保存成功 ✔️</span>
        )}
      </div>

      <div className="flex flex-col md:flex-row rounded-2xl shadow-md bg-white overflow-hidden dark:bg-[#1f1f1f] dark:shadow-lg dark:shadow-cyan-500/50">
        {/* 编辑器区域 */}
        <div 
          className={`${showPreview ? 'hidden' : 'block'} w-full md:w-1/2 p-6 md:border-r border-gray-100`}
        >
          <Editor
            getValue={stableUpdateContent}
            content={editorContent || '# 开始编辑'}
            theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
            style={{
              minHeight: 'calc(100vh - 2rem)',
              width: '100%',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}
          />
        </div>

        {/* 预览区域 */}
        <div 
          className={`${showPreview ? 'block' : 'hidden md:block'} w-full md:w-1/2 p-2`}
        >
          <div 
            className="markdown-root"
            style={{
              height: 'calc(100vh - 2rem)',
              overflowY: 'auto',
              padding: '1rem'
            }}
          > 
            <div className="markdown-body">
              <div className="max-w-4xl">
                {MDXComponent ? (
                  <Container>
                    <MDXComponent components={{ TreeWrapper }} />
                  </Container>
                ) : (
                  <div className="text-center text-gray-500 mt-32">
                    {isCompiling ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></span>
                        <span>编译中...</span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-2xl font-light mb-2">📝 输入你的内容</p>
                        <p className="text-sm text-gray-400">仅支持Markdown语法，右侧将实时预览效果</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}