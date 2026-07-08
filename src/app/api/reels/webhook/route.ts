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
  const {
    video_url,
    caption,
    hashtags,
    target_platforms,
    script_text,
    buffer_post_id,
  } = body;

  if (!video_url) {
    return NextResponse.json({ error: "video_url is required" }, { status: 400 });
  }

  const result = await pool.query(
    `INSERT INTO reels (script_text, caption, hashtags, video_url, status, buffer_post_id, target_platforms)
     VALUES ($1, $2, $3, $4, 'pending_review', $5, $6)
     RETURNING *`,
    [
      script_text || null,
      caption || null,
      hashtags || null,
      video_url,
      buffer_post_id || null,
      target_platforms || [],
    ]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}
