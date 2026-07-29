import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import RevealItem from '@/components/RevealItem'
import { site } from '@/content/site'
import { fetchPosts, formatPostDate } from '@/lib/feed'
import { pageMetadata } from '@/lib/metadata'

export const revalidate = 3600

export const metadata: Metadata = pageMetadata({
  title: 'writing',
  description: `${site.newsletter.name}, the newsletter written by ${site.name}.`,
  path: '/writing',
})

export default async function WritingPage() {
  const posts = await fetchPosts()

  return (
    <PageShell eyebrow="writing" title={site.newsletter.name}>
      <p className="face-utility lowercase">
        <a href={site.newsletter.url} className="link" target="_blank" rel="noreferrer noopener">
          beehiiv · live feed of posts ↗
        </a>
      </p>

      {posts.length > 0 ? (
        <ol className="mt-12 border-t border-rule">
          {posts.map((post, index) => {
            const date = formatPostDate(post.date)
            return (
              <RevealItem key={post.url} index={index} className="border-b border-rule py-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h2 className="face-entry text-[1.0625rem]">
                    <a href={post.url} className="link" target="_blank" rel="noreferrer noopener">
                      {post.title}
                    </a>
                  </h2>
                  {date ? (
                    <p className="face-utility text-ink-muted">
                      <time dateTime={post.date ?? undefined}>{date}</time>
                    </p>
                  ) : null}
                </div>

                {post.excerpt ? (
                  <p className="face-body measure mt-3 text-ink-muted">{post.excerpt}</p>
                ) : null}
              </RevealItem>
            )
          })}
        </ol>
      ) : (
        /* The feed is unreachable or switched off. Say so quietly and point at
           the archive rather than showing an empty page. */
        <p className="face-body measure mt-12 text-ink-muted">
          The list of posts is not loading right now. Everything is on{' '}
          <a
            href={site.newsletter.archive}
            className="link"
            target="_blank"
            rel="noreferrer noopener"
          >
            the archive ↗
          </a>
          .
        </p>
      )}
    </PageShell>
  )
}
