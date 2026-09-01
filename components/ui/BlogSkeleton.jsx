import { Container } from "./Container"
export const ListLayoutSkeleton = () => (
    <Container className="w-full py-8 animate-pulse bg-[#F5F5F5] dark:bg-dark">
      {/* 标题骨架 */}
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/3 mb-8" />
      
      {/* 搜索框骨架 */}
      <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8" />
      
      {/* 文章列表骨架 */}
      <div className="grid gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl p-6 bg-gray-100 dark:bg-gray-800">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* 左侧元数据 */}
              <div className="w-full md:w-1/4 space-y-3">
                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-3/4" />
              </div>
              
              {/* 右侧内容 */}
              <div className="w-full md:w-3/4 space-y-4">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-16" />
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-20" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )