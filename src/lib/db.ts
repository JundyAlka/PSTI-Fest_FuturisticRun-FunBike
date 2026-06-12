import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

function createPrismaClient() {
  // Use absolute path resolved from this file's location to avoid CWD issues
  const dbPath = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace("file:", "")
    : path.resolve(process.cwd(), "prisma", "dev.db");

  const absolutePath = path.isAbsolute(dbPath)
    ? dbPath
    : path.resolve(process.cwd(), dbPath);

  const adapter = new PrismaBetterSqlite3({ url: `file:${absolutePath}` });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
