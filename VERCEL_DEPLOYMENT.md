# Vercel deployment

1. Import repository `JundyAlka/PSTI-Fest_FuturisticRun-FunBike` into Vercel.
2. Keep the framework preset as **Next.js** and the root directory as the repository root.
3. Add the required variables from `.env.example` to Production, Preview, and Development:
   - `INSFORGE_URL`
   - `INSFORGE_API_KEY` (server-side only; never prefix it with `NEXT_PUBLIC_`)
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
4. Use the default install command and `npm run build` as the build command.
5. Deploy. The build intentionally fails when `INSFORGE_API_KEY` or `AUTH_SECRET` is absent in production, preventing a broken deployment.

`DATABASE_URL` is not required by the deployed application because operational data and admin authentication use InsForge. The local SQLite database is only for local Prisma workflows.
