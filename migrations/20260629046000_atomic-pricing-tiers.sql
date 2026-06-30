CREATE TABLE public.pricing_tiers (
  event_type TEXT NOT NULL REFERENCES public.events(slug) ON DELETE CASCADE,
  id TEXT NOT NULL,
  label TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  quota INTEGER NOT NULL CHECK (quota >= 0),
  sort_order INTEGER NOT NULL CHECK (sort_order > 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (event_type, id),
  UNIQUE (event_type, sort_order)
);

CREATE INDEX pricing_tiers_event_order_idx
  ON public.pricing_tiers(event_type, active, sort_order);

ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers FORCE ROW LEVEL SECURITY;

ALTER TABLE public.participants
  ADD COLUMN price INTEGER,
  ADD COLUMN pricing_tier_id TEXT;

UPDATE public.participants SET price = payment_amount WHERE price IS NULL;
ALTER TABLE public.participants ALTER COLUMN price SET NOT NULL;

INSERT INTO public.pricing_tiers (event_type, id, label, price, quota, sort_order, active)
SELECT 'futuristic-run', 'presale1', 'Presale 1', 120000, 100, 1, TRUE
UNION ALL
SELECT 'futuristic-run', 'normal', 'Normal', 135000, GREATEST(quota - 100, 0), 2, TRUE
FROM public.event_categories WHERE event_type = 'futuristic-run' AND code = '5K'
UNION ALL
SELECT 'fun-bike', 'normal', 'Normal', price, quota, 1, TRUE
FROM public.event_categories WHERE event_type = 'fun-bike' AND code = 'funbike';

UPDATE public.event_categories SET price = 120000, updated_at = NOW()
WHERE event_type = 'futuristic-run' AND code = '5K';

UPDATE public.event_settings SET value = '120000', updated_at = NOW()
WHERE event_type = 'futuristic-run' AND key = 'registration_fee';

CREATE FUNCTION public.get_current_pricing_v1(p_event_type TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  participant_count INTEGER;
  current_tier RECORD;
  presale_tier RECORD;
  normal_price INTEGER;
BEGIN
  SELECT COUNT(*) INTO participant_count
  FROM public.participants
  WHERE event_type = p_event_type AND payment_status <> 'rejected';

  WITH ordered AS (
    SELECT t.*, SUM(t.quota) OVER (ORDER BY t.sort_order) AS cumulative_quota
    FROM public.pricing_tiers t
    WHERE t.event_type = p_event_type AND t.active
  )
  SELECT * INTO current_tier
  FROM ordered
  WHERE participant_count < cumulative_quota
  ORDER BY sort_order
  LIMIT 1;

  SELECT * INTO presale_tier FROM public.pricing_tiers
  WHERE event_type = p_event_type AND id = 'presale1';

  SELECT price INTO normal_price FROM public.pricing_tiers
  WHERE event_type = p_event_type AND id = 'normal';

  RETURN JSONB_BUILD_OBJECT(
    'currentTier', CASE WHEN current_tier.id IS NULL THEN NULL ELSE JSONB_BUILD_OBJECT(
      'id', current_tier.id, 'label', current_tier.label, 'price', current_tier.price,
      'quota', current_tier.quota, 'order', current_tier.sort_order, 'active', current_tier.active
    ) END,
    'currentPrice', current_tier.price,
    'presaleRemaining', CASE
      WHEN presale_tier.id IS NULL OR NOT presale_tier.active THEN 0
      ELSE GREATEST(presale_tier.quota - participant_count, 0)
    END,
    'presaleQuota', COALESCE(presale_tier.quota, 0),
    'normalPrice', normal_price,
    'registeredCount', participant_count,
    'tiers', COALESCE((
      SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
        'id', t.id, 'label', t.label, 'price', t.price, 'quota', t.quota,
        'order', t.sort_order, 'active', t.active
      ) ORDER BY t.sort_order)
      FROM public.pricing_tiers t WHERE t.event_type = p_event_type
    ), '[]'::JSONB)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_current_pricing_v1(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_current_pricing_v1(TEXT) TO anon, authenticated;

CREATE FUNCTION public.save_pricing_tiers_atomic_v1(p_event_type TEXT, p_tiers JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  item JSONB;
  tier_count INTEGER := 0;
  category_quota INTEGER;
  active_quota INTEGER;
BEGIN
  IF p_event_type NOT IN ('futuristic-run', 'fun-bike') OR JSONB_TYPEOF(p_tiers) <> 'array' THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'PRICING_PAYLOAD_INVALID';
  END IF;

  SELECT quota INTO category_quota FROM public.event_categories
  WHERE event_type = p_event_type ORDER BY id LIMIT 1 FOR UPDATE;

  FOR item IN SELECT value FROM JSONB_ARRAY_ELEMENTS(p_tiers)
  LOOP
    IF NULLIF(BTRIM(item->>'id'), '') IS NULL
       OR NULLIF(BTRIM(item->>'label'), '') IS NULL
       OR (item->>'price')::INTEGER <= 0
       OR (item->>'quota')::INTEGER < 0
       OR (item->>'order')::INTEGER <= 0 THEN
      RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'PRICING_TIER_INVALID';
    END IF;

    INSERT INTO public.pricing_tiers (event_type, id, label, price, quota, sort_order, active, updated_at)
    VALUES (
      p_event_type, item->>'id', item->>'label', (item->>'price')::INTEGER,
      (item->>'quota')::INTEGER, (item->>'order')::INTEGER,
      COALESCE((item->>'active')::BOOLEAN, TRUE), NOW()
    )
    ON CONFLICT (event_type, id) DO UPDATE SET
      label = EXCLUDED.label, price = EXCLUDED.price, quota = EXCLUDED.quota,
      sort_order = EXCLUDED.sort_order, active = EXCLUDED.active, updated_at = NOW();
    tier_count := tier_count + 1;
  END LOOP;

  SELECT COALESCE(SUM(quota), 0) INTO active_quota FROM public.pricing_tiers
  WHERE event_type = p_event_type AND active;
  IF active_quota < category_quota THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'PRICING_QUOTA_TOO_LOW';
  END IF;

  RETURN tier_count;
EXCEPTION WHEN invalid_text_representation THEN
  RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'PRICING_TIER_INVALID';
END;
$$;

REVOKE ALL ON FUNCTION public.save_pricing_tiers_atomic_v1(TEXT, JSONB) FROM PUBLIC;

CREATE FUNCTION public.register_participant_atomic_v3(payload JSONB)
RETURNS TABLE(reg_number TEXT, id INTEGER, price INTEGER, pricing_tier_id TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  selected_event_type TEXT := COALESCE(payload->>'event_type', 'futuristic-run');
  selected_category TEXT := payload->>'category';
  selected_nik TEXT := NULLIF(payload->>'nik', '');
  selected_payment_method TEXT := payload->>'payment_method';
  category_quota INTEGER; category_min_age INTEGER; active_participants INTEGER;
  registration_open TEXT; registration_deadline TEXT; event_is_open BOOLEAN; event_deadline DATE;
  payment_enabled TEXT; generated_reg_number TEXT; inserted_id INTEGER; participant_age INTEGER;
  selected_price INTEGER; selected_tier_id TEXT;
BEGIN
  SELECT quota, min_age INTO category_quota, category_min_age
  FROM public.event_categories
  WHERE event_type = selected_event_type AND code = selected_category
  FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_CATEGORY_INVALID'; END IF;

  SELECT is_open, deadline INTO event_is_open, event_deadline FROM public.events WHERE slug = selected_event_type;
  SELECT value INTO registration_open FROM public.event_settings WHERE event_type = selected_event_type AND key = 'registration_open';
  SELECT value INTO registration_deadline FROM public.event_settings WHERE event_type = selected_event_type AND key = 'registration_deadline';
  IF event_is_open IS NOT TRUE OR registration_open IS DISTINCT FROM 'true' THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_CLOSED';
  END IF;
  IF (event_deadline IS NOT NULL AND CURRENT_DATE > event_deadline)
     OR (registration_deadline ~ '^\d{4}-\d{2}-\d{2}' AND NOW() > registration_deadline::TIMESTAMPTZ) THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_DEADLINE';
  END IF;
  IF category_min_age IS NOT NULL THEN
    participant_age := DATE_PART('year', AGE(CURRENT_DATE, (payload->>'birth_date')::DATE));
    IF participant_age < category_min_age THEN RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_AGE_INVALID'; END IF;
  END IF;
  IF selected_payment_method NOT IN ('transfer', 'qris') THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_PAYMENT_DISABLED';
  END IF;
  SELECT value INTO payment_enabled FROM public.event_settings
  WHERE event_type = selected_event_type AND key = CASE selected_payment_method WHEN 'transfer' THEN 'payment_transfer_enabled' ELSE 'payment_qris_enabled' END;
  IF payment_enabled = 'false' THEN RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_PAYMENT_DISABLED'; END IF;
  IF selected_nik IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.participants WHERE event_type = selected_event_type AND nik = selected_nik AND payment_status <> 'rejected'
  ) THEN RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_DUPLICATE'; END IF;

  SELECT COUNT(*) INTO active_participants FROM public.participants
  WHERE event_type = selected_event_type AND payment_status <> 'rejected';
  IF active_participants >= category_quota THEN RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_QUOTA_FULL'; END IF;

  WITH ordered AS (
    SELECT t.*, SUM(t.quota) OVER (ORDER BY t.sort_order) AS cumulative_quota
    FROM public.pricing_tiers t WHERE t.event_type = selected_event_type AND t.active
  )
  SELECT tier.price, tier.id INTO selected_price, selected_tier_id
  FROM ordered tier WHERE active_participants < tier.cumulative_quota ORDER BY tier.sort_order LIMIT 1;
  IF selected_price IS NULL THEN RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_PRICING_UNAVAILABLE'; END IF;

  generated_reg_number := public.next_registration_number(selected_event_type);
  INSERT INTO public.participants (
    reg_number, event_type, full_name, nik, gender, birth_place, birth_date, phone, email,
    address, city, province, category, jersey_size, bib_name, emergency_contact_name,
    emergency_contact_phone, blood_type, medical_history, running_club, bike_type,
    payment_method, payment_status, payment_amount, price, pricing_tier_id, status
  ) VALUES (
    generated_reg_number, selected_event_type, payload->>'full_name', selected_nik, payload->>'gender',
    payload->>'birth_place', (payload->>'birth_date')::DATE, payload->>'phone', payload->>'email',
    payload->>'address', payload->>'city', payload->>'province', selected_category, payload->>'jersey_size',
    payload->>'bib_name', payload->>'emergency_contact_name', payload->>'emergency_contact_phone',
    NULLIF(payload->>'blood_type', ''), NULLIF(payload->>'medical_history', ''),
    NULLIF(payload->>'running_club', ''), NULLIF(payload->>'bike_type', ''), selected_payment_method,
    'pending', selected_price, selected_price, selected_tier_id, 'registered'
  ) RETURNING participants.id INTO inserted_id;

  RETURN QUERY SELECT generated_reg_number, inserted_id, selected_price, selected_tier_id;
EXCEPTION WHEN unique_violation THEN
  IF selected_nik IS NOT NULL THEN RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_DUPLICATE'; END IF;
  RAISE;
END;
$$;

REVOKE ALL ON FUNCTION public.register_participant_atomic_v3(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_participant_atomic_v3(JSONB) TO anon, authenticated;
