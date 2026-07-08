import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import AnalyticsClient from "./AnalyticsClient";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const result = await pool.query(`
    SELECT 
      pm.id,
      pm.platform,
      pm.views,
      pm.likes,
      pm.comments,
      pm.fetched_at,
      r.id as reel_id,
      LEFT(r.caption, 60) as caption_snippet,
      r.video_url
    FROM post_metrics pm
    JOIN reels r ON r.id = pm.reel_id
    ORDER BY pm.views DESC
  `);

  return <AnalyticsClient metrics={result.rows} />;
}
