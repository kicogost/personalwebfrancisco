import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import RevealItem from '@/components/RevealItem'
import { projects } from '@/content/projects'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'projects',
  description: 'Small tools and side projects built by Francisco Gost.',
  path: '/projects',
})

export default function ProjectsPage() {
  return (
    <PageShell eyebrow="projects" title="Projects">
      <ol className="border-t border-rule">
        {projects.map((project, index) => (
          <RevealItem key={project.name} index={index} className="border-b border-rule py-10">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <h2 className="face-entry">{project.name}</h2>
              <p className="face-utility text-ink-muted">{project.status}</p>
            </div>

            <p className="face-body measure mt-4">{project.description}</p>

            {project.links?.length ? (
              <p className="face-utility mt-5 flex flex-wrap gap-x-7 gap-y-2 lowercase">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    className="link"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </p>
            ) : null}
          </RevealItem>
        ))}
      </ol>
    </PageShell>
  )
}
