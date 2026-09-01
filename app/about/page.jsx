import { AuthorLayout } from '@/Layouts/Author-layout'
import { genPageMetadata } from '@/app/seo'

export let metadata = genPageMetadata({ title: 'About' })

export default function AboutPage() {
    return (
      <AuthorLayout />
    )
  }