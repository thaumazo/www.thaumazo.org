import type { Config } from "drizzle-kit";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "node:path";

if (!process.env.DATABASE_URL && !process.env.VERCEL) {
  const envPath = resolve(process.cwd(), ".env.local");
  dotenvConfig({ path: envPath });
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Set it in your environment (e.g., Vercel/CI) or in a local .env.local file."
  );
}

export default {
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  dialect: "postgresql",
  verbose: true,
  strict: true,
  migrations: {
    table: "__drizzle",
    schema: "public",
  },
} satisfies Config;
