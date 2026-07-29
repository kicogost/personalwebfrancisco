import type { Metadata } from 'next'
import PageShell from '@/components/PageShell'
import { projects } from '@/content/projects'
import { pageMetadata } from '@/lib/metadata'

export const metadata: Metadata = pageMetadata({
  title: 'projects',
  description: 'Small tools and side projects built by Francisco Gost.',
  path: '/projects',
})

export default function ProjectsPage() {
  return (
    <PageShell title="Projects">
      <ol className="border-t border-rule">
        {projects.map((project) => (
          <li key={project.name} className="border-b border-rule py-8">
            <div className="face-utility flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 lowercase">
              <h2 className="font-normal">{project.name}</h2>
              <p className="text-ink-muted">{project.status}</p>
            </div>

            <p className="face-body measure mt-4">{project.description}</p>

            {project.repo || project.live ? (
              <p className="face-utility mt-4 flex gap-6 lowercase">
                {project.repo ? (
                  <a
                    href={project.repo}
                    className="link"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    github ↗
                  </a>
                ) : null}
                {project.live ? (
                  <a
                    href={project.live}
                    className="link"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    live ↗
                  </a>
                ) : null}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </PageShell>
  )
}
