export type WorkEntry = {
  company: string
  /** One line describing the company itself, not the role. */
  tagline: string
  role: string
  /** Anything worth sitting next to the role, such as "employee no. 2". */
  standing?: string
  location: string
  start: string // "May 2026"
  end: string | null // null renders as "present"
  lines: string[] // one to three short lines, no bullets in the data
  proof?: { label: string; url: string }
}

// Most recent first. The page renders the array in order.
export const work: WorkEntry[] = [
  {
    company: 'RallyUp',
    tagline: 'AI-native B2B content agency',
    role: 'founding chief of staff',
    standing: 'employee no. 2',
    location: 'new york',
    start: 'May 2026',
    end: null,
    lines: [
      'Grew revenue from $0 to $1M ARR in <6 months.',
      '5+ million impressions generated on LinkedIn for select B2B SaaS founders.',
      'Built the internal repo of agents and skills the whole business runs on.',
    ],
    proof: { label: 'proof of work', url: 'https://rallyup.team/' },
  },
  {
    company: 'Dcycle',
    tagline: 'Series A B2B SaaS',
    role: 'partnerships manager',
    standing: 'employee no. 30',
    location: 'madrid',
    start: 'Sep 2025',
    end: 'May 2026',
    lines: [
      'Built the partnerships function from scratch.',
      'Sourced $500K in directly attributable closed-won revenue.',
      // The pipeline figure stays redacted on purpose. Not a placeholder.
      'Drove 100+ qualified meetings booked and $XM in pipeline.',
    ],
    proof: { label: 'proof of work', url: 'https://dcycle.io/partners/' },
  },
]
