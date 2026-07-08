import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const body = await request.json();
  const { status, caption, hashtags, scheduled_at, posted_at, buffer_post_id } = body;

  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (status !== undefined) {
    fields.push(`status = $${idx++}`);
    values.push(status);
  }
  if (caption !== undefined) {
    fields.push(`caption = $${idx++}`);
    values.push(caption);
  }
  if (hashtags !== undefined) {
    fields.push(`hashtags = $${idx++}`);
    values.push(hashtags);
  }
  if (scheduled_at !== undefined) {
    fields.push(`scheduled_at = $${idx++}`);
    values.push(scheduled_at);
  }
  if (posted_at !== undefined) {
    fields.push(`posted_at = $${idx++}`);
    values.push(posted_at);
  }
  if (buffer_post_id !== undefined) {
    fields.push(`buffer_post_id = $${idx++}`);
    values.push(buffer_post_id);
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  fields.push(`updated_at = NOW()`);

  const result = await pool.query(
    `UPDATE reels SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`,
    [...values, id]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Reel not found" }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const result = await pool.query("DELETE FROM reels WHERE id = $1 RETURNING id", [id]);

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Reel not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
