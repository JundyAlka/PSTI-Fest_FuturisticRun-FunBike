-- Payment verification security hardening (created 2026-07-01).
ALTER TABLE public.participants
  ADD COLUMN IF NOT EXISTS registration_access_token_hash TEXT,
  ADD COLUMN IF NOT EXISTS payment_proof_mime TEXT,
  ADD COLUMN IF NOT EXISTS payment_proof_size INTEGER,
  ADD COLUMN IF NOT EXISTS payment_proof_name TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

UPDATE public.participants
SET paid_at = COALESCE(updated_at, created_at, NOW())
WHERE payment_proof IS NOT NULL AND paid_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS participants_reg_number_unique
  ON public.participants(reg_number);

CREATE INDEX IF NOT EXISTS participants_event_payment_status_idx
  ON public.participants(event_type, payment_status, created_at DESC);

CREATE OR REPLACE FUNCTION public.register_participant_atomic_v4(payload JSONB)
RETURNS TABLE(reg_number TEXT, id INTEGER, price INTEGER, pricing_tier_id TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  created RECORD;
  access_hash TEXT := NULLIF(BTRIM(payload->>'registration_access_token_hash'), '');
BEGIN
  IF access_hash IS NULL OR access_hash !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'REG_ACCESS_TOKEN_INVALID';
  END IF;

  SELECT * INTO created
  FROM public.register_participant_atomic_v3(payload);

  UPDATE public.participants
  SET registration_access_token_hash = access_hash
  WHERE participants.id = created.id;

  RETURN QUERY SELECT created.reg_number, created.id, created.price, created.pricing_tier_id;
END;
$$;

REVOKE ALL ON FUNCTION public.register_participant_atomic_v4(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_participant_atomic_v4(JSONB) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.review_participant_payment_v1(
  p_participant_id INTEGER,
  p_status TEXT,
  p_reason TEXT,
  p_actor TEXT,
  p_bib_number INTEGER DEFAULT NULL
)
RETURNS SETOF public.participants
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
DECLARE
  current_participant public.participants%ROWTYPE;
BEGIN
  IF p_status NOT IN ('verified', 'rejected') THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'PAYMENT_STATUS_INVALID';
  END IF;
  IF NULLIF(BTRIM(p_actor), '') IS NULL THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'PAYMENT_ACTOR_REQUIRED';
  END IF;
  IF p_status = 'rejected' AND NULLIF(BTRIM(p_reason), '') IS NULL THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'PAYMENT_REJECTION_REASON_REQUIRED';
  END IF;

  SELECT * INTO current_participant
  FROM public.participants
  WHERE id = p_participant_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'PAYMENT_PARTICIPANT_NOT_FOUND';
  END IF;
  IF current_participant.payment_status <> 'pending' THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'PAYMENT_ALREADY_REVIEWED';
  END IF;
  IF current_participant.payment_proof IS NULL OR current_participant.paid_at IS NULL THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'PAYMENT_PROOF_REQUIRED';
  END IF;

  UPDATE public.participants
  SET payment_status = p_status,
      verified_at = CASE WHEN p_status = 'verified' THEN NOW() ELSE NULL END,
      verified_by = CASE WHEN p_status = 'verified' THEN p_actor ELSE NULL END,
      rejection_reason = CASE WHEN p_status = 'rejected' THEN BTRIM(p_reason) ELSE NULL END,
      bib_number = CASE WHEN p_status = 'verified' THEN COALESCE(p_bib_number, bib_number) ELSE bib_number END
  WHERE id = p_participant_id;

  INSERT INTO public.audit_logs(entity, entity_id, action, performed_by, details)
  VALUES (
    'participant', p_participant_id, 'payment_' || p_status, p_actor,
    JSONB_BUILD_OBJECT(
      'reg_number', current_participant.reg_number,
      'from', current_participant.payment_status,
      'to', p_status,
      'reason', NULLIF(BTRIM(p_reason), '')
    )
  );

  RETURN QUERY SELECT * FROM public.participants WHERE id = p_participant_id;
END;
$$;

REVOKE ALL ON FUNCTION public.review_participant_payment_v1(INTEGER, TEXT, TEXT, TEXT, INTEGER) FROM PUBLIC;
