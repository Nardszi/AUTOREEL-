import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { reel_id, platform, views, likes, comments } = body;

  if (!reel_id || !platform) {
    return NextResponse.json(
      { error: "reel_id and platform are required" },
      { status: 400 }
    );
  }

  const existing = await pool.query(
    "SELECT id FROM post_metrics WHERE reel_id = $1 AND platform = $2",
    [reel_id, platform]
  );

  let result;

  if (existing.rows.length > 0) {
    result = await pool.query(
      `UPDATE post_metrics
       SET views = $1, likes = $2, comments = $3, fetched_at = NOW()
       WHERE reel_id = $4 AND platform = $5
       RETURNING *`,
      [views || 0, likes || 0, comments || 0, reel_id, platform]
    );
  } else {
    result = await pool.query(
      `INSERT INTO post_metrics (reel_id, platform, views, likes, comments)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [reel_id, platform, views || 0, likes || 0, comments || 0]
    );
  }

  return NextResponse.json(result.rows[0], { status: 201 });
}
