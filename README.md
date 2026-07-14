<a href="https://portfoliofy.me">
  <img alt="Open Graph Image" src="./app/opengraph-image.png">
  <h1 align="center">Portfoliofy</h1>
</a>

<p align="center">
  A link in bio, but rich and beautiful. A learning project that rebuilds bento.me.
</p>

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

## Getting Started

### Prerequisites

- Node.js 22 (see `.nvmrc`)
- pnpm
- A Supabase project

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/fudailzafar/portfoliofy-v1.git
   cd portfoliofy-v1
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=""
   NEXT_PUBLIC_SUPABASE_ANON_KEY=""
   DATABASE_URL=""
   DIRECT_URL=""
   ```

4. Push the database schema:

   ```sh
   pnpm prisma db push
   ```

5. Start the development server:

   ```sh
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The `main` branch deploys to Vercel. Set the four environment variables above in the Vercel project.

## License

MIT License. See `LICENSE` for details.
