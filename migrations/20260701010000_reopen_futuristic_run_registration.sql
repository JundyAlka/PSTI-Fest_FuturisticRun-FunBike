BEGIN;

UPDATE public.events
SET is_open = TRUE,
    deadline = NULL
WHERE slug = 'futuristic-run';

INSERT INTO public.event_settings (event_type, key, value)
VALUES
  ('futuristic-run', 'registration_open', 'true'),
  ('futuristic-run', 'registration_deadline', '')
ON CONFLICT (event_type, key)
DO UPDATE SET value = EXCLUDED.value;

COMMIT;
