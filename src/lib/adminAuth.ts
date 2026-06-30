import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();
  return session?.user?.role === "admin" ? session : null;
}

