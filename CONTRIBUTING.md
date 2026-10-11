# Contributing to Bento

Thanks for your interest in contributing.

## Before you start

1. Check existing issues and pull requests before starting substantial work.
2. For a larger feature or behavior change, open an issue first so the
   approach can be discussed.
3. Do not include credentials, `.env.local`, generated build output, or
   unrelated formatting changes in a pull request.

## Local development

```sh
pnpm install
cp .env.example .env.local
pnpm prisma generate
pnpm prisma db push
pnpm dev
```

Use your own Supabase project for local development. Do not use production
credentials or data.

## Pull requests

- Keep changes focused and explain the user-facing impact.
- Update directly related documentation.
- Run `pnpm typecheck` before opening a pull request. Run `pnpm lint` when
  working on code covered by the existing ESLint configuration and report any
  unrelated baseline failures separately.
- Include screenshots or a short recording for visual changes.
- Preserve existing behavior unless the pull request explicitly changes it.

## Commit messages

Use a short, imperative subject, for example:

```text
Add map widget search feedback
```

## Code style

The repository uses TypeScript, Prettier, ESLint, and Tailwind CSS. Follow the
existing patterns and run the configured checks rather than introducing a new
style or dependency.
