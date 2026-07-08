import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { pool } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const result = await pool.query(
    "SELECT * FROM reels ORDER BY created_at DESC"
  );

  return <DashboardClient reels={result.rows} />;
}
