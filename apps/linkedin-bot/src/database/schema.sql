-- LinkedIn Content Assistant Database Schema

-- Posts table: Track all content
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_url TEXT UNIQUE,
    post_text TEXT NOT NULL,
    post_type TEXT,
    hook_formula TEXT,

    -- Status tracking
    status TEXT DEFAULT 'draft',
    humanization_score REAL,

    -- Performance metrics
    impressions INTEGER DEFAULT 0,
    engagement_rate REAL DEFAULT 0.0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    published_at TIMESTAMP,
    scheduled_for TIMESTAMP,
    metrics_updated_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API Usage table: Track rate limits
CREATE TABLE IF NOT EXISTS api_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL UNIQUE,
    request_count INTEGER DEFAULT 0,
    remaining_quota INTEGER DEFAULT 150,
    last_reset TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Memory log table: Learning from outcomes
CREATE TABLE IF NOT EXISTS memory_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER REFERENCES posts(id),
    action_taken TEXT NOT NULL,
    outcome_metric TEXT,
    outcome_value REAL,
    reflection TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_hook_formula ON posts(hook_formula);
CREATE INDEX IF NOT EXISTS idx_api_usage_date ON api_usage(date);
