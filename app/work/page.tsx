import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import RevealItem from '@/components/RevealItem'
import { site } from '@/content/site'
import { work } from '@/content/work'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'work',
  description: site.description,
  path: '/work',
})

export default function WorkPage() {
  return (
    <PageShell eyebrow="work" title="Work">
      {/* The CV says where he has been. This says what he would do for you,
          which is the thing anyone reading this page is actually after. */}
      <p className="face-body measure -mt-2 mb-14 text-[1.25rem] leading-[1.6]">{site.pitch}</p>

      <ol className="border-t border-rule">
        {work.map((entry, index) => {
          const meta = [entry.role, entry.standing, entry.location].filter(Boolean).join(' · ')

          return (
            <RevealItem
              key={`${entry.company}-${entry.start}`}
              index={index}
              className="border-b border-rule py-10"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2 className="face-entry">{entry.company}</h2>
                <p className="face-utility text-ink-muted">
                  {entry.start} – {entry.end ?? 'present'}
                </p>
              </div>

              <p className="face-utility mt-2 text-ink">{entry.tagline}</p>
              <p className="face-meta mt-2">{meta}</p>

              {/* Arrows rather than list markers, so the indent stays on the
                  monospace grid. */}
              <ul className="measure mt-6 space-y-3">
                {entry.lines.map((line) => (
                  <li key={line} className="face-body grid grid-cols-[1.5rem_1fr] items-baseline">
                    <span aria-hidden="true" className="face-utility text-accent">
                      →
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              {entry.proof ? (
                <p className="face-utility mt-6 lowercase">
                  <a
                    href={entry.proof.url}
                    className="link"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {entry.proof.label} ↗
                  </a>
                </p>
              ) : null}
            </RevealItem>
          )
        })}
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
