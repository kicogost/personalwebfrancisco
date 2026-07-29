import { XMLParser } from 'fast-xml-parser'
import { site } from '@/content/site'

export type Post = {
  title: string
  url: string
  date: string | null
  excerpt: string
}

/**
 * beehiiv serves the feed from its own rss subdomain, not from the
 * publication's domain, and never advertises it on the publication homepage.
 * The real endpoint is in content/site.ts. The paths after it are the ones
 * beehiiv would use if that ever changes, tried in order, first one that
 * parses as a feed wins.
 */
const FEED_CANDIDATES = [
  site.newsletter.feed,
  `${site.newsletter.url}/feed`,
  `${site.newsletter.url}/rss`,
  `${site.newsletter.url}/feed.xml`,
]

const REQUEST_TIMEOUT_MS = 8000

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  trimValues: true,
})

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) return []
  return Array.isArray(value) ? value : [value]
}

function textOf(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (value && typeof value === 'object' && '#text' in value) {
    return String((value as { '#text': unknown })['#text'] ?? '')
  }
  return ''
}

/** Strips tags and entities, collapses whitespace, then cuts to one line. */
function excerptFrom(html: string, limit = 150): string {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, '’')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= limit) return text
  const cut = text.slice(0, limit)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 60 ? lastSpace : limit).trimEnd()}...`
}

function normaliseDate(raw: string): string | null {
  if (!raw) return null
  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

/** Handles RSS 2.0 and Atom, since beehiiv could serve either. */
function itemsFrom(document: Record<string, unknown>): Post[] {
  const rssChannel = (document.rss as { channel?: Record<string, unknown> } | undefined)?.channel
  if (rssChannel) {
    return asArray(rssChannel.item as Record<string, unknown> | Record<string, unknown>[]).map(
      (item) => ({
        title: textOf(item.title).trim(),
        url: textOf(item.link).trim(),
        date: normaliseDate(textOf(item.pubDate)),
        // description first: beehiiv puts the subtitle there and the whole
        // article in content:encoded. The article bodies belong on beehiiv,
        // not mirrored here.
        excerpt: excerptFrom(textOf(item.description) || textOf(item['content:encoded'])),
      }),
    )
  }

  const atomFeed = document.feed as Record<string, unknown> | undefined
  if (atomFeed) {
    return asArray(atomFeed.entry as Record<string, unknown> | Record<string, unknown>[]).map(
      (entry) => {
        const links = asArray(entry.link as Record<string, string> | Record<string, string>[])
        const alternate =
          links.find((l) => l['@_rel'] === 'alternate' || l['@_rel'] === undefined) ?? links[0]
        return {
          title: textOf(entry.title).trim(),
          url: (alternate?.['@_href'] ?? '').trim(),
          date: normaliseDate(textOf(entry.published) || textOf(entry.updated)),
          excerpt: excerptFrom(textOf(entry.summary) || textOf(entry.content)),
        }
      },
    )
  }

  return []
}

/**
 * Returns the newsletter's posts, or an empty array if the feed cannot be
 * reached or parsed. Never throws, so a beehiiv outage cannot break the build.
 */
export async function fetchPosts(): Promise<Post[]> {
  for (const url of FEED_CANDIDATES) {
    try {
      const response = await fetch(url, {
        headers: { accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
      if (!response.ok) continue

      const body = await response.text()
      // beehiiv answers unknown paths with the publication's own HTML rather
      // than a 404, so the body has to be checked, not just the status.
      if (!body.trimStart().startsWith('<?xml') && !/<(rss|feed)[\s>]/i.test(body)) continue

      const posts = itemsFrom(parser.parse(body) as Record<string, unknown>).filter(
        (post) => post.title && post.url,
      )
      if (posts.length > 0) return posts
    } catch {
      // Try the next candidate. A feed that is unreachable is not an error
      // worth failing a build over.
    }
  }

  return []
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatPostDate(iso: string | null): string | null {
  if (!iso) return null
  return dateFormatter.format(new Date(iso))
}
