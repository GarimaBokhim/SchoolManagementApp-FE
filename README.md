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

This project uses Next.js rewrites to forward frontend requests from `/api/*` to the backend. The default backend is `https://elitespacenepal.premiumasp.net`.

If the backend changes, set `NEXT_PUBLIC_API_URL` in the Vercel project's environment variables to the backend origin (for example, `https://api.example.com`), without a trailing slash or `/api` path. `API_URL`, when set, takes precedence for the rewrite destination. Redeploy after changing environment variables because rewrites are configured at build time.

In Vercel, use the repository root as the project root and `pnpm build` as the build command. Check the deployment's build logs and confirm it was created from the intended Git branch/commit if the site still appears outdated.
