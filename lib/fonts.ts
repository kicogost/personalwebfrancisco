import { Cinzel, EB_Garamond, IBM_Plex_Mono } from 'next/font/google'

// display: 'swap' would show a fallback first. These are all self-hosted and
// preloaded by next/font, so 'block' gives a brief invisible period instead of
// a flash of the wrong face.

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'block',
  variable: '--font-plex-mono',
})

export const garamond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'block',
  variable: '--font-garamond',
})

export const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400'],
  display: 'block',
  variable: '--font-cinzel',
})

export const fontVariables = `${plexMono.variable} ${garamond.variable} ${cinzel.variable}`
