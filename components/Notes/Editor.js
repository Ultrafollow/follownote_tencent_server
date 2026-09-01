// components/Notes/Editor.jsx
'use client'

import React,{ useRef, useEffect, useCallback,useState } from 'react';
import { Editor, loader } from '@monaco-editor/react';

loader.config({ 
  paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/" } 
});

function MonacoEditor({ getValue, content, theme }) {
  // 存储编辑器实例的 ref
  const editorRef = useRef(null);
  // 存储事件监听的 dispose 函数（用于清理）
  const disposeRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false); // 新增移动端状态

  // 检测屏幕尺寸
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile(); // 初始检测
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // 编辑器挂载完成时的回调（获取实例并绑定事件）
  const handleEditorMount = useCallback((editor) => {
    editorRef.current = editor;
    
    // 绑定内容变化的原生事件（关键修改点）
    disposeRef.current = editor.onDidChangeModelContent(() => {
      const newContent = editor.getValue(); // 直接从实例获取内容
      getValue?.(newContent); // 通知父组件更新状态
    });

    // 初始化时设置内容（避免 value 变化触发重新渲染）
    editor.setValue(`---
title: example(不可重复)
author: followxu
date: 2000-12-20
tags: ['tag1','tag2']
summary: 'example'
---
# 正文内容`);
  }, []);

  // 组件卸载时清理事件监听
  useEffect(() => {
    return () => {
      if (disposeRef.current) {
        disposeRef.current.dispose(); // 移除事件监听
        disposeRef.current = null;
      }
    };
  }, []);

  return (
    <Editor
      // 移除 onChange 回调（改用 ref 监听原生事件）
      height="80vh"
      width={isMobile ? "70vw" : "45vw"}
      theme={theme}
      language="markdown"
      onMount={handleEditorMount} // 挂载时绑定实例和事件
      options={{
        automaticLayout: true,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        mouseWheelZoom: true,
        minimap: { enabled: false },
      }}
    />
  );
}

export default React.memo(MonacoEditor);