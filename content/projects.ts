export type Project = {
  name: string
  status: string // "shipped june 2026" or "in progress"
  description: string // one sentence, lowercase
  repo?: string
  live?: string
}

// PLACEHOLDER CONTENT. Replace both entries with the real projects.
export const projects: Project[] = [
  {
    name: 'PLACEHOLDER project',
    status: 'shipped june 2026',
    description: 'one sentence in lowercase describing what the thing does',
    repo: 'https://github.com/example/placeholder',
    live: 'https://example.com',
  },
  {
    name: 'PLACEHOLDER second project',
    status: 'in progress',
    description: 'both links are optional, and this entry only carries a repo',
    repo: 'https://github.com/example/placeholder-two',
  },
]
