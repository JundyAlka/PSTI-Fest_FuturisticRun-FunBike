import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Use edge-safe config — no Node.js native modules
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
