import path from 'path';
import { bundleMDX } from 'mdx-bundler'
import { getMDXComponent } from 'mdx-bundler/client'
import { notFound } from 'next/navigation'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug';
import rehypePrismPlus from 'rehype-prism-plus';
import remarkCodeTitles from 'remark-flexible-code-titles';
import { Container } from '@/components/ui/Container'
import { registerPrismLanguages } from '@/app/lib/lang'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { TreeWrapper } from '@/components/Plugins/Antd';
import '@/app/globals.css'
import '@/app/prism-dracula.css'
import 'github-markdown-css'

registerPrismLanguages()

export async function getPost(content) {
    try {
        const { code } = await bundleMDX({
        source: content,
        cwd:path.join(process.cwd(), 'app', 'components', 'Plugins'),
        mdxOptions: (options, frontmatter) => {
            options.remarkPlugins = [...(options.remarkPlugins ?? []), ...[
            remarkGfm,
            remarkCodeTitles,
            [remarkMath, { singleDollarTextMath: true }],
            ]]
            options.rehypePlugins = [...(options.rehypePlugins ?? []), ...[
            rehypeSlug,
            rehypeKatex,
            [rehypePrismPlus, { ignoreMissing: false, showLineNumbers: true}],
            ]]
            return options
        },
        esbuildOptions: options => {
            options.outdir = path.join(process.cwd(), 'public')
            options.write = true
            return options
        }
        })
    
        return {
        code,
        }
    } catch (error) {
        console.error('文章加载失败:', error)
        return null
    }
}

export async function Preview(mdxSource) {
    const content = mdxSource.mdxSource
    const result = await getPost(content)
    if (!result) notFound()

    const { code, frontmatter } = result
    const MDXComponent = getMDXComponent(code)
    return (
        <div className='markdown-root'>
            <div className='markdown-body'>
                <Container className='mb-[200px] max-w-[60%] py-8'>
                    <div className="space-y-8">
                        <MDXComponent components={{
                            TreeWrapper
                        }}/>
                    </div>
                </Container>
            </div>
        </div>
    )
}