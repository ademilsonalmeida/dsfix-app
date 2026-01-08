import type { Config } from "drizzle-kit";

// For migration generation, use placeholder if DATABASE_URL is not set
const DATABASE_URL =
  process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
} satisfies Config;
