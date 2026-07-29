'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { nav, site } from '@/content/site'

/**
 * Portrait and nav. Fixed to the top left on desktop so navigating between
 * sections feels like the content changes underneath a stable frame. On narrow
 * screens it gives up and sits at the top of the flow.
 *
 * The name and the day's line live in FrameFooter, which is rendered after the
 * content so the reading order on mobile comes out right.
 */
export default function SiteFrame() {
  const pathname = usePathname()

  return (
    <div className="relative z-20 flex flex-col gap-7 px-6 pt-8 md:fixed md:top-9 md:left-10 md:w-[var(--rail)] md:px-0 md:pt-0">
      <Link href="/" className="link inline-block w-fit" aria-label={`${site.name}, home`}>
        <Image
          src={site.portrait}
          alt=""
          width={72}
          height={72}
          priority
          className="h-16 w-16 object-cover md:h-[72px] md:w-[72px]"
        />
      </Link>

      <nav aria-label="Sections">
        <ul className="face-utility flex flex-col gap-2 lowercase">
          {nav.map((item) => {
            const current = pathname === item.href
            return (
              <li key={item.href}>
                <Link href={item.href} className="link" aria-current={current ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
