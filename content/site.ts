export type SocialLink = {
  label: string
  url: string
}

export const site = {
  name: 'Francisco Gost',
  // Rendered in the bottom left of the frame, one word per line.
  nameLines: ['francisco', 'gost'],

  role: 'Head of Ops and Customer Success at RallyUp',
  location: 'Madrid',

  description:
    'Francisco Gost. Operations and customer success at RallyUp, in Madrid. Writes the Between Lines newsletter and builds small tools.',

  // Set once in Cinzel caps, in the optical centre of the hero. Placeholder
  // until Francisco chooses the final text. Use the interpunct as the
  // separator and keep it to two or three short words.
  motto: 'AMOR · FATI',

  // The hero renders this photograph as ASCII characters, which discards
  // almost all detail. It needs to read as clear light and dark shapes.
  heroImage: '/hero-placeholder.png',
  portrait: '/portrait-placeholder.png',

  // Drop a PDF in public/ and point at it to make the download link on /work
  // appear. Leave it null and the link is not rendered at all.
  cvPdf: null as string | null,

  // Between Lines. See content/feed.ts for the RSS endpoint.
  newsletter: {
    name: 'Between Lines',
    url: 'https://betweenlines.beehiiv.com',
    archive: 'https://betweenlines.beehiiv.com/archive',
  },

  social: [
    { label: 'linkedin', url: 'https://www.linkedin.com/in/franciscogost/' },
    { label: 'email', url: 'mailto:francisco@rallyup.team' },
  ] satisfies SocialLink[],

  // Used for canonical URLs and Open Graph. Update if the domain changes.
  url: 'https://franciscogost.com',
} as const

export const nav = [
  { label: 'manifesto', href: '/manifesto' },
  { label: 'work', href: '/work' },
  { label: 'projects', href: '/projects' },
  { label: 'writing', href: '/writing' },
] as const
