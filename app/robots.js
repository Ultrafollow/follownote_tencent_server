import { SITE_METADATA } from '@/data/site-metadata'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_METADATA.siteUrl}/sitemap.xml`,
  }
}
