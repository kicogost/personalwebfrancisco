export type SocialLink = {
  label: string
  url: string
}

export const site = {
  name: 'Francisco Gost',
  // Rendered in the bottom left of the frame, one word per line.
  nameLines: ['francisco', 'gost'],

  role: 'Founding Chief of Staff at RallyUp',
  location: 'Madrid',

  description:
    'Francisco Gost. Founding chief of staff at RallyUp. Writes the Between Lines newsletter and builds small tools.',

  // Set once in Cinzel caps, in the optical centre of the hero. Placeholder
  // until Francisco chooses the final text. Use the interpunct as the
  // separator and keep it to two or three short words.
  motto: 'AMOR · FATI',

  // The hero renders this photograph as ASCII characters, which discards
  // almost all detail. It needs to read as clear light and dark shapes.
  //
  // public/francisco.jpg currently holds a generated stand-in at the right
  // dimensions. Overwrite that one file with the real headshot, same name, and
  // both the hero and the portrait pick it up with no code change. The
  // fallbacks below only matter if that file is ever deleted.
  heroImage: '/francisco.jpg',
  portrait: '/francisco.jpg',
  heroFallback: '/hero-placeholder.png',
  portraitFallback: '/portrait-placeholder.png',

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
