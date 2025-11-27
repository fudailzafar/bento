<a href="https://portfoliofy.me">
  <img alt="Open Graph Image" src="./app/opengraph-image.png">
  <h1 align="center">Portfoliofy</h1>
</a>

<p align="center">
  An AI-powered personal site builder. Powered by Gemini.
</p>

## Features

- **AI-Generated Portfolios** – Create a complete professional portfolio in minutes using natural-language prompts.
- **Real-Time UI Updates** – Every change instantly reflects in the live preview with no rebuilds or reloads.
- **Multi-Section Customization** – Add, remove, reorder, and edit sections like Projects, Skills, Experience, and Education.
- **Smart Content Import** – Pull and structure data from your resume or LinkedIn export to auto-populate your portfolio.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, ShadcnUI
- **Backend:** Next.js API Routes, Tambo API
- **Hosting:** Vercel
- **Authentication:** NextAuth.js / OAuth support
- **Database:** Redis
- **File Upload:** UploadThing / Cloudinary

## Getting Started

### Prerequisites

- Node.js (v18+)
- Vercel CLI (for deployment)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/fudailzafar/portfoliofy.git
   cd caleasy
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```env
   AUTH_GOOGLE_ID=""
   AUTH_GOOGLE_SECRET=""
   AUTH_SECRET=""
   CLERK_SECRET_KEY=""
   GOOGLE_ANALYTICS_MEASUREMENT_ID=""
   NEXTAUTH_URL=""
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=""
   NEXT_PUBLIC_POSTHOG_HOST=""
   NEXT_PUBLIC_POSTHOG_KEY=""
   NEXT_PUBLIC_TAMBO_API_KEY=""
   UPLOADTHING_SECRET=""
   UPLOADTHING_TOKEN=""
   UPSTASH_REDIS_REST_TOKEN=""
   UPSTASH_REDIS_REST_URL=""
   RESEND_API_KEY=""
   ```

4. Run database migrations:

   ```sh
   npx prisma migrate dev
   ```

5. Start the development server:

   ```sh
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
   ```sh
   npm install -g vercel
   ```
2. Link the project:
   ```sh
   vercel
   ```
3. Deploy:
   ```sh
   vercel --prod
   ```

## Contributing

Pull requests are welcome! Please open an issue first to discuss any changes.

## License

MIT License. See `LICENSE` for details.
