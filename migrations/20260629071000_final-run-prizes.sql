-- Final Futuristic Run prize budget. Values remain editable through event_settings.
INSERT INTO public.event_settings (event_type, key, value) VALUES
  ('futuristic-run', 'prize_umum_putra_juara1', '500000'),
  ('futuristic-run', 'prize_umum_putra_juara2', '400000'),
  ('futuristic-run', 'prize_umum_putra_juara3', '200000'),
  ('futuristic-run', 'prize_umum_putra_harapan', 'Piagam'),
  ('futuristic-run', 'prize_umum_putri_juara1', '500000'),
  ('futuristic-run', 'prize_umum_putri_juara2', '400000'),
  ('futuristic-run', 'prize_umum_putri_juara3', '200000'),
  ('futuristic-run', 'prize_umum_putri_harapan', 'Piagam'),
  ('futuristic-run', 'prize_smp_putra_juara1', '500000'),
  ('futuristic-run', 'prize_smp_putra_juara2', '300000'),
  ('futuristic-run', 'prize_smp_putra_juara3', '200000'),
  ('futuristic-run', 'prize_smp_putra_harapan', 'Piagam'),
  ('futuristic-run', 'prize_smp_putri_juara1', '500000'),
  ('futuristic-run', 'prize_smp_putri_juara2', '300000'),
  ('futuristic-run', 'prize_smp_putri_juara3', '200000'),
  ('futuristic-run', 'prize_smp_putri_harapan', 'Piagam'),
  ('futuristic-run', 'prize_sd_putra_juara1', ''),
  ('futuristic-run', 'prize_sd_putra_juara2', ''),
  ('futuristic-run', 'prize_sd_putra_juara3', ''),
  ('futuristic-run', 'prize_sd_putra_harapan', ''),
  ('futuristic-run', 'prize_sd_putri_juara1', ''),
  ('futuristic-run', 'prize_sd_putri_juara2', ''),
  ('futuristic-run', 'prize_sd_putri_juara3', ''),
  ('futuristic-run', 'prize_sd_putri_harapan', '')
ON CONFLICT (event_type, key) DO UPDATE
SET value = EXCLUDED.value, updated_at = NOW();
