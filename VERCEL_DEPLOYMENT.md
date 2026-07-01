# Vercel deployment

1. Import repository `JundyAlka/PSTI-Fest_FuturisticRun-FunBike` into Vercel.
2. Keep the framework preset as **Next.js** and the root directory as the repository root.
3. Add the required variables from `.env.example` to Production, Preview, and Development:
   - `INSFORGE_URL`
   - `INSFORGE_API_KEY` (server-side only; never prefix it with `NEXT_PUBLIC_`)
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
4. Use the default install command and `npm run build` as the build command.
5. Deploy. `AUTH_SECRET` is recommended as a dedicated secret. If absent, the server-only `INSFORGE_API_KEY` is used as a stable authentication-secret fallback so Vercel route collection can complete.

Do not set `NEXTAUTH_URL` to a generated `*.vercel.app` deployment URL. Those
URLs can disappear when a deployment is removed. Authentication derives its
origin from the active production or preview host. Set `NEXT_PUBLIC_SITE_URL`
to the stable production domain used by visitors.

`DATABASE_URL` is not required by the deployed application because operational data and admin authentication use InsForge. The local SQLite database is only for local Prisma workflows.
