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

  // What someone would hire him for, in his own words. Rendered at the top of
  // /work, which is where anyone deciding that actually lands.
  pitch:
    'I can build an AI-native customer success organisation from scratch, and make anyone go viral on LinkedIn in under 30 days.',

  description:
    'Builds AI-native customer success organisations from scratch. Makes anyone go viral on LinkedIn in under 30 days.',

  // Set once in Cinzel caps, top right of the hero. Use the interpunct as the
  // separator and keep it to two or three short words.
  motto: 'ACTA · NON · VERBA',

  // The hero renders this photograph as ASCII characters, which discards
  // almost all detail. It needs to read as clear light and dark shapes.
  //
  // Both the hero and the small portrait read from this one file. Overwrite it
  // to change the photograph. The fallbacks below only matter if it goes
  // missing, so the page never renders a broken image.
  heroImage: '/francisco.png',
  portrait: '/francisco.png',
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
