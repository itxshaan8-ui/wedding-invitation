# Wedding Invitation

Premium wedding invitation website built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, and Lucide React.

## Quick start

```bash
npm install
npm run dev
cd /Users/muhammadhassaan/Documents/Card
```

Open [http://localhost:3000](http://localhost:3000).

## Customize content

Edit `src/config/wedding.ts` for:

- Couple names
- Date & venue
- Timeline events
- Gallery image URLs
- Contact details
- Audio path

## Replace media

| Asset | Path |
|-------|------|
| Background music | `public/audio/background.mp3` (falls back to `background.wav`) |
| Gallery photos | Update URLs in `src/config/wedding.ts` or place files in `public/gallery/` |

## Supabase RSVP

1. Create a Supabase project
2. Run `supabase/schema.sql` in the SQL editor
3. Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Without Supabase credentials, the RSVP form runs in demo mode and still shows a success toast.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint
