import { Suspense } from 'react'
import { ListLayoutSkeleton } from '@/components/ui/BlogSkeleton'
import ListLayout from '@/Layouts/ListLayout.js'
import { getCategoriesWithPosts } from '@/app/lib/utils'

const POSTS_PER_PAGE = 5

export default async function BlogPage({ params }) {
  const { page } = await params
  const currentPage = Number(page) || 1
  const session_id = process.env.DEFAULT_SESSION_ID; // 替换为实际的用户 ID
  // 获取所有分类数据
  const categoriesData = await getCategoriesWithPosts({session_id})

  // 处理文章路径
  const allPosts = categoriesData
  .flatMap(cat => 
    cat.posts.map(post => ({
      ...post,
      path: `${decodeURIComponent(cat.category)}/${post.slug}`,
      date: post.date || new Date().toISOString()
    }))
  )
  .sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA  // 降序排列（最新在前）
  })  
  // console.log(allPosts)
  // 分页处理
  const initialDisplayPosts = allPosts.slice(
    POSTS_PER_PAGE * (currentPage - 1),
    POSTS_PER_PAGE * currentPage
  )

  const pagination = {
    currentPage,
    totalPages: Math.ceil(allPosts.length / POSTS_PER_PAGE)
  }

  return (
    <Suspense fallback={<ListLayoutSkeleton />}>
      {/* 使用 ListLayout 组件渲染文章列表 */}
      <ListLayout
        posts={allPosts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="All Posts"
      />
    </Suspense>
  )
}