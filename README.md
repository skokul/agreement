# Leave & License Agreement Builder

Production-ready Next.js App Router app for creating, editing, previewing, sharing, and downloading a Leave & License Agreement.

## Features

- `/agreement/new` create a new agreement with live preview
- `/agreement/[id]` read-only preview
- `/agreement/[id]/edit` edit an existing agreement
- Local-first storage with `localStorage`
- DOCX export using `docx`
- PDF export using `@react-pdf/renderer`
- TypeScript, Tailwind CSS, Zod, and React Hook Form

## Local development

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Production build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repository in Vercel.
3. Let Vercel detect Next.js automatically.
4. Deploy.

## Storage model

Agreement data is stored in `localStorage` first so the app works without a database. The code uses a clean repository abstraction in `lib/agreement-storage.ts` so a database-backed implementation can be added later without changing the UI flow.
