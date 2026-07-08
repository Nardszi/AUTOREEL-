"use client";

import Sidebar from "@/components/Sidebar";

interface Metric {
  id: number;
  platform: string;
  views: number;
  likes: number;
  comments: number;
  fetched_at: string;
  reel_id: number;
  caption_snippet: string | null;
  video_url: string | null;
}

export default function AnalyticsClient({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-gray-500 text-sm mt-1">
              Post performance across platforms
            </p>
          </div>

          {metrics.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-600 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-500">No metrics data yet. Data will populate after n8n sends performance data.</p>
            </div>
          ) : (
            <div className="bg-[#12121a] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Video
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Likes
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Comments
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Fetched At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {metrics.map((m) => (
                      <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                              {m.video_url ? (
                                <video
                                  src={m.video_url}
                                  className="w-full h-full object-cover"
                                  preload="metadata"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-gray-300 line-clamp-2 max-w-[200px]">
                              {m.caption_snippet || "No caption"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-white/5 border border-gray-700 rounded text-xs text-gray-400 capitalize">
                            {m.platform}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-white">
                          {m.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-300">
                          {m.likes.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-300">
                          {m.comments.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-gray-500">
                          {new Date(m.fetched_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
