// layouts/ListLayout.js
'use client'

import { useState,useEffect } from 'react'
import { Container } from '@/components/ui/Container'
import { Link } from '@/components/ui/Link'
import Pagination from '@/components/ui/Pagination'
import UserPagination from '@/components/ui/UserPagination'
import Search from '@/components/Search/Search'
import { formatDate } from '@/app/lib/client-utils'
import { GrowingUnderline } from '@/components/ui/Growing-underline'
import { usePathname } from 'next/navigation'; 

export default function ListLayout({
  posts,          // 全部原始文章数据（始终基于完整数据集）
  initialDisplayPosts = [],  // 初始分页数据
  pagination,
  title,
  default_user,
  user
}) {
  const pathname = usePathname();
  const pathSegments = pathname
    .replace(/^\//, '')
    .split('/')
    .filter(segment => segment !== '');
  const relocation = (pathSegments[0] === 'blog')
  const showEdit = (pathSegments[0] === 'admin' && pathSegments[1] === 'editor')
  const [isLoading, setIsLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
	  
  useEffect(() => {
    // 数据加载完成后关闭加载状态
    setIsLoading(false)
  }, [posts]) // 当 posts 数据变化时触发

  // 标签点击处理（每次点击都基于完整数据集重新筛选）
  const handleTagClick = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)  // 移除标签
        : [...prev, tag]               // 添加标签
    )
  }

  // 筛选逻辑（始终基于全部posts数据）
  const filteredPosts = posts.filter(post => {
    // 必须满足所有选中标签（AND逻辑）
    const tagMatch = selectedTags.length === 0 || 
      selectedTags.every(tag => post.tags?.includes(tag))
    
    // 必须满足搜索条件
    const searchMatch = (post.title + (post.summary || '') + (post.category || '') + (post.tags || ''))
      .toLowerCase()
      .includes(searchValue.toLowerCase())

    return tagMatch && searchMatch
  })

  // 显示逻辑（有筛选时显示全部结果，否则显示分页数据）
  const displayPosts = (searchValue || selectedTags.length > 0)
    ? filteredPosts
    : initialDisplayPosts

  return (
    <Container className="py-8">
      {/* {isLoading ? (
        <ListLayoutSkeleton />
      ) : ( */}
      <div className="flex flex-col space-y-8">
        {/* 动态标题 */}
        <h1 className="font-extrabold tracking-tight text-4xl leading-[3rem] md:text-5xl md:leading-[4rem] flex flex-col md:flex-row gap-2">
          <span>{title}</span>
          {selectedTags.length > 0 && (
            <span className="text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-300 flex items-center">
              <span className="mr-2 text-gray-400 dark:text-gray-500">-</span>
              <span className="flex items-center max-w-[300px] md:max-w-[600px] truncate space-x-2">
                {selectedTags.map((tag, index) => (
                  <span
                    key={tag}
                    className="inline-flex items-center bg-primary-100 tracking-normal dark:bg-primary-900/50 rounded-full px-3 py-1 text-sm font-medium text-primary-600 dark:text-primary-300"
                  >
                    {tag}
                  </span>
                ))}
              </span>
              <button
                onClick={() => setSelectedTags([])}
                className="tracking-normal ml-3 px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 
                          hover:bg-green-200 dark:hover:bg-green-800 transition-colors
                          flex items-center text-sm font-medium"
                aria-label="Clear all tags"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                clear tags
              </button>
            </span>
          )}
        </h1>

        {/* 搜索区域 */}
        <div className="flex flex-col space-y-6">
          <div className="text-lg text-gray-600 dark:text-gray-300">
            <p>Search through all technical articles and resources</p>
            <p className="mt-2">Supports title, category, tags and content search</p>
          </div>
          <Search
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {/* 文章列表 */}
        <div className="grid gap-8">
          {!displayPosts.length ? (
            <div className="text-center py-12 text-xl text-gray-500 dark:text-gray-400">
              No articles found matching the criteria
            </div>
          ) : (
            displayPosts.map(post => (
              <article
                key={post.date}
                className="group rounded-2xl p-6 transition-all 
                        hover:shadow-demure dark:hover:shadow-mondegreen
                        flex flex-col md:flex-row gap-6 md:gap-8
                        bg-white dark:bg-gray-800"
              >
                {/* 左侧元数据 */}
                <div className="w-full md:w-1/4 flex flex-col space-y-3">
                  <time className="text-base font-medium text-gray-600 dark:text-gray-400">
                    {formatDate(post.date)}
                  </time>
                  <span className="inline-flex items-center rounded-full
                                bg-gray-100 dark:bg-gray-700 px-3 py-1.5
                                text-sm font-medium text-gray-700 dark:text-gray-200
                                max-w-fit">
                    {post.category}
                  </span>
                  {showEdit && (
                    <Link
                      href={`/admin/editor/${user}/${post.path}/edit`}
                      className="inline-flex items-center rounded-full
                                bg-green-100 dark:bg-gray-700 px-3 py-1.5
                                text-sm font-medium text-gray-700 dark:text-gray-200
                                max-w-fit hover:bg-red-200 dark:hover:bg-gray-600"
                    >
                      edit
                    </Link>
                  )}
                </div>

                {/* 右侧内容 */}
                <div className="w-full md:w-3/4 space-y-4">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold leading-tight">
                      <Link
                        href={!relocation 
                              ? `/admin/editor/${user}/${post.path}`
                              : `/blog/${post.path}`
  }
                        className="text-gray-900 dark:text-gray-100"
                      >
                        <GrowingUnderline>{post.title}</GrowingUnderline>
                      </Link>
                    </h2>
                    
                    {/* 标签组 */}
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className={`rounded-lg px-3 py-1 text-sm font-medium cursor-pointer transition-colors
                                    ${
                                      selectedTags.includes(tag)
                                        ? 'bg-primary-400 text-white dark:bg-primary-300 dark:text-gray-900'
                                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-primary-600 dark:text-primary-300'
                                    }`}
                            onClick={(e) => {
                              e.stopPropagation() // 阻止事件冒泡
                              handleTagClick(tag)
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {post.summary && (
                    <p className="prose text-gray-600 dark:text-gray-300 lg:prose-lg max-w-3xl">
                      {post.summary}
                    </p>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        {/* 分页器 */}
        {pagination && pagination.totalPages > 1 && 
         !searchValue && 
         selectedTags.length === 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            {!relocation? (
                    <UserPagination {...pagination} user={user} />
                  ): (
                    <Pagination {...pagination} />
                  )}
          </div>
        )}
      </div>
      {/* )} */}
    </Container>
  )
}