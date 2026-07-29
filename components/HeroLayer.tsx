'use client'

import { usePathname } from 'next/navigation'
import AsciiHero from '@/components/AsciiHero'
import { site } from '@/content/site'

/**
 * The hero is mounted once in the root layout and never unmounts, so the
 * animation keeps its phase while the content below changes. On inner pages it
 * drops back to a watermark.
 */
export default function HeroLayer() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <div
      className="hero-fade pointer-events-none fixed inset-0 -z-10 transition-opacity duration-700 ease-out"
      style={{ opacity: isHome ? 1 : 0.12 }}
    >
      <AsciiHero src={site.heroImage} className="h-full w-full" />
    </div>
  )
}
