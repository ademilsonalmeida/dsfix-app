import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import * as relations from "./relations";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Create postgres connection
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);

// Combine schema and relations
const fullSchema = { ...schema, ...relations };

// Create drizzle instance with schema and relations
export const db = drizzle(client, { schema: fullSchema });

// Export schema for use in queries
export { schema };
