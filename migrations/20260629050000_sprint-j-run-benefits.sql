-- Sprint J: operational benefit copy remains editable through event settings.
INSERT INTO public.event_settings (event_type, key, value) VALUES
  ('futuristic-run', 'benefit_prize_details', ''),
  ('futuristic-run', 'benefit_race_pack_contents', '')
ON CONFLICT (event_type, key) DO NOTHING;
