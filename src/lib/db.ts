import { Pool, QueryResult, QueryResultRow } from "pg";
import fs from "fs";
import path from "path";

let pool: Pool | null = null;
let currentConnectionString: string =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/solar_db";

export function getConnectionString(): string {
  return currentConnectionString;
}

export function resetPool(newConnectionString?: string): Pool {
  if (pool) {
    try {
      pool.end();
    } catch {}
    pool = null;
  }
  if (newConnectionString) {
    currentConnectionString = newConnectionString;
    process.env.DATABASE_URL = newConnectionString;
  }
  return getPool();
}

export function getPool(): Pool {
  if (!pool) {
    currentConnectionString =
      process.env.DATABASE_URL || currentConnectionString;

    pool = new Pool({
      connectionString: currentConnectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", (err) => {
      console.error("[PostgreSQL Pool Error]:", err.message);
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const p = getPool();
  const start = Date.now();
  try {
    const res = await p.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== "production") {
      console.log(`[SQL Query] (${duration}ms): ${text.slice(0, 80)}...`);
    }
    return res;
  } catch (err: any) {
    console.error(`[SQL Error] in query "${text.slice(0, 80)}":`, err.message);
    throw err;
  }
}

export async function testConnection(): Promise<{
  connected: boolean;
  version?: string;
  error?: string;
  database?: string;
}> {
  try {
    const res = await query("SELECT current_database() as db, version();");
    return {
      connected: true,
      database: res.rows[0]?.db,
      version: res.rows[0]?.version,
    };
  } catch (err: any) {
    return {
      connected: false,
      error: err.message || "Failed to connect to PostgreSQL",
    };
  }
}
