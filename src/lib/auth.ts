import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { AdminLoginSchema } from "@/lib/validations";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = AdminLoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const bcrypt = await import("bcryptjs");
        const { insforge } = await import("@/lib/insforge");

        const { data: admin, error } = await insforge.database
          .from("admin_users")
          .select("id, email, password, name, role")
          .eq("email", email)
          .maybeSingle();

        if (error || !admin || admin.role !== "admin") return null;
        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) return null;

        return {
          id: String(admin.id),
          email: admin.email,
          name: admin.name ?? "Admin",
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
