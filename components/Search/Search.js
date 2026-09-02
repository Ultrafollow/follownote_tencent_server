// components/Search.js
'use client'

export default function Search({ value, onChange }) {
  return (
    <div className="relative max-w-2xl">
      <input
        id="search"
        name="search"
        type="text"
        placeholder="Search..."
        value={value}
        onChange={onChange}
        className="block w-full rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-lg text-gray-900 shadow-demure focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:border-gray-700 dark:bg-dark dark:text-gray-100"
      />
      <svg
        className="absolute right-4 top-4 h-6 w-6 text-gray-400 dark:text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  )
}