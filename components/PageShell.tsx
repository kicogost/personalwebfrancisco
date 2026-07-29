import Link from 'next/link'

/**
 * The content column on every inner page. Roughly 55 percent of the viewport,
 * offset from the fixed left rail, sitting over the dimmed hero.
 */
export default function PageShell({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rise w-full pt-2 pb-24 md:w-[55vw] md:max-w-[46rem] md:pt-16">
      <Link href="/" className="link face-utility inline-block lowercase text-ink-muted">
        ← home
      </Link>

      {/* The nav marks the current section, so a visible title would only
          repeat it. The document still needs the heading. */}
      <h1 className="sr-only">{title}</h1>

      <div className="mt-12">{children}</div>
    </div>
  )
}
