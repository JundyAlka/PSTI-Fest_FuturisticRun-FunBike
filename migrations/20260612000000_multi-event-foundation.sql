-- ============================================================================
-- Multi-Event Foundation Migration
-- Idempotent: safe to run multiple times
-- Date: 2026-06-12
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. CREATE events TABLE
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  theme TEXT,
  is_open BOOLEAN NOT NULL DEFAULT true,
  event_date DATE,
  location TEXT,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed events (idempotent via ON CONFLICT)
INSERT INTO events (slug, name, theme, is_open, event_date, location, deadline)
VALUES
  ('futuristic-run', 'Futuristic RUN 2026', 'futuristic', true, '2026-06-22', 'Purworejo, Jawa Tengah', '2026-06-14'),
  ('fun-bike',        'Fun Bike 2026',       'sunrise',    true, NULL,          NULL,                      NULL)
ON CONFLICT (slug) DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- 2. CREATE event_categories TABLE
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_categories (
  id SERIAL PRIMARY KEY,
  event_type TEXT NOT NULL REFERENCES events(slug),
  code TEXT NOT NULL,
  label TEXT NOT NULL,
  price INTEGER NOT NULL,
  quota INTEGER NOT NULL,
  min_age INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_type, code)
);

-- Seed categories (idempotent via ON CONFLICT)
INSERT INTO event_categories (event_type, code, label, price, quota, min_age)
VALUES
  ('futuristic-run', '5K',      'Run 5K',       200000, 200, 13),
  ('fun-bike',       'funbike', 'Fun Bike Ride', 150000, 300, 10)
ON CONFLICT (event_type, code) DO NOTHING;

-- ────────────────────────────────────────────────────────────────────────────
-- 3. ADD event_type COLUMN TO participants (idempotent)
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE participants ADD COLUMN IF NOT EXISTS event_type TEXT NOT NULL DEFAULT 'futuristic-run';

-- Update CHECK constraint on category to allow new categories
-- First drop old constraint if it exists, then add a broader one
ALTER TABLE participants DROP CONSTRAINT IF EXISTS participants_category_check;
-- No new CHECK constraint; category is validated at application level against event_categories

-- Backfill existing participants
UPDATE participants SET event_type = 'futuristic-run' WHERE event_type = 'futuristic-run';

-- ────────────────────────────────────────────────────────────────────────────
-- 4. ADD event_type COLUMN TO event_settings (idempotent)
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE event_settings ADD COLUMN IF NOT EXISTS event_type TEXT;

-- Backfill existing settings as 'futuristic-run'
UPDATE event_settings SET event_type = 'futuristic-run' WHERE event_type IS NULL;

-- Drop old unique constraint on key, add composite unique
ALTER TABLE event_settings DROP CONSTRAINT IF EXISTS event_settings_key_key;
ALTER TABLE event_settings DROP CONSTRAINT IF EXISTS event_settings_key_unique;
-- Use IF NOT EXISTS logic: add constraint only if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'event_settings_event_type_key_unique'
      AND table_name = 'event_settings'
  ) THEN
    ALTER TABLE event_settings
      ADD CONSTRAINT event_settings_event_type_key_unique UNIQUE(event_type, key);
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────────────────────
-- 5. INDEXES
-- ────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_participants_event_type ON participants(event_type);
CREATE INDEX IF NOT EXISTS idx_event_categories_event_type ON event_categories(event_type);
CREATE INDEX IF NOT EXISTS idx_event_settings_event_type ON event_settings(event_type);

-- ────────────────────────────────────────────────────────────────────────────
-- 6. UPDATED_AT TRIGGERS FOR NEW TABLES
-- ────────────────────────────────────────────────────────────────────────────
-- Reuse existing update_updated_at_column() function

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_categories_updated_at ON event_categories;
CREATE TRIGGER update_event_categories_updated_at
  BEFORE UPDATE ON event_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ────────────────────────────────────────────────────────────────────────────
-- 7. ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events FORCE ROW LEVEL SECURITY;

ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories FORCE ROW LEVEL SECURITY;

-- Public read policies
DROP POLICY IF EXISTS events_public_read ON events;
CREATE POLICY events_public_read ON events
  FOR SELECT USING (true);

DROP POLICY IF EXISTS event_categories_public_read ON event_categories;
CREATE POLICY event_categories_public_read ON event_categories
  FOR SELECT USING (true);

-- ────────────────────────────────────────────────────────────────────────────
-- DONE
-- ────────────────────────────────────────────────────────────────────────────
