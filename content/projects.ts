export type Project = {
  name: string
  /** Sits to the right of the name. A date range, or "in progress". */
  status: string
  description: string
  /** Any number of outbound links. Label them for what they actually are. */
  links?: { label: string; url: string }[]
}

export const projects: Project[] = [
  {
    // TODO: name is a work in progress.
    name: 'Health Operating System',
    status: 'August 2026 – present',
    description:
      'An app that pulls your health data together from every device and service, and turns it into the handful of things actually worth acting on.',
    links: [{ label: 'github', url: 'https://github.com/kicogost/fitnessappresearch' }],
  },
  {
    name: 'International Events York',
    status: '2019 – 2022',
    description:
      "Co-owned and ran the University of York's first student-run international club nights. First time making money.",
    links: [
      {
        label: 'proof of work',
        url: 'https://www.instagram.com/internationalsocial?igsh=NWV5ZWMwdWo0czIz',
      },
    ],
  },
]
