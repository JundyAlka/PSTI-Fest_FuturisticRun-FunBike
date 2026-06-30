INSERT INTO event_settings (event_type, key, value) VALUES
  ('futuristic-run', 'contact_person', '+62 856-4390-9808'),
  ('futuristic-run', 'contact_person_name', 'Bimo Putra'),
  ('futuristic-run', 'contact_person_whatsapp', '+62 856-4390-9808'),
  ('futuristic-run', 'payment_bank_name', 'BRI'),
  ('futuristic-run', 'payment_bank_account', '007801112841503'),
  ('futuristic-run', 'payment_bank_holder', 'SYIFA FITRIYANTI'),
  ('futuristic-run', 'payment_qris_merchant_name', 'SYIFA FITRIYANTI'),
  ('fun-bike', 'contact_person', '+62 856-4390-9808'),
  ('fun-bike', 'contact_person_name', 'Bimo Putra'),
  ('fun-bike', 'contact_person_whatsapp', '+62 856-4390-9808'),
  ('fun-bike', 'payment_bank_name', 'BRI'),
  ('fun-bike', 'payment_bank_account', '007801112841503'),
  ('fun-bike', 'payment_bank_holder', 'SYIFA FITRIYANTI'),
  ('fun-bike', 'payment_qris_merchant_name', 'SYIFA FITRIYANTI')
ON CONFLICT (event_type, key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();
