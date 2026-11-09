# MovieBarengGan — MBG

A personal movie discovery and streaming-platform project built with Next.js, TypeScript, Tailwind CSS, Supabase, and Vercel.

## Current status

This starter includes:
- Original dark-themed responsive homepage
- Featured hero section
- Movie card grid and mood/genre collection cards
- Project metadata and environment-variable template
- Initial Next.js App Router structure

The current movie data and poster imagery are **visual placeholders**. No actual movie playback, TMDB integration, Supabase authentication, or database schema has been enabled yet.

## Requirements

- Node.js 20.9+
- npm

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Environment variables

See `.env.example`. The homepage works without API keys. Add the TMDB and Supabase credentials only when implementing those integrations. Keep secret keys server-side; never expose a Supabase service-role key in a `NEXT_PUBLIC_` variable.

## Public-domain video content

Do not assume a movie is public domain merely because it is old or available online. Verify the rights and the source's redistribution terms for each title and video file, and retain source/license records. For an initial demo, use videos you created or have explicit permission to stream.

Possible research starting points:
- Internet Archive: verify the rights and reuse terms of each individual item.
- Wikimedia Commons: check each file's license and attribution requirements.
- Public-domain review/catalog resources: verify jurisdiction and title-specific status.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. Import the repository into Vercel.
3. Keep the default Next.js build settings.
4. Add environment variables in Vercel Project Settings when integrations are implemented.
5. Deploy.

## Next implementation milestones

1. Connect TMDB through server-side route handlers.
2. Create Supabase tables, Row Level Security policies, and authentication.
3. Add verified public-domain video records and a legal playback source.
4. Implement a player with resume progress and watch history.
5. Add admin content management.

## Notes

The TMDB API and branding have their own terms and attribution requirements. Review them before public deployment. This project is not affiliated with TMDB or any streaming service.
