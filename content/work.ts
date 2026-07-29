export type WorkEntry = {
  company: string
  role: string
  start: string // "2024"
  end: string | null // null renders as "present"
  location: string
  lines: string[] // one to three short lines, no bullets in the UI
  url?: string
}

// PLACEHOLDER CONTENT. Replace both entries with the real CV. Most recent
// first, since the page renders the array in order.
export const work: WorkEntry[] = [
  {
    company: 'PLACEHOLDER company',
    role: 'placeholder role',
    start: '2024',
    end: null,
    location: 'madrid',
    lines: [
      'One to three short lines describing the work. Sentences rather than bullet points.',
      'The second line carries a specific outcome, if there is one worth naming.',
    ],
    url: 'https://example.com',
  },
  {
    company: 'PLACEHOLDER earlier company',
    role: 'placeholder earlier role',
    start: '2021',
    end: '2024',
    location: 'madrid',
    lines: ['A single line is fine for older entries. Brevity reads as confidence.'],
  },
]
