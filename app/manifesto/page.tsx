import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import Manifesto from '@/content/manifesto.mdx'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'manifesto',
  description: 'What Francisco Gost believes about the work.',
  path: '/manifesto',
})

export default function ManifestoPage() {
  return (
    <PageShell eyebrow="manifesto" title="Manifesto">
      {/* Paragraph spacing is set here rather than in the MDX, so the source
          file stays plain prose. */}
      <div className="face-body measure [&>h2]:face-utility [&>p]:mb-[1.6em] [&>p:last-child]:mb-0 [&>h2]:mt-12 [&>h2]:mb-4 [&>h2]:lowercase [&>h2]:text-ink-muted">
        <Manifesto />
      </div>
    </PageShell>
  )
}
