/**
 * Edge-safe auth config — no Node.js or native module imports.
 * Used by proxy.ts (middleware) for route protection only.
 */
import type { NextAuthConfig } from "next-auth";

if (!process.env.AUTH_SECRET && process.env.VERCEL_ENV === "production") {
  throw new Error("Missing AUTH_SECRET in production deployment");
}

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin");
      const isLoginPage = pathname === "/admin/login";
      // Allow login page always; protect all other /admin/* routes
      if (isAdminRoute && !isLoginPage) return !!auth;
      return true;
    },
  },
};
