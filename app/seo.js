import { SITE_METADATA } from '@/data/site-metadata'

export function genPageMetadata({ title, description, image, ...rest }) {
  return {
    title,
    description: description || SITE_METADATA.description,
    openGraph: {
      title: `${title} | ${SITE_METADATA.title}`,
      description: description || SITE_METADATA.description,
      url: './',
      siteName: SITE_METADATA.title,
      images: image ? [image] : [SITE_METADATA.socialBanner],
      locale: 'zh-CN',
      type: 'website',
    },
    twitter: {
      title: `${title} | ${SITE_METADATA.title}`,
      card: 'summary_large_image',
      images: image ? [image] : [SITE_METADATA.socialBanner],
    },
    ...rest,
  }
}