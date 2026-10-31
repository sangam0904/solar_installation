import { NextResponse } from "next/server";
import { runDatabaseInit } from "@/scripts/initDb";
import { resetPool } from "@/lib/db";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    let connectionString: string | undefined;
    try {
      const body = await request.json();
      if (body?.connectionString) {
        connectionString = body.connectionString;
      } else if (body?.password) {
        connectionString = `postgresql://postgres:${encodeURIComponent(body.password)}@localhost:5432/solar_db`;
      }
    } catch {}

    const result = await runDatabaseInit(connectionString);

    if (connectionString) {
      resetPool(connectionString);

      // Persist working DATABASE_URL to .env.local
      try {
        const envPath = path.join(process.cwd(), ".env.local");
        let envContent = "";
        if (fs.existsSync(envPath)) {
          envContent = fs.readFileSync(envPath, "utf-8");
        }
        if (envContent.includes("DATABASE_URL=")) {
          envContent = envContent.replace(
            /DATABASE_URL=.*/g,
            `DATABASE_URL=${connectionString}`
          );
        } else {
          envContent = envContent.trim() + `\nDATABASE_URL=${connectionString}\n`;
        }
        fs.writeFileSync(envPath, envContent, "utf-8");
      } catch (err: any) {
        console.warn("[Env update warning]:", err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "PostgreSQL Database successfully created and seeded with all live records!",
      summary: result.summary,
    });
  } catch (error: any) {
    console.error("[Database Seed API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to initialize and seed database.",
        hint: error.message?.includes("password authentication failed")
          ? "Please provide the correct PostgreSQL password you set during installation."
          : undefined,
      },
      { status: 500 }
    );
  }
}
