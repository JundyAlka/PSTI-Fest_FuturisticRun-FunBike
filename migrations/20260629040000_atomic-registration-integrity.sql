-- Serialize quota checks and identifier allocation inside one database transaction.

CREATE UNIQUE INDEX IF NOT EXISTS participants_active_event_nik_unique
  ON public.participants (event_type, nik)
  WHERE nik IS NOT NULL AND nik <> '' AND payment_status <> 'rejected';

CREATE UNIQUE INDEX IF NOT EXISTS participants_bib_number_unique
  ON public.participants (bib_number)
  WHERE bib_number IS NOT NULL;

CREATE FUNCTION public.register_participant_atomic_v2(payload JSONB)
RETURNS TABLE(reg_number TEXT, id INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  selected_event_type TEXT := COALESCE(payload->>'event_type', 'futuristic-run');
  selected_category TEXT := payload->>'category';
  selected_nik TEXT := NULLIF(payload->>'nik', '');
  selected_payment_method TEXT := payload->>'payment_method';
  category_quota INTEGER;
  category_price INTEGER;
  category_min_age INTEGER;
  active_participants INTEGER;
  registration_open TEXT;
  registration_deadline TEXT;
  event_is_open BOOLEAN;
  event_deadline DATE;
  payment_enabled TEXT;
  generated_reg_number TEXT;
  inserted_id INTEGER;
  participant_age INTEGER;
BEGIN
  IF selected_event_type NOT IN ('futuristic-run', 'fun-bike') THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_CATEGORY_INVALID';
  END IF;

  -- The row lock serializes all registration attempts for the same event/category.
  SELECT quota, price, min_age
    INTO category_quota, category_price, category_min_age
  FROM public.event_categories
  WHERE event_type = selected_event_type AND code = selected_category
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_CATEGORY_INVALID';
  END IF;

  SELECT is_open, deadline
    INTO event_is_open, event_deadline
  FROM public.events
  WHERE slug = selected_event_type;

  SELECT value INTO registration_open
  FROM public.event_settings
  WHERE event_type = selected_event_type AND key = 'registration_open';

  SELECT value INTO registration_deadline
  FROM public.event_settings
  WHERE event_type = selected_event_type AND key = 'registration_deadline';

  IF event_is_open IS NOT TRUE OR registration_open IS DISTINCT FROM 'true' THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_CLOSED';
  END IF;

  IF event_deadline IS NOT NULL AND CURRENT_DATE > event_deadline THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_DEADLINE';
  END IF;

  IF registration_deadline ~ '^\d{4}-\d{2}-\d{2}'
     AND NOW() > registration_deadline::TIMESTAMPTZ THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_DEADLINE';
  END IF;

  IF category_min_age IS NOT NULL THEN
    participant_age := DATE_PART('year', AGE(CURRENT_DATE, (payload->>'birth_date')::DATE));
    IF participant_age < category_min_age THEN
      RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_AGE_INVALID';
    END IF;
  END IF;

  IF selected_payment_method NOT IN ('transfer', 'qris') THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_PAYMENT_DISABLED';
  END IF;

  SELECT value INTO payment_enabled
  FROM public.event_settings
  WHERE event_type = selected_event_type
    AND key = CASE selected_payment_method
      WHEN 'transfer' THEN 'payment_transfer_enabled'
      ELSE 'payment_qris_enabled'
    END;

  IF payment_enabled = 'false' THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_PAYMENT_DISABLED';
  END IF;

  IF selected_nik IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.participants
    WHERE event_type = selected_event_type
      AND nik = selected_nik
      AND payment_status <> 'rejected'
  ) THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_DUPLICATE';
  END IF;

  SELECT COUNT(*) INTO active_participants
  FROM public.participants
  WHERE event_type = selected_event_type
    AND category = selected_category
    AND payment_status <> 'rejected';

  IF active_participants >= category_quota THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_QUOTA_FULL';
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
    selected_nik,
    payload->>'gender',
    payload->>'birth_place',
    (payload->>'birth_date')::DATE,
    payload->>'phone',
    payload->>'email',
    payload->>'address',
    payload->>'city',
    payload->>'province',
    selected_category,
    payload->>'jersey_size',
    payload->>'bib_name',
    payload->>'emergency_contact_name',
    payload->>'emergency_contact_phone',
    NULLIF(payload->>'blood_type', ''),
    NULLIF(payload->>'medical_history', ''),
    NULLIF(payload->>'running_club', ''),
    NULLIF(payload->>'bike_type', ''),
    selected_payment_method,
    'pending',
    category_price,
    'registered'
  )
  RETURNING participants.id INTO inserted_id;

  RETURN QUERY SELECT generated_reg_number, inserted_id;
EXCEPTION
  WHEN unique_violation THEN
    IF selected_nik IS NOT NULL THEN
      RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_DUPLICATE';
    END IF;
    RAISE;
END;
$$;

REVOKE ALL ON FUNCTION public.register_participant_atomic_v2(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_participant_atomic_v2(JSONB) TO anon, authenticated;
