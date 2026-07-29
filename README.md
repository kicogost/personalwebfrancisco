# franciscogost.com

Personal site. Next.js 15, App Router, TypeScript, Tailwind v4, deployed on Vercel.

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Other commands:

```bash
npm run build       # production build, catches most errors before Vercel does
npm run typecheck   # TypeScript only, faster than a full build
```

Node 20 or newer is required.

## Where the content lives

Everything you would want to edit is under `content/`. Nothing else needs touching.

| File | What it holds |
| --- | --- |
| `content/site.ts` | Name, motto, portrait and hero image paths, social links, optional CV PDF path |
| `content/manifesto.mdx` | The long-form prose on `/manifesto` |
| `content/work.ts` | CV entries for `/work` |
| `content/projects.ts` | Project entries for `/projects` |
| `content/meditations.ts` | The Marcus Aurelius lines that rotate in the footer |

The `/writing` page has no file. It pulls from the Between Lines RSS feed at build time and refreshes hourly.

### Changing the motto

One string in `content/site.ts`:

```ts
motto: 'AMOR · FATI'
```

Keep it short and use the interpunct as the separator. It is set in Cinzel caps and appears exactly once per page.

### Adding a job to the CV

Append to the array in `content/work.ts`. Most recent first, so new entries go at the top.

```ts
{
  company: 'RallyUp',
  role: 'head of ops and customer success',
  start: '2024',
  end: null,              // null renders as "present"
  location: 'madrid',
  lines: [
    'One to three short lines. Sentences, not bullet points.',
  ],
  url: 'https://rallyup.team',   // optional
}
```

Roles, companies and locations are lowercase by convention. They render in the monospace utility face.

### Adding a project

Append to the array in `content/projects.ts`.

```ts
{
  name: 'project name',
  status: 'shipped june 2026',    // or 'in progress'
  description: 'one sentence, lowercase, no full stop needed',
  repo: 'https://github.com/...', // optional
  live: 'https://...',            // optional
}
```

Both links are optional. If neither is present the entry renders without a link row.

### Writing the manifesto

`content/manifesto.mdx` is plain prose. Blank line between paragraphs. Markdown headings work if you want them, but the page reads better without.

### Adding a CV PDF

Drop the file in `public/` and point `cvPdf` at it in `content/site.ts`:

```ts
cvPdf: '/francisco-gost-cv.pdf'
```

Leave it as `null` and the download link disappears entirely.

### Swapping the hero photo

Replace the file in `public/` and update `heroImage` in `content/site.ts`.

The hero renders the photo as ASCII characters, which throws away almost all detail. Pick something that reads as clear light and dark shapes when you squint at it. Faces work if the lighting is strong. Anything low contrast or busy turns to noise.

## Tuning the hero

Run `npm run dev` and a control panel appears in the corner of the home page. It only exists in development. Adjust the columns, noise and colour cycle live, then copy the values into the `AsciiHero` props in `app/page.tsx`.

## Deploying

Pushes to `main` deploy to production automatically through Vercel. Pull requests get preview URLs.
