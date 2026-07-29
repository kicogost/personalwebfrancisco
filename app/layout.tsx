import type { Metadata, Viewport } from 'next'
import FrameFooter from '@/components/FrameFooter'
import HeroLayer from '@/components/HeroLayer'
import SiteFrame from '@/components/SiteFrame'
import { site } from '@/content/site'
import { fontVariables } from '@/lib/fonts'
import { pageMetadata } from '@/lib/metadata'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  ...pageMetadata({ path: '/' }),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
}

export const viewport: Viewport = {
  themeColor: '#FCFCFA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-dvh">
        <a
          href="#content"
          className="face-utility sr-only lowercase focus-visible:not-sr-only focus-visible:absolute focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:bg-paper focus-visible:px-3 focus-visible:py-2"
        >
          skip to content
        </a>

        <HeroLayer />
        <SiteFrame />

        <main
          id="content"
          className="relative z-10 px-6 md:pl-[calc(var(--rail)+var(--gutter)+2.5rem)]"
        >
          {children}
        </main>

        <FrameFooter />
      </body>
    </html>
  )
}
