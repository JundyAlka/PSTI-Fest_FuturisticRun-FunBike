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
  nik TEXT,
  gender TEXT NOT NULL,
  birth_place TEXT NOT NULL,
  birth_date DATE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  category TEXT NOT NULL,
  jersey_size TEXT NOT NULL CHECK (jersey_size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL')),
  bib_name TEXT NOT NULL,
  emergency_contact_name TEXT NOT NULL,
  emergency_contact_phone TEXT NOT NULL,
  blood_type TEXT,
  medical_history TEXT,
  running_club TEXT,
  bike_type TEXT,
  payment_method TEXT NOT NULL DEFAULT 'transfer',
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'rejected')),
  payment_amount INTEGER,
  payment_proof TEXT,
  payment_proof_key TEXT,
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
  ('futuristic-run', 'Futuristic Run',  'futuristic', true, NULL, 'Alun-Alun Purworejo', '2026-06-14'),
  ('fun-bike',       'Futuristic Bike', 'sunrise',    true, NULL,          NULL,                      NULL)
ON CONFLICT (slug) DO NOTHING;

-- Seed event categories
INSERT INTO event_categories (event_type, code, label, price, quota, min_age) VALUES
  ('futuristic-run', '5K',      'Run 5K',       200000, 200, 13),
  ('fun-bike',       'funbike', 'Futuristic Bike Ride', 150000, 300, 10)
ON CONFLICT (event_type, code) DO NOTHING;

-- Seed event settings
INSERT INTO event_settings (event_type, key, value) VALUES
  ('futuristic-run', 'registration_open', 'true'),
  ('futuristic-run', 'registration_fee', '200000'),
  ('futuristic-run', 'event_date', ''),
  ('futuristic-run', 'event_location', 'Alun-Alun Purworejo'),
  ('futuristic-run', 'location_lat', '-7.7130878'),
  ('futuristic-run', 'location_lng', '110.0090583'),
  ('futuristic-run', 'location_plus_code', '72P5+QJ'),
  ('futuristic-run', 'early_bird_deadline', '2026-05-31'),
  ('futuristic-run', 'registration_deadline', '2026-06-14'),
  ('futuristic-run', 'quota_5k', '200'),
  ('futuristic-run', 'payment_bank_name', 'BRI'),
  ('futuristic-run', 'payment_bank_account', ''),
  ('futuristic-run', 'payment_bank_holder', 'Himatekno UMP'),
  ('futuristic-run', 'payment_qris_nmid', ''),
  ('futuristic-run', 'payment_qris_image_url', ''),
  ('futuristic-run', 'payment_qris_image_key', ''),
  ('futuristic-run', 'payment_transfer_enabled', 'true'),
  ('futuristic-run', 'payment_qris_enabled', 'true'),
  ('futuristic-run', 'benefit_prize_details', ''),
  ('futuristic-run', 'benefit_race_pack_contents', ''),
  ('futuristic-run', 'prize_umum_1', ''),
  ('futuristic-run', 'prize_umum_2', ''),
  ('futuristic-run', 'prize_umum_3', ''),
  ('futuristic-run', 'prize_pelajar_1', ''),
  ('futuristic-run', 'prize_pelajar_2', ''),
  ('futuristic-run', 'prize_pelajar_3', ''),
  ('fun-bike', 'registration_open', 'true'),
  ('fun-bike', 'registration_fee', '150000'),
  ('fun-bike', 'event_date', ''),
  ('fun-bike', 'event_location', ''),
  ('fun-bike', 'early_bird_deadline', ''),
  ('fun-bike', 'registration_deadline', ''),
  ('fun-bike', 'quota_funbike', '300'),
  ('fun-bike', 'payment_bank_name', 'BRI'),
  ('fun-bike', 'payment_bank_account', ''),
  ('fun-bike', 'payment_bank_holder', 'Himatekno UMP'),
  ('fun-bike', 'payment_qris_nmid', ''),
  ('fun-bike', 'payment_qris_image_url', ''),
  ('fun-bike', 'payment_qris_image_key', ''),
  ('fun-bike', 'payment_transfer_enabled', 'true'),
  ('fun-bike', 'payment_qris_enabled', 'true')
ON CONFLICT (event_type, key) DO NOTHING;

-- Schema sync for existing InsForge databases.
ALTER TABLE participants ADD COLUMN IF NOT EXISTS bike_type TEXT;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS medical_history TEXT;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS running_club TEXT;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS payment_proof_key TEXT;
UPDATE participants
SET bike_type = running_club
WHERE event_type = 'fun-bike'
  AND bike_type IS NULL
  AND running_club IS NOT NULL;

ALTER TABLE participants ALTER COLUMN nik DROP NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'participants_jersey_size_check'
      AND conrelid = 'participants'::regclass
  ) THEN
    ALTER TABLE participants DROP CONSTRAINT participants_jersey_size_check;
  END IF;
END $$;

ALTER TABLE participants
  ADD CONSTRAINT participants_jersey_size_check
  CHECK (jersey_size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'));

CREATE SEQUENCE IF NOT EXISTS registration_futuristic_run_seq;
CREATE SEQUENCE IF NOT EXISTS registration_fun_bike_seq;

CREATE OR REPLACE FUNCTION next_registration_number(p_event_type TEXT)
RETURNS TEXT AS $$
DECLARE
  seq_value BIGINT;
  prefix TEXT;
BEGIN
  IF p_event_type = 'fun-bike' THEN
    seq_value := nextval('registration_fun_bike_seq');
    prefix := 'FB2026';
  ELSE
    seq_value := nextval('registration_futuristic_run_seq');
    prefix := 'FR2026';
  END IF;

  RETURN prefix || '-' || LPAD(seq_value::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION register_participant_atomic(payload JSONB)
RETURNS TABLE(reg_number TEXT, id INTEGER) AS $$
DECLARE
  next_reg TEXT;
  inserted_id INTEGER;
BEGIN
  next_reg := next_registration_number(COALESCE(payload->>'event_type', 'futuristic-run'));

  INSERT INTO participants (
    reg_number,
    event_type,
    full_name,
    nik,
    gender,
    birth_place,
    birth_date,
    phone,
    email,
    address,
    city,
    province,
    category,
    jersey_size,
    bib_name,
    emergency_contact_name,
    emergency_contact_phone,
    blood_type,
    medical_history,
    running_club,
    bike_type,
    payment_method,
    payment_status,
    payment_amount,
    status
  ) VALUES (
    next_reg,
    COALESCE(payload->>'event_type', 'futuristic-run'),
    payload->>'full_name',
    NULLIF(payload->>'nik', ''),
    payload->>'gender',
    payload->>'birth_place',
    (payload->>'birth_date')::DATE,
    payload->>'phone',
    payload->>'email',
    payload->>'address',
    payload->>'city',
    payload->>'province',
    payload->>'category',
    payload->>'jersey_size',
    payload->>'bib_name',
    NULLIF(payload->>'emergency_contact_name', ''),
    NULLIF(payload->>'emergency_contact_phone', ''),
    NULLIF(payload->>'blood_type', ''),
    NULLIF(payload->>'medical_history', ''),
    NULLIF(payload->>'running_club', ''),
    NULLIF(payload->>'bike_type', ''),
    payload->>'payment_method',
    'pending',
    (payload->>'payment_amount')::INTEGER,
    'registered'
  )
  RETURNING participants.id INTO inserted_id;

  RETURN QUERY SELECT next_reg, inserted_id;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  entity TEXT NOT NULL,
  entity_id INTEGER,
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  meta JSONB,
  page_url TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
