-- Complete per-event payment settings and save them as one transaction.

INSERT INTO public.event_settings (event_type, key, value)
SELECT event_type, key, value
FROM (VALUES
  ('futuristic-run', 'payment_dana_enabled', 'false'),
  ('futuristic-run', 'payment_dana_number', ''),
  ('futuristic-run', 'payment_dana_holder', ''),
  ('futuristic-run', 'payment_qris_merchant_name', 'SYIFA FITRIYANTI'),
  ('futuristic-run', 'payment_instructions', 'Bayar sesuai nominal, simpan bukti pembayaran, lalu unggah bukti untuk diverifikasi panitia.'),
  ('futuristic-run', 'payment_deadline_hours', '24'),
  ('fun-bike', 'payment_dana_enabled', 'false'),
  ('fun-bike', 'payment_dana_number', ''),
  ('fun-bike', 'payment_dana_holder', ''),
  ('fun-bike', 'payment_qris_merchant_name', 'SYIFA FITRIYANTI'),
  ('fun-bike', 'payment_instructions', 'Bayar sesuai nominal, simpan bukti pembayaran, lalu unggah bukti untuk diverifikasi panitia.'),
  ('fun-bike', 'payment_deadline_hours', '24')
) AS defaults(event_type, key, value)
ON CONFLICT (event_type, key) DO NOTHING;

CREATE FUNCTION public.save_event_settings_atomic_v1(
  p_event_type TEXT,
  p_settings JSONB
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  current_settings JSONB;
  effective_settings JSONB;
  updated_count INTEGER;
  fee INTEGER;
  deadline_hours INTEGER;
BEGIN
  IF p_event_type NOT IN ('futuristic-run', 'fun-bike') THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'SETTINGS_EVENT_INVALID';
  END IF;

  IF JSONB_TYPEOF(p_settings) IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'SETTINGS_PAYLOAD_INVALID';
  END IF;

  SELECT COALESCE(JSONB_OBJECT_AGG(key, value), '{}'::JSONB)
    INTO current_settings
  FROM public.event_settings
  WHERE event_type = p_event_type;

  effective_settings := current_settings || p_settings;

  IF effective_settings->>'payment_transfer_enabled' = 'true'
     AND (NULLIF(BTRIM(effective_settings->>'payment_bank_name'), '') IS NULL
       OR NULLIF(BTRIM(effective_settings->>'payment_bank_account'), '') IS NULL
       OR NULLIF(BTRIM(effective_settings->>'payment_bank_holder'), '') IS NULL) THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'SETTINGS_BANK_REQUIRED';
  END IF;

  IF effective_settings->>'payment_dana_enabled' = 'true'
     AND (NULLIF(BTRIM(effective_settings->>'payment_dana_number'), '') IS NULL
       OR NULLIF(BTRIM(effective_settings->>'payment_dana_holder'), '') IS NULL) THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'SETTINGS_DANA_REQUIRED';
  END IF;

  IF effective_settings->>'payment_qris_enabled' = 'true'
     AND (NULLIF(BTRIM(effective_settings->>'payment_qris_image_url'), '') IS NULL
       OR NULLIF(BTRIM(effective_settings->>'payment_qris_nmid'), '') IS NULL
       OR NULLIF(BTRIM(effective_settings->>'payment_qris_merchant_name'), '') IS NULL) THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'SETTINGS_QRIS_REQUIRED';
  END IF;

  IF effective_settings->>'payment_transfer_enabled' <> 'true'
     AND effective_settings->>'payment_dana_enabled' <> 'true'
     AND effective_settings->>'payment_qris_enabled' <> 'true' THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'SETTINGS_METHOD_REQUIRED';
  END IF;

  BEGIN
    deadline_hours := (effective_settings->>'payment_deadline_hours')::INTEGER;
  EXCEPTION WHEN invalid_text_representation THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'SETTINGS_DEADLINE_INVALID';
  END;
  IF deadline_hours < 1 OR deadline_hours > 168 THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'SETTINGS_DEADLINE_INVALID';
  END IF;

  IF p_settings ? 'registration_fee' THEN
    BEGIN
      fee := (p_settings->>'registration_fee')::INTEGER;
    EXCEPTION WHEN invalid_text_representation THEN
      RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'SETTINGS_FEE_INVALID';
    END;
    IF fee <= 0 THEN
      RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'SETTINGS_FEE_INVALID';
    END IF;

    UPDATE public.event_categories
    SET price = fee, updated_at = NOW()
    WHERE event_type = p_event_type;
  END IF;

  INSERT INTO public.event_settings (event_type, key, value, updated_at)
  SELECT p_event_type, item.key, item.value, NOW()
  FROM JSONB_EACH_TEXT(p_settings) AS item(key, value)
  ON CONFLICT (event_type, key)
  DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

REVOKE ALL ON FUNCTION public.save_event_settings_atomic_v1(TEXT, JSONB) FROM PUBLIC;
