import path from 'path';
import { bundleMDX } from 'mdx-bundler'
import { getCategoriesWithPosts } from '@/app/lib/utils'
import { getMDXComponent } from 'mdx-bundler/client'
import { notFound } from 'next/navigation'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug';
import rehypePrismPlus from 'rehype-prism-plus';
import toc from '@jsdevtools/rehype-toc';
import remarkCodeTitles from 'remark-flexible-code-titles';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { formatDate } from '@/app/lib/client-utils'
import { Container } from '@/components/ui/Container'
import rehypeTocExt from '@/components/Plugins/Rehype-toc-ext'
import { registerPrismLanguages } from '@/app/lib/lang'
import rehypeCodeCopyButton from '@/components/Plugins/rehype-code-copy-button.mjs'
import emoji from 'remark-emoji';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import readingTime from 'reading-time';
import { remarkAlert } from 'remark-github-blockquote-alert'
import Twemoji from '@/components/ui/Twemoji.js';
import { SITE_METADATA } from '@/data/site-metadata'
import { TreeWrapper } from '@/components/Plugins/Antd';

registerPrismLanguages()

export async function generateStaticParams() {
  try {
    // 使用默认 session_id 获取所有分类和文章（构建时无用户会话）
    const session_id = process.env.DEFAULT_SESSION_ID;
    const categoriesData = await getCategoriesWithPosts({ session_id });
 
    // 遍历分类和文章，生成所有可能的 [category]/[slug] 路径参数
    const params = [];
    for (const category of categoriesData) {
      // 遍历当前分类下的所有文章
      for (const post of category.posts) {
        // 对 category 和 slug 进行 URL 编码（与页面解码逻辑一致）
        const deCategory = decodeURIComponent(category.category);
        const deSlug = decodeURIComponent(post.slug);
        params.push({
          category: deCategory,
          slug: deSlug,
        });
      }
    }
 
    return params;
  } catch (error) {
    console.error('生成静态路径失败:', error);
    // 构建时若数据获取失败，返回空数组（避免整个构建失败）
    return [];
  }
}

export async function getPost(params) {
  try {
    // 解码 URL 参数
    const {category, slug} = await params
    const decategory = decodeURIComponent(category)
    const deslug = decodeURIComponent(slug)
    const session_id = process.env.DEFAULT_SESSION_ID;
    const categoriesData = await getCategoriesWithPosts({session_id})
    
    // 查找匹配分类
    const targetCategory = categoriesData.find(c => 
      c.category === decategory
    )
    if (!targetCategory) throw new Error('分类不存在')
    // 查找匹配文章
    const post = targetCategory.posts.find(p => p.slug === deslug)
    if (!post) throw new Error('文章不存在')

    let mdxSource = post.content
    const { text: readingTimeText, minutes } = readingTime(mdxSource);
    const { code } = await bundleMDX({
      source: mdxSource,
      cwd:path.join(process.cwd(), 'app', 'components', 'Plugins'),
      mdxOptions: (options, frontmatter) => {
        options.remarkPlugins = [...(options.remarkPlugins ?? []), ...[
          remarkGfm,
          remarkCodeTitles,
          remarkAlert,
          [remarkMath, { singleDollarTextMath: true }],
          [emoji, { accessible: true }],
        ]]
        options.rehypePlugins = [...(options.rehypePlugins ?? []), ...[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          rehypeKatex,
          [rehypePrismPlus, { ignoreMissing: false, showLineNumbers: true}],
          rehypeCodeCopyButton,
          toc,
          rehypeTocExt,
        ]]
        return options
      },
      esbuildOptions: options => {
        options.outdir = path.join(process.cwd(), 'public')
        options.write = false
        return options
      }
    })
 
    return {
      code,
      frontmatter: {
        ...post,
        date: post.date, // 保持 Date 对象格式
        author: post.author,
        readingTime: readingTimeText
      }
    }
  } catch (error) {
    console.error('文章加载失败:', error)
    return null
  }
}
 
// 最终版 generateMetadata
export async function generateMetadata({ params }) {
  const {category, slug} = await params
  const decodedCategory = decodeURIComponent(category);
  const decodedSlug = decodeURIComponent(slug);

  try {

    const session_id = process.env.DEFAULT_SESSION_ID;
    const categoriesData = await getCategoriesWithPosts({session_id})
    const targetCategory = categoriesData.find(c => 
      decodeURIComponent(c.category) === decodedCategory
    );
    if (!targetCategory) throw new Error('分类未找到');

    const post = targetCategory.posts.find(p => p.slug === decodedSlug);
    if (!post) throw new Error('文章未找到');

    // 构建封面图URL
    const coverImage = post.coverImage 
      ? new URL(post.coverImage, SITE_METADATA.siteUrl).toString()
      : new URL('/default-og.jpg', SITE_METADATA.siteUrl).toString();

    return {
      title: `${post.title} | ${decodedCategory}`,
      description: post.summary || '技术文章分享',
      alternates: {
        canonical: `/blog/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(decodedSlug)}`
      },
      openGraph: {
        title: post.title,
        description: post.summary,
        type: 'article',
        publishedTime: post.date,
        authors: [post.author || 'followxu'],
        images: [{
          url: coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }]
      },
    };
    
  } catch (error) {
    console.error('元数据生成失败:', error);
    return fallbackMetadata();
  }
}


export default async function PostPage({ params }) {
  const result = await getPost(params)
  const {category} = await params
  if (!result) notFound()
 
  const { code, frontmatter } = result
  const MDXComponent = getMDXComponent(code)
  return (
    <Container className='mb-[200px] max-w-[60%] py-8'>
      {/* 上部 - 文章元信息 */}
      <header className='mb-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm'>
        <span className='text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100'>
          {frontmatter.title}
        </span>
        <hr></hr>
        <div className='flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4'>
          <Twemoji emoji='calendar' />
          <time className='px-2 py-1 rounded-md bg-gray-100 dark:bg-purple-200 dark:text-gray-600'>
            {formatDate(frontmatter.date)}
          </time>
          <span className='h-1 w-1 rounded-full bg-current' aria-hidden />
          <Twemoji emoji='open-book' />
          <span className='px-2 py-1 rounded-md bg-gray-100 dark:bg-purple-200 dark:text-gray-600'>
            {decodeURIComponent(category)}
          </span>
          <span className='h-1 w-1 rounded-full bg-current' aria-hidden />
          <Twemoji emoji='writing-hand' />
          <span className='px-2 py-1 rounded-md bg-gray-100 dark:bg-purple-200 dark:text-gray-600'>
            {frontmatter.author || 'followxu'}
          </span>
          <span className='h-1 w-1 rounded-full bg-current' aria-hidden />
          <Twemoji emoji='hourglass-not-done' />
          <span className='px-2 py-1 rounded-md bg-gray-100 dark:bg-purple-200 dark:text-gray-600'>
            {frontmatter.readingTime}
          </span>
        </div>
        {frontmatter.summary && (
          <p className='mt-4 text-lg text-gray-600 dark:text-gray-300'>
            摘要:  {frontmatter.summary}
          </p>
        )}
        {frontmatter.tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {frontmatter.tags.map(tag => (
              <span 
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
 
      <div className="space-y-8">
          <MDXComponent components={{
            TreeWrapper
          }}/>
      </div>
      <span className="block w-full h-1 bg-gradient-to-r from-red-400 via-lime-500 to-purple-600" />
    </Container>
  )
}