import Link from 'next/link'
import { formatDate } from '@/app/lib/client-utils'
import { GrowingUnderline } from '@/components/ui/Growing-underline'
import { getCategoriesWithPosts } from '@/app/lib/utils'

export async function RecentPosts({ limit = 3 }) {
  const session_id = "fc96345b-fdc5-4b0c-9a07-51021c489234"; // 替换为实际的用户 ID
  // 获取所有分类数据
  const categoriesData = await getCategoriesWithPosts({session_id})
  
  // 处理并排序文章数据
  const recentPosts = categoriesData
    .flatMap(cat => 
      cat.posts.map(post => ({
        ...post,
        path: `${decodeURIComponent(cat.category)}/${post.slug}`,
        date: post.date || new Date().toISOString(),
        category: cat.category
      }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit) // 仅取最新 N 篇文章
  return (
    <section className="space-y-8">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-greeting text-5xl text-gray-900 dark:text-gray-100">
          Recent Posts
        </h1>
        <Link 
          href="/blog"
          className="text-gray-600 hover:text-primary-700 dark:text-gray-100"
        >
          <GrowingUnderline>View All Posts</GrowingUnderline>
        </Link>
      </div>
      <hr></hr>
      <div className="grid gap-6">
        {recentPosts.map(post => (
          <article
            key={post.path}
            className="group rounded-xl p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* 日期和分类 */}
              <div className="flex flex-col md:w-1/4 space-y-1">
                <time className="text-1xl text-gray-500 dark:text-gray-400">
                  {formatDate(post.date)}
                </time>
                <span className="max-w-fit inline-block px-2 py-1 text-1xl font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 rounded">
                  {decodeURIComponent(post.category)}
                </span>
              </div>

              {/* 主要内容 */}
              <div className="md:w-3/4 space-y-2">
                <h3 className="text-2xl font-semibold">
                  <Link
                    href={`/blog/${post.path}`}
                    className="text-gray-900 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
                  >
                    <GrowingUnderline>{post.title}</GrowingUnderline>
                  </Link>
                </h3>
                {post.summary && (
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                    {post.summary}
                  </p>
                )}
                {/* 标签简版 */}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-base font-medium text-gray-600 bg-green-100 rounded-lg dark:text-gray-300 dark:bg-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}