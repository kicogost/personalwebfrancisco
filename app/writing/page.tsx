import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
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
    <PageShell title="Writing">
      <p className="face-body measure text-ink-muted">
        {site.newsletter.name}, a newsletter.{' '}
        <a href={site.newsletter.url} className="link" target="_blank" rel="noreferrer noopener">
          Read it on beehiiv ↗
        </a>
      </p>

      {posts.length > 0 ? (
        <ol className="mt-12 border-t border-rule">
          {posts.map((post) => {
            const date = formatPostDate(post.date)
            return (
              <li key={post.url} className="border-b border-rule py-8">
                <div className="face-utility flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h2 className="font-normal">
                    <a href={post.url} className="link" target="_blank" rel="noreferrer noopener">
                      {post.title}
                    </a>
                  </h2>
                  {date ? (
                    <p className="text-ink-muted lowercase">
                      <time dateTime={post.date ?? undefined}>{date}</time>
                    </p>
                  ) : null}
                </div>

                {post.excerpt ? (
                  <p className="face-body measure mt-4 text-ink-muted">{post.excerpt}</p>
                ) : null}
              </li>
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
