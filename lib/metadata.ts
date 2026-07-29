import type { Metadata } from 'next'
import { site } from '@/content/site'

/**
 * Every page's metadata comes through here, so the name, description and
 * social image are all driven from content/site.ts.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string
  description?: string
  path: string
}): Metadata {
  const resolvedTitle = title ? `${title} · ${site.name}` : site.name
  const resolvedDescription = description ?? site.description
  const url = `${site.url}${path === '/' ? '' : path}`

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      locale: 'en_GB',
      images: [{ url: site.portrait, width: 480, height: 480, alt: site.name }],
    },
    twitter: {
      card: 'summary',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [site.portrait],
    },
  }
}
