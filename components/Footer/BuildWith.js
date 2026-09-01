import { SITE_METADATA } from '@/data/site-metadata'
import { Link } from '@/components/ui/Link';
import NextJsIcon from '@/icon/nextjs-fill.svg';
import JavaScriptIcon from '@/icon/JavaScript.svg';
import TailwindIcon from '@/icon/tailwind.svg'; // 修正拼写
import MdxIcon from '@/icon/mdx.svg';
import { GrowingUnderline } from '@/components/ui/Growing-underline'

const BuildWith = () => (
  <div className="flex items-center space-x-1">
    <span className="mr-1 text-gray-500 dark:text-gray-400">Build with</span>

    <div className="flex space-x-1.5">
      <Link href="https://nextjs.org/">
        <NextJsIcon className="h-5 w-5 text-gray-800 dark:text-gray-100 transition-colors" />
      </Link>
      <Link href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide">
        <JavaScriptIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </Link>
      <Link href="https://tailwindcss.com/">
        <TailwindIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </Link>
      <Link href="https://mdxjs.com/">
        <MdxIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </Link>
    </div>

    <span className="px-1 text-gray-400 dark:text-gray-500">-</span>
    <Link 
      href={SITE_METADATA.siteRepo} 
      className="text-gray-500 dark:text-gray-400"
    >
      <GrowingUnderline>View source</GrowingUnderline>
    </Link>
  </div>
);

export default BuildWith;