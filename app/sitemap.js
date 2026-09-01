import { SITE_METADATA } from '@/data/site-metadata'
import { getCategoriesWithPosts } from '@/app/lib/utils'

export default async function sitemap() {
  const siteUrl = SITE_METADATA.siteUrl
  
  // 1. 处理静态路由
  const staticRoutes = ['', 'about',].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString(),
    changefreq: 'daily',
    priority: route === '' ? 1.0 : 0.7
  }))

  // 2. 处理博客文章
  // const blogRoutes = (await getCategoriesWithPosts())
  //   .flatMap(({ category, posts }) => 
  //     posts.map(post => {
  //       // 正确编码分类目录
  //       const encodedCategory = encodeURIComponent(category)
  //       return {
  //         url: `${siteUrl}/blog/${encodedCategory}/${post.slug}`,
  //         lastModified: new Date(post.lastmod || post.date).toISOString(),
  //         changefreq: 'monthly',
  //         priority: 0.8
  //       }
  //     })
  //   )

  return [...staticRoutes]
}