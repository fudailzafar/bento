<a href="https://bento.me">
  <img alt="Open Graph Image" src="./app/opengraph-image.png">
  <h1 align="center">Bento</h1>
</a>

<p align="center">
  A link in bio, but rich and beautiful. An open-source learning project inspired by bento.me.
</p>

Bento lets people build a visual portfolio page from links, media, notes,
maps, and embeds. The project is designed to be self-hosted with Supabase and
Vercel, but can also be run locally for development.

## Features

- **Bento grid profile** – Links, images, videos, notes, maps and section titles in a drag-and-drop grid, with bento's widget sizes.
- **Edit in place** – Widgets are edited right on the grid, with a floating toolbar for sizes, colours, alignment and links.
- **Smart links** – Platform links get their brand colours and buttons; page links show a preview image; YouTube, Vimeo, Spotify and SoundCloud play inline.
- **Paste and drop** – Paste or drop a link, image or video anywhere to add it as a widget.
- **Sharing and analytics** – Share with a QR code, and see profile views and link clicks.

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui, Framer Motion
- **Grid:** react-grid-layout
- **Auth:** Supabase Auth (email and Google)
- **Database:** Supabase Postgres with Prisma
- **Storage:** Supabase Storage
- **Hosting:** Vercel

## Getting started

### Prerequisites

- Node.js 22 (see `.nvmrc`)
- pnpm 10+
- A Supabase project

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/fudailzafar/bento.git
   cd bento
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Create a local environment file from the included example:

   ```sh
   cp .env.example .env.local
   ```

   Fill in the Supabase project values in `.env.local`. Never commit this file
   or share its secrets.

4. Generate the Prisma client and push the database schema:

   ```sh
   pnpm prisma generate
   pnpm prisma db push
   ```

5. Start the development server:

   ```sh
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available commands

```sh
pnpm dev       # Start the development server
pnpm typecheck # Run TypeScript checks
pnpm build     # Build for production
pnpm start     # Serve the production build
```

## Architecture

- `app/` contains the Next.js routes, pages, metadata, and API handlers.
- `components/` contains the editor, public portfolio, authentication, and UI
  components.
- `lib/` contains shared block schemas, layout logic, media helpers, and
  server-side integrations.
- `prisma/schema.prisma` defines the PostgreSQL data model.

The browser authenticates through Supabase. Profile and block data are stored
in PostgreSQL through Prisma, while uploaded media is stored in Supabase
Storage.

## Deployment

The `main` branch can deploy to Vercel. Configure the variables listed in
[`.env.example`](./.env.example) in the Vercel project, and make sure the
Supabase Storage policies allow authenticated users to upload their own media.

## Contributing

Bug reports, feature ideas, documentation improvements, and pull requests are
welcome. Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before opening a
pull request. Security issues should be reported privately using
[`SECURITY.md`](./SECURITY.md).

## License

MIT License. See `LICENSE` for details.
