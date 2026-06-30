/**
 * Edge-safe auth config — no Node.js or native module imports.
 * Used by proxy.ts (middleware) for route protection only.
 */
import type { NextAuthConfig } from "next-auth";

// Vercel imports route modules while collecting build data, so validation must
// not throw during module evaluation. A dedicated AUTH_SECRET remains
// recommended; the server-only InsForge key is a stable fallback.
const authSecret = process.env.AUTH_SECRET ?? process.env.INSFORGE_API_KEY ?? process.env.API_KEY;

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  secret: authSecret,
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? token.sub ?? "";
        session.user.role = token.role;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin");
      const isAdminApi = pathname.startsWith("/api/admin");
      const isLoginPage = pathname === "/admin/login";
      if ((isAdminRoute && !isLoginPage) || isAdminApi) return auth?.user?.role === "admin";
      return true;
    },
  },
};
