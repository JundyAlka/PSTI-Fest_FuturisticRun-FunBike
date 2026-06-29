-- Operational location and prize keys. event_date remains admin-managed.
UPDATE public.events
SET location = 'Alun-Alun Purworejo', updated_at = NOW()
WHERE slug = 'futuristic-run';

UPDATE public.event_settings
SET value = 'Alun-Alun Purworejo', updated_at = NOW()
WHERE event_type = 'futuristic-run' AND key = 'event_location';

INSERT INTO public.event_settings (event_type, key, value) VALUES
  ('futuristic-run', 'event_location', 'Alun-Alun Purworejo'),
  ('futuristic-run', 'location_lat', '-7.7130878'),
  ('futuristic-run', 'location_lng', '110.0090583'),
  ('futuristic-run', 'location_plus_code', '72P5+QJ'),
  ('futuristic-run', 'prize_umum_1', ''),
  ('futuristic-run', 'prize_umum_2', ''),
  ('futuristic-run', 'prize_umum_3', ''),
  ('futuristic-run', 'prize_pelajar_1', ''),
  ('futuristic-run', 'prize_pelajar_2', ''),
  ('futuristic-run', 'prize_pelajar_3', '')
ON CONFLICT (event_type, key) DO NOTHING;
