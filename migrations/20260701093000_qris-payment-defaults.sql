-- Keep QRIS availability consistent across registration, confirmation, and admin settings.
INSERT INTO public.event_settings (event_type, key, value) VALUES
  ('futuristic-run', 'payment_qris_enabled', 'true'),
  ('futuristic-run', 'payment_qris_nmid', 'ID1026540800533'),
  ('futuristic-run', 'payment_qris_image_url', '/qris-payment.png'),
  ('futuristic-run', 'payment_qris_merchant_name', 'FUTURISTIC VIBES, HIBURAN'),
  ('fun-bike', 'payment_qris_enabled', 'true'),
  ('fun-bike', 'payment_qris_nmid', 'ID1026540800533'),
  ('fun-bike', 'payment_qris_image_url', '/qris-payment.png'),
  ('fun-bike', 'payment_qris_merchant_name', 'FUTURISTIC VIBES, HIBURAN')
ON CONFLICT (event_type, key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

NOTIFY pgrst, 'reload schema';
