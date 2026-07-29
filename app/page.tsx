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

      {/* On desktop this is taken out of the flow and pinned to the top right,
          opposite the portrait, so it frames the hero rather than sitting on
          top of the face. On mobile there is no room for a corner, so it stays
          in the flow between the nav and the footer. */}
      <p className="face-display text-center text-[clamp(1rem,7vw,1.5rem)] text-ink md:pointer-events-none md:fixed md:top-9 md:right-10 md:z-10 md:text-right md:text-[clamp(1rem,1.9vw,1.5rem)]">
        {site.motto}
      </p>
    </section>
  )
}
