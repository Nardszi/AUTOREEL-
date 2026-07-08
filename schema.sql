CREATE TABLE reels (
  id SERIAL PRIMARY KEY,
  script_text TEXT,
  caption TEXT,
  hashtags TEXT,
  video_url TEXT,
  status VARCHAR(20) DEFAULT 'pending_review',
  buffer_post_id VARCHAR(100),
  target_platforms TEXT[],
  scheduled_at TIMESTAMP,
  posted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE post_metrics (
  id SERIAL PRIMARY KEY,
  reel_id INTEGER REFERENCES reels(id) ON DELETE CASCADE,
  platform VARCHAR(20),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  fetched_at TIMESTAMP DEFAULT NOW()
);
