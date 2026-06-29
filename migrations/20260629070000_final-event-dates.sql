-- Final public schedules. Values remain editable through event_settings.
INSERT INTO public.event_settings (event_type, key, value) VALUES
  ('futuristic-run', 'event_date', '2026-08-01T18:00:00+07:00'),
  ('fun-bike', 'event_date', '2026-08-02T05:00:00+07:00')
ON CONFLICT (event_type, key) DO UPDATE
SET value = EXCLUDED.value, updated_at = NOW();
