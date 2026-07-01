CREATE TABLE IF NOT EXISTS public.activity_logs (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actor_type TEXT NOT NULL DEFAULT 'system',
  actor_label TEXT,
  event_type TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  page_url TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX IF NOT EXISTS activity_logs_created_at_idx
  ON public.activity_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS activity_logs_event_action_idx
  ON public.activity_logs (event_type, action, created_at DESC);

CREATE TABLE IF NOT EXISTS public.visitor_sessions (
  session_id TEXT PRIMARY KEY,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_type TEXT,
  current_path TEXT,
  referrer TEXT,
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  registered BOOLEAN NOT NULL DEFAULT FALSE,
  registration_number TEXT,
  page_views INTEGER NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX IF NOT EXISTS visitor_sessions_last_seen_idx
  ON public.visitor_sessions (last_seen_at DESC);

CREATE INDEX IF NOT EXISTS visitor_sessions_event_registered_idx
  ON public.visitor_sessions (event_type, registered, last_seen_at DESC);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_sessions FORCE ROW LEVEL SECURITY;
