import Link from 'next/link'

/**
 * The content column on every inner page. Roughly 55 percent of the viewport,
 * offset from the fixed left rail, sitting over the dimmed hero.
 */
export default function PageShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rise w-full pt-2 pb-24 md:w-[55vw] md:max-w-[46rem] md:pt-16">
      <Link href="/" className="link face-utility inline-block lowercase text-ink-muted">
        ← home
      </Link>

      <header className="mt-16">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="face-heading mt-5">{title}</h1>
      </header>

      <div className="mt-12">{children}</div>
    </div>
  )
}
