import { NextResponse } from "next/server";
import { query, testConnection } from "@/lib/db";

export async function GET() {
  try {
    const health = await testConnection();

    if (!health.connected) {
      return NextResponse.json(
        {
          connected: false,
          error: health.error,
          hint: "Ensure PostgreSQL service is running on localhost:5432 and password matches in .env.local",
        },
        { status: 503 }
      );
    }

    // Query table statistics
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    const tablesRes = await query(tablesQuery);
    const tables = tablesRes.rows.map((r) => r.table_name);

    const counts: Record<string, number> = {};
    for (const t of tables) {
      try {
        const countRes = await query(`SELECT count(*)::int as cnt FROM "${t}";`);
        counts[t] = countRes.rows[0].cnt;
      } catch {
        counts[t] = 0;
      }
    }

    const totalRecords = Object.values(counts).reduce((a, b) => a + b, 0);

    return NextResponse.json({
      connected: true,
      database: health.database,
      version: health.version,
      port: 5432,
      host: "localhost",
      tableCount: tables.length,
      totalRecords,
      tables: counts,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        connected: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
