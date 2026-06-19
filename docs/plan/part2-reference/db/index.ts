import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

// Node runtime only (ADR-2). postgres.js needs a TCP connection.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Not fatal at import time so static builds without DB access still work.
  // Any actual query will throw a clear error below.
  console.warn(
    "[db] DATABASE_URL is not set — database queries will fail until it is configured.",
  );
}

const globalForDb = globalThis as unknown as {
  client?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.client ??
  postgres(connectionString ?? "postgres://invalid", {
    max: 1,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
