-- event_date is managed by admin. Seed the key only when it does not exist.
INSERT INTO public.event_settings (event_type, key, value)
VALUES ('futuristic-run', 'event_date', '')
ON CONFLICT (event_type, key) DO NOTHING;
