"use client";

import { useState } from "react";

interface Reel {
  id: number;
  script_text: string | null;
  caption: string | null;
  hashtags: string | null;
  video_url: string | null;
  status: string;
  buffer_post_id: string | null;
  target_platforms: string[];
  scheduled_at: string | null;
  posted_at: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending_review: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  approved: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  posted: "bg-green-500/15 text-green-400 border-green-500/30",
  failed: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function ReelCard({ reel }: { reel: Reel }) {
  const [editing, setEditing] = useState(false);
  const [caption, setCaption] = useState(reel.caption || "");
  const [hashtags, setHashtags] = useState(reel.hashtags || "");
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    try {
      const res = await fetch(`/api/reels/${reel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      if (res.ok) {
        await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "/api/reels/webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reel_id: reel.id,
            video_url: reel.video_url,
            caption,
            hashtags: reel.hashtags,
            target_platforms: reel.target_platforms,
          }),
        });
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveCaption() {
    setLoading(true);
    try {
      const res = await fetch(`/api/reels/${reel.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, hashtags }),
      });
      if (res.ok) {
        setEditing(false);
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this reel?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/reels/${reel.id}`, { method: "DELETE" });
      if (res.ok) window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#12121a] border border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative bg-black aspect-[9/16] max-h-80 overflow-hidden">
        {reel.video_url ? (
          <video
            src={reel.video_url}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
              STATUS_STYLES[reel.status] || STATUS_STYLES.pending_review
            }`}
          >
            {reel.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="p-5">
        {editing ? (
          <div className="space-y-3 mb-4">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-[#1a1a28] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39ff14] resize-none"
              rows={3}
            />
            <input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full bg-[#1a1a28] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39ff14]"
              placeholder="#hashtags"
            />
          </div>
        ) : (
          <>
            {reel.caption && (
              <p className="text-gray-300 text-sm mb-2 line-clamp-3">{reel.caption}</p>
            )}
            {reel.hashtags && (
              <p className="text-[#39ff14]/70 text-xs mb-3">{reel.hashtags}</p>
            )}
          </>
        )}

        {reel.target_platforms?.length > 0 && (
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {reel.target_platforms.map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 bg-white/5 border border-gray-700 rounded text-xs text-gray-400"
              >
                {p}
              </span>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-600 mb-4">
          {new Date(reel.created_at).toLocaleDateString()}
        </div>

        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={handleSaveCaption}
                disabled={loading}
                className="flex-1 bg-[#39ff14] text-black text-xs font-semibold py-2 rounded-lg hover:bg-[#32e012] transition-colors disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 bg-white/5 text-gray-400 text-xs font-semibold py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {reel.status === "pending_review" && (
                <button
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex-1 bg-[#39ff14] text-black text-xs font-semibold py-2 rounded-lg hover:bg-[#32e012] transition-colors disabled:opacity-50"
                >
                  Approve
                </button>
              )}
              <button
                onClick={() => setEditing(true)}
                className="flex-1 bg-white/5 text-gray-300 text-xs font-semibold py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                Edit Caption
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-500/10 text-red-400 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
