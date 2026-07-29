import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import { site } from '@/content/site'
import { work } from '@/content/work'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'work',
  description: `The working history of ${site.name}.`,
  path: '/work',
})

export default function WorkPage() {
  return (
    <PageShell title="Work">
      <ol className="border-t border-rule">
        {work.map((entry) => (
          <li key={`${entry.company}-${entry.start}`} className="border-b border-rule py-8">
            <div className="face-utility flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 lowercase">
              <h2 className="font-normal">
                {entry.role}
                <span className="text-ink-muted">, </span>
                {entry.url ? (
                  <a
                    href={entry.url}
                    className="link"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {entry.company}
                  </a>
                ) : (
                  entry.company
                )}
              </h2>

              <p className="text-ink-muted">
                <span>
                  {entry.start} to {entry.end ?? 'present'}
                </span>
                <span aria-hidden="true"> · </span>
                <span>{entry.location}</span>
              </p>
            </div>

            <div className="face-body measure mt-4 text-ink">
              {entry.lines.map((line) => (
                <p key={line} className="mt-2 first:mt-0">
                  {line}
                </p>
              ))}
            </div>
          </li>
        ))}
      </ol>

      {site.cvPdf ? (
        <p className="face-utility mt-10 lowercase">
          <a href={site.cvPdf} className="link" download>
            download cv ↓
          </a>
        </p>
      ) : null}
    </PageShell>
  )
}
