import { Home } from '@/components/home-page'
export async function generateMetadata({ params }) {
  return {
    title: 'Follow XU',
    description: 'Follow XU 的个人博客，分享技术文章和生活点滴',
    alternates: {
      canonical: 'https://followxu.top',
    },
    openGraph: {
      title: 'Follow XU',
      description: 'Follow XU 的个人博客，分享技术文章和生活点滴',
      type: 'website',
      url: 'https://followxu.top',
    }
  }
}
export default async function HomePage() {
  return (
    <div>
      <Home/>
    </div>
  )
}