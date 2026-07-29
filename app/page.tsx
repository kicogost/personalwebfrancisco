import type { Metadata } from 'next'
import { site } from '@/content/site'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({ path: '/' })

export default function Home() {
  return (
    <section className="flex min-h-[42vh] items-center justify-center md:block md:h-dvh">
      {/* The frame already shows the name, but the page still needs a heading
          in the document. Nothing here is meant to be seen. */}
      <h1 className="sr-only">
        {site.name}. {site.role}, {site.location}.
      </h1>

      {/* On desktop this is taken out of the flow so it sits in the optical
          centre of the hero rather than the content column. On mobile there is
          no room for that, so it stays in the flow between the nav and the
          footer. */}
      <p className="face-display text-center text-[clamp(1rem,7vw,1.5rem)] text-ink md:pointer-events-none md:fixed md:inset-0 md:z-10 md:flex md:-translate-y-[3vh] md:items-center md:justify-center md:px-8 md:pl-[var(--rail)] md:text-[clamp(1.25rem,3.2vw,2.25rem)]">
        {site.motto}
      </p>
    </section>
  )
}
