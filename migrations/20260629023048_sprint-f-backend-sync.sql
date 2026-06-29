-- Sprint F: align the production InsForge schema with the application.
-- This migration is additive and preserves existing participant/settings rows.

ALTER TABLE public.participants
  ADD COLUMN IF NOT EXISTS medical_history TEXT,
  ADD COLUMN IF NOT EXISTS running_club TEXT,
  ADD COLUMN IF NOT EXISTS bike_type TEXT,
  ADD COLUMN IF NOT EXISTS payment_proof_key TEXT;

ALTER TABLE public.participants ALTER COLUMN nik DROP NOT NULL;

UPDATE public.participants
SET bike_type = running_club
WHERE event_type = 'fun-bike'
  AND bike_type IS NULL
  AND running_club IS NOT NULL;

UPDATE public.participants
SET payment_amount = COALESCE(payment_amount, 0)
WHERE payment_amount IS NULL;

ALTER TABLE public.participants ALTER COLUMN payment_amount SET NOT NULL;

ALTER TABLE public.participants
  DROP CONSTRAINT IF EXISTS participants_jersey_size_check;

ALTER TABLE public.participants
  ADD CONSTRAINT participants_jersey_size_check
  CHECK (jersey_size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'));

UPDATE public.events
SET name = CASE slug
  WHEN 'futuristic-run' THEN 'Futuristic Run'
  WHEN 'fun-bike' THEN 'Futuristic Bike'
  ELSE name
END
WHERE slug IN ('futuristic-run', 'fun-bike');

UPDATE public.event_categories
SET label = CASE event_type
  WHEN 'futuristic-run' THEN 'Run 5K'
  WHEN 'fun-bike' THEN 'Fun Ride'
  ELSE label
END
WHERE (event_type = 'futuristic-run' AND code = '5K')
   OR (event_type = 'fun-bike' AND code = 'funbike');

INSERT INTO public.event_settings (event_type, key, value) VALUES
  ('futuristic-run', 'registration_open', 'true'),
  ('futuristic-run', 'registration_fee', '200000'),
  ('futuristic-run', 'event_date', ''),
  ('futuristic-run', 'event_location', ''),
  ('futuristic-run', 'registration_deadline', ''),
  ('futuristic-run', 'quota_5k', '200'),
  ('futuristic-run', 'payment_bank_name', 'BRI'),
  ('futuristic-run', 'payment_bank_account', ''),
  ('futuristic-run', 'payment_bank_holder', 'Himatekno UMP'),
  ('futuristic-run', 'payment_qris_nmid', ''),
  ('futuristic-run', 'payment_qris_image_url', ''),
  ('futuristic-run', 'payment_qris_image_key', ''),
  ('futuristic-run', 'payment_transfer_enabled', 'true'),
  ('futuristic-run', 'payment_qris_enabled', 'true'),
  ('futuristic-run', 'contact_person', ''),
  ('fun-bike', 'registration_open', 'true'),
  ('fun-bike', 'registration_fee', '150000'),
  ('fun-bike', 'event_date', ''),
  ('fun-bike', 'event_location', ''),
  ('fun-bike', 'registration_deadline', ''),
  ('fun-bike', 'quota_funbike', '300'),
  ('fun-bike', 'payment_bank_name', 'BRI'),
  ('fun-bike', 'payment_bank_account', ''),
  ('fun-bike', 'payment_bank_holder', 'Himatekno UMP'),
  ('fun-bike', 'payment_qris_nmid', ''),
  ('fun-bike', 'payment_qris_image_url', ''),
  ('fun-bike', 'payment_qris_image_key', ''),
  ('fun-bike', 'payment_transfer_enabled', 'true'),
  ('fun-bike', 'payment_qris_enabled', 'true'),
  ('fun-bike', 'contact_person', '')
ON CONFLICT (event_type, key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  entity TEXT NOT NULL,
  entity_id INTEGER,
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  meta JSONB,
  page_url TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity
  ON public.audit_logs(entity, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type
  ON public.analytics_events(event_type, created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events FORCE ROW LEVEL SECURITY;

CREATE SEQUENCE IF NOT EXISTS public.registration_futuristic_run_seq;
CREATE SEQUENCE IF NOT EXISTS public.registration_fun_bike_seq;

DO $$
DECLARE
  max_run BIGINT;
  max_bike BIGINT;
BEGIN
  SELECT COALESCE(MAX(substring(reg_number FROM '^FR2026-([0-9]+)$')::BIGINT), 0)
    INTO max_run
  FROM public.participants
  WHERE reg_number ~ '^FR2026-[0-9]+$';

  SELECT COALESCE(MAX(substring(reg_number FROM '^FB2026-([0-9]+)$')::BIGINT), 0)
    INTO max_bike
  FROM public.participants
  WHERE reg_number ~ '^FB2026-[0-9]+$';

  IF max_run = 0 THEN
    PERFORM setval('public.registration_futuristic_run_seq', 1, false);
  ELSE
    PERFORM setval('public.registration_futuristic_run_seq', max_run, true);
  END IF;

  IF max_bike = 0 THEN
    PERFORM setval('public.registration_fun_bike_seq', 1, false);
  ELSE
    PERFORM setval('public.registration_fun_bike_seq', max_bike, true);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.next_registration_number(p_event_type TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  sequence_value BIGINT;
BEGIN
  IF p_event_type = 'futuristic-run' THEN
    sequence_value := nextval('public.registration_futuristic_run_seq');
    RETURN 'FR2026-' || LPAD(sequence_value::TEXT, 4, '0');
  ELSIF p_event_type = 'fun-bike' THEN
    sequence_value := nextval('public.registration_fun_bike_seq');
    RETURN 'FB2026-' || LPAD(sequence_value::TEXT, 4, '0');
  END IF;

  RAISE EXCEPTION 'Unsupported event type';
END;
$$;

CREATE OR REPLACE FUNCTION public.register_participant_atomic(payload JSONB)
RETURNS TABLE(reg_number TEXT, id INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  generated_reg_number TEXT;
  inserted_id INTEGER;
  selected_event_type TEXT := COALESCE(payload->>'event_type', 'futuristic-run');
BEGIN
  IF selected_event_type NOT IN ('futuristic-run', 'fun-bike') THEN
    RAISE EXCEPTION 'Unsupported event type';
  END IF;

  generated_reg_number := public.next_registration_number(selected_event_type);

  INSERT INTO public.participants (
    reg_number, event_type, full_name, nik, gender, birth_place, birth_date,
    phone, email, address, city, province, category, jersey_size, bib_name,
    emergency_contact_name, emergency_contact_phone, blood_type,
    medical_history, running_club, bike_type, payment_method,
    payment_status, payment_amount, status
  ) VALUES (
    generated_reg_number,
    selected_event_type,
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
    payload->>'emergency_contact_name',
    payload->>'emergency_contact_phone',
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

  RETURN QUERY SELECT generated_reg_number, inserted_id;
END;
$$;

REVOKE ALL ON FUNCTION public.register_participant_atomic(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_participant_atomic(JSONB) TO anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_participants_event_category_status
  ON public.participants(event_type, category, payment_status);
