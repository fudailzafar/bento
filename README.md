<a href="https://bento.me">
  <img alt="Open Graph Image" src="./app/opengraph-image.png">
  <h1 align="center">Bento</h1>
</a>

<p align="center">
  A link in bio, but rich and beautiful. An open-source learning project inspired by bento.me.
</p>

Bento lets people build a visual portfolio page from links, media, notes,
maps, and embeds. It runs on Vercel with a PostgreSQL database (Neon) and
Cloudflare R2 for uploads, and can also be run locally for development.

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
- **Auth:** Better Auth (email and Google)
- **Database:** PostgreSQL (Neon) with Prisma
- **Storage:** Cloudflare R2 (uploads go straight from the browser)
- **Hosting:** Vercel

## Getting started

### Prerequisites

- Node.js 22 (see `.nvmrc`)
- pnpm 10+
- A PostgreSQL database (Neon works well) and a Cloudflare R2 bucket

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

   Fill in the values in `.env.local`. The app checks them when it starts and
   names any that are missing or invalid. Never commit this file or share its
   secrets.

4. Generate the Prisma client and apply the database migrations:

   ```sh
   pnpm prisma generate
   pnpm prisma migrate deploy
   ```

   An existing database that was created before migrations were added already
   has these tables: mark the first migration as applied instead of running
   it, then deploy the rest:

   ```sh
   pnpm prisma migrate resolve --applied 0_init
   pnpm prisma migrate deploy
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
pnpm lint      # Lint
pnpm test      # Run the tests
pnpm build     # Build for production
pnpm start     # Serve the production build
```

## Architecture

- `app/` contains the Next.js routes, pages, metadata, and API handlers.
- `components/` contains the editor, public portfolio, authentication, and UI
  components.
- `lib/` contains code shared by the browser and the server: block schemas,
  layout logic, link and media helpers.
- `lib/server/` is server-only: the database client, page and account
  actions, analytics, storage, rate limiting and settings checks
  (`env.ts`). Route handlers call into it rather than the database.
- `prisma/schema.prisma` defines the data model and `prisma/migrations/`
  holds its history. Change the schema with `pnpm prisma migrate dev`.

How a request is handled:

- **Public profiles** (`/username`) are cached. The route reads no cookies, so
  the first visit builds the page and later ones reuse it until a save clears
  it (or five minutes pass). A signed-in visitor is rewritten by the middleware
  to `/self/username`, rendered per request: the owner gets the editor,
  anyone else the public page.
- **Saving** is versioned: a save names the version it was edited from and is
  refused with a conflict if the page was saved elsewhere.
- **Statistics** count visits and clicks per day, one row per page and day.
- **Uploads** use a short-lived signed address that fixes the file's type and
  exact size; names are random and extensions come from the type.
- **Rate limits** (`lib/server/rate-limit.ts`) count per server instance. To
  make them global, back `consume` with a shared store such as Redis.

## Deployment

The `main` branch can deploy to Vercel. Configure the variables listed in
[`.env.example`](./.env.example) in the Vercel project, run
`pnpm prisma migrate deploy` against the production database when the schema
changes, and add the R2 bucket's public URL to `NEXT_PUBLIC_R2_PUBLIC_URL`.

## Contributing

Bug reports, feature ideas, documentation improvements, and pull requests are
welcome. Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before opening a
pull request. Security issues should be reported privately using
[`SECURITY.md`](./SECURITY.md).

## License

MIT License. See `LICENSE` for details.
