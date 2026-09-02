'use client'

import { useState } from 'react'
import { Link } from './Link'
import { GrowingUnderline } from '@/components/ui/Growing-underline'

export default function Pagination({ currentPage, totalPages, user }) {
  const [inputPage, setInputPage] = useState(currentPage.toString())
  const [isValid, setIsValid] = useState(true)

  // 处理页码输入
  const handleInputChange = (e) => {
    const value = e.target.value
    setInputPage(value)
    setIsValid(/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= totalPages)
  }

  // 处理跳转
  const handlePageJump = () => {
    const pageNum = parseInt(inputPage)
    if (!isValid || pageNum === currentPage) return

    window.location.href = pageNum === 1
      ? `/admin/editor/${user}`
      : `/admin/editor/${user}/page/${pageNum}`
  }

  return (
    <nav className="flex items-center justify-between w-full">
      <div className="flex-1 flex justify-start">
        {currentPage > 1 && (
          <Link
            href={currentPage === 2 ? `/admin/editor/${user}` : `/admin/editor/${user}/page/${currentPage - 1}`}
            className="rounded-lg bg-white px-5 py-2 text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            <GrowingUnderline>Previous</GrowingUnderline>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2 mx-4">
        <input
          id="pageInput"
          name="page"
          type="text"
          value={inputPage}
          onChange={handleInputChange}
          onBlur={handlePageJump}
          onKeyDown={(e) => e.key === 'Enter' && handlePageJump()}
          className={`w-12 px-3 py-1 text-center text-sm border rounded-lg transition-colors
                    ${isValid ? 
                      'border-gray-300 dark:border-gray-600' : 
                      'border-red-500 bg-red-50 dark:bg-red-900/20'}
                    focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    dark:bg-gray-800 dark:text-gray-200`}
          aria-label="Jump to page"
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          / {totalPages}
        </span>
      </div>

      <div className="flex-1 flex justify-end">
        {currentPage < totalPages && (
          <Link
            href={`/admin/editor/${user}/page/${currentPage + 1}`}
            className="rounded-lg bg-white px-5 py-2 text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
          >
            <GrowingUnderline>Next</GrowingUnderline>
          </Link>
        )}
      </div>
    </nav>
  )
}