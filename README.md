This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The Next.js API route at `src/app/api/[...path]/route.ts` forwards `/api/*` requests server-side to `https://elitespacenepal.premiumasp.net`. This works both on Vercel and in local development without browser-to-backend CORS requirements.

If the backend changes, set `API_URL` in the Vercel project's environment variables to the backend origin (without a trailing slash or `/api` path), then redeploy. `NEXT_PUBLIC_API_URL` is also accepted as a fallback for the proxy destination.

In Vercel, use the repository root as the project root and `pnpm build` as the build command. The Windows-specific environment assignments in `dev:remote` are for local development; Vercel runs the same API proxy route. Confirm the production deployment was created from the commit containing this route.
