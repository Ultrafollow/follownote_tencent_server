'use client'
import Giscus from '@giscus/react';

export default function ({theme}) {
    return <Giscus
        id="comments"
        repo="Ultrafollow/notebookBlog"
        repoId="R_kgDOOcgtiA"
        category="General"
        categoryId="DIC_kwDOOcgtiM4CpRpo"
        mapping="pathname"
        term=""
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === 'dark' ? 'catppuccin_mocha' : 'light'} 
        lang="zh-CN"
        loading="lazy"
    />
}
