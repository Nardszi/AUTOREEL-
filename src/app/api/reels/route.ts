import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await pool.query("SELECT * FROM reels ORDER BY created_at DESC");
  return NextResponse.json(result.rows);
}
