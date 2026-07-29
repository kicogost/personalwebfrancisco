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
  tagline: 'AI-native B2B content agency',
  role: 'founding chief of staff',
  standing: 'employee no. 2',   // optional, sits next to the role
  location: 'new york',
  start: 'May 2026',
  end: null,                    // null renders as "present"
  lines: [
    'One to three short lines. Sentences, not bullet points.',
  ],
  proof: { label: 'proof of work', url: 'https://rallyup.team/' },  // optional
}
```

The company name renders large in the monospace face, the tagline beneath it, then role, standing and location joined with interpuncts and set in small caps. Write `role`, `standing` and `location` in lowercase; the page uppercases them. The `lines` are prose, so they take normal sentence case and render in the serif.

### Adding a project

Append to the array in `content/projects.ts`.

```ts
{
  name: 'Health Operating System',
  status: 'August 2026 – present',   // or 'in progress'
  description: 'One sentence saying what the thing does.',
  links: [
    { label: 'github', url: 'https://github.com/...' },
    { label: 'proof of work', url: 'https://...' },
  ],
}
```

`links` takes any number of entries and each is labelled for what it actually is, so a project can point at a repo, a live site, an Instagram account, or nothing at all. Omit the field and the entry renders without a link row. Every link opens in a new tab and gets an arrow automatically.

### Writing the manifesto

`content/manifesto.mdx` is plain prose. Blank line between paragraphs. Markdown headings work if you want them, but the page reads better without.

### Adding a CV PDF

Drop the file in `public/` and point `cvPdf` at it in `content/site.ts`:

```ts
cvPdf: '/francisco-gost-cv.pdf'
```

Leave it as `null` and the download link disappears entirely.

### Swapping the photo

Overwrite `public/francisco.jpg`, keeping the same filename. Both the hero and the small portrait read from it and no code changes.

That file currently holds a generated stand-in, not a real photograph. `content/site.ts` also carries `heroFallback` and `portraitFallback`, which only come into play if `francisco.jpg` is ever missing, so the page never renders a broken image.

The hero renders the photo as ASCII characters, which throws away almost all detail. Pick something that reads as clear light and dark shapes when you squint at it. Faces work if the lighting is strong. Anything low contrast or busy turns to noise.

## Tuning the hero

Run `npm run dev` and a control panel appears in the corner of the home page. It only exists in development. Adjust the columns, noise and colour cycle live, then copy the values into the `AsciiHero` props in `app/page.tsx`.

## Deploying

Pushes to `main` deploy to production automatically through Vercel. Pull requests get preview URLs.
