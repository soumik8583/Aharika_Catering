import { createClient, type Client } from "@libsql/client";

/**
 * Turso (libSQL) database client — lazily initialised singleton.
 * Database name: Aaharika_Catering
 *
 * The client is created on first query (not at import time) so that
 * `next build` does not fail when env vars are only present at runtime.
 * Credentials are read from environment variables only.
 */
declare global {
  // eslint-disable-next-line no-var
  var __aaharikaDb: Client | undefined;
}

function createDbClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not set. Add it to your environment.");
  }

  return createClient({ url, authToken });
}

function getClient(): Client {
  if (!globalThis.__aaharikaDb) {
    globalThis.__aaharikaDb = createDbClient();
  }
  return globalThis.__aaharikaDb;
}

/**
 * Proxy that defers client creation until a method is actually called.
 * Usage stays the same: `db.execute(...)`, `db.batch(...)`, etc.
 */
export const db: Client = new Proxy({} as Client, {
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
