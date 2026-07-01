-- Normalize public pricing, payment methods, and Fun Bike route status.

UPDATE public.event_categories
SET price = 120000, updated_at = NOW()
WHERE event_type = 'futuristic-run' AND code = '5K' AND price <> 120000;

UPDATE public.event_categories
SET price = 150000, updated_at = NOW()
WHERE event_type = 'fun-bike' AND code = 'funbike' AND price <> 150000;

INSERT INTO public.pricing_tiers (event_type, id, label, price, quota, sort_order, active, updated_at)
VALUES
  ('futuristic-run', 'presale1', 'Presale 1', 120000, 100, 1, TRUE, NOW()),
  ('futuristic-run', 'normal', 'Normal', 135000, 100, 2, TRUE, NOW()),
  ('fun-bike', 'normal', 'Normal', 150000, 300, 1, TRUE, NOW())
ON CONFLICT (event_type, id) DO UPDATE
SET label = EXCLUDED.label,
    price = EXCLUDED.price,
    sort_order = EXCLUDED.sort_order,
    active = TRUE,
    updated_at = NOW();

INSERT INTO public.event_settings (event_type, key, value, updated_at)
VALUES
  ('futuristic-run', 'payment_dana_enabled', 'false', NOW()),
  ('futuristic-run', 'payment_dana_number', '', NOW()),
  ('futuristic-run', 'payment_dana_holder', '', NOW()),
  ('fun-bike', 'payment_dana_enabled', 'false', NOW()),
  ('fun-bike', 'payment_dana_number', '', NOW()),
  ('fun-bike', 'payment_dana_holder', '', NOW()),
  ('fun-bike', 'bike_route_note', 'Rute masih dalam tahap survei dan belum final.', NOW())
ON CONFLICT (event_type, key) DO UPDATE
SET value = EXCLUDED.value,
    updated_at = NOW();

UPDATE public.event_settings
SET value = REPLACE(value, 'Transfer/DANA/QRIS', 'Transfer/QRIS'),
    updated_at = NOW()
WHERE key IN ('faq', 'payment_instructions')
  AND value LIKE '%DANA%';
