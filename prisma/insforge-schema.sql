-- FuturisticRUN + Multi-Event Database Schema for InsForge (PostgreSQL)

-- Events table
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

-- Event categories table
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

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY,
  reg_number TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'futuristic-run',
  full_name TEXT NOT NULL,
  nik TEXT NOT NULL,
  gender TEXT NOT NULL,
  birth_place TEXT NOT NULL,
  birth_date DATE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  category TEXT NOT NULL,
  jersey_size TEXT NOT NULL CHECK (jersey_size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL')),
  bib_name TEXT NOT NULL,
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  blood_type TEXT,
  payment_method TEXT NOT NULL DEFAULT 'transfer',
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'rejected')),
  payment_amount INTEGER,
  payment_proof TEXT,
  status TEXT NOT NULL DEFAULT 'registered',
  bib_number INTEGER,
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event settings table (scoped per event)
CREATE TABLE IF NOT EXISTS event_settings (
  id SERIAL PRIMARY KEY,
  event_type TEXT,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_type, key)
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed events
INSERT INTO events (slug, name, theme, is_open, event_date, location, deadline) VALUES
  ('futuristic-run', 'Futuristic RUN 2026', 'futuristic', true, '2026-06-22', 'Purworejo, Jawa Tengah', '2026-06-14'),
  ('fun-bike',        'Fun Bike 2026',       'sunrise',    true, NULL,          NULL,                      NULL)
ON CONFLICT (slug) DO NOTHING;

-- Seed event categories
INSERT INTO event_categories (event_type, code, label, price, quota, min_age) VALUES
  ('futuristic-run', '5K',      'Run 5K',       200000, 200, 13),
  ('fun-bike',       'funbike', 'Fun Bike Ride', 150000, 300, 10)
ON CONFLICT (event_type, code) DO NOTHING;

-- Seed event settings
INSERT INTO event_settings (event_type, key, value) VALUES
  ('futuristic-run', 'registration_open', 'true'),
  ('futuristic-run', 'registration_fee', '200000'),
  ('futuristic-run', 'event_date', '2026-06-22'),
  ('futuristic-run', 'event_location', 'Purworejo, Jawa Tengah'),
  ('futuristic-run', 'early_bird_deadline', '2026-05-31'),
  ('futuristic-run', 'registration_deadline', '2026-06-14')
ON CONFLICT (event_type, key) DO NOTHING;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_participants_updated_at ON participants;
CREATE TRIGGER update_participants_updated_at
  BEFORE UPDATE ON participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_categories_updated_at ON event_categories;
CREATE TRIGGER update_event_categories_updated_at
  BEFORE UPDATE ON event_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_participants_reg_number ON participants(reg_number);
CREATE INDEX IF NOT EXISTS idx_participants_event_type ON participants(event_type);
CREATE INDEX IF NOT EXISTS idx_participants_category ON participants(category);
CREATE INDEX IF NOT EXISTS idx_participants_payment_status ON participants(payment_status);
CREATE INDEX IF NOT EXISTS idx_participants_created_at ON participants(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_participants_email ON participants(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_event_categories_event_type ON event_categories(event_type);
CREATE INDEX IF NOT EXISTS idx_event_settings_event_type ON event_settings(event_type);
