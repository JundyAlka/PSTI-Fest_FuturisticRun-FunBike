-- Final Futuristic Run public content. Values remain editable through event_settings.
UPDATE public.event_categories
SET price = 120000,
    updated_at = NOW()
WHERE event_type = 'futuristic-run'
  AND code = '5K';

INSERT INTO public.event_settings (event_type, key, value) VALUES
  ('futuristic-run', 'registration_fee', '120000'),
  ('futuristic-run', 'event_location', 'Alun-Alun Purworejo'),
  ('futuristic-run', 'event_location_address', 'Alun-Alun Purworejo, Purworejo, Jawa Tengah'),
  ('futuristic-run', 'location_lat', '-7.7130878'),
  ('futuristic-run', 'location_lng', '110.0090583'),
  ('futuristic-run', 'location_plus_code', '72P5+QJ'),
  ('futuristic-run', 'benefit_race_pack_contents', 'Jersey event, BIB number, medali finisher, e-sertifikat, refreshment, doorprize, hiburan, tim medis.'),
  ('futuristic-run', 'racepack_location', 'Kampus Plaosan'),
  ('futuristic-run', 'contact_person', '+62 856-4390-9808'),
  ('futuristic-run', 'contact_person_name', 'Bimo Putra'),
  ('futuristic-run', 'contact_person_whatsapp', '+62 856-4390-9808'),
  ('futuristic-run', 'faq', 'Kapan & di mana? | Sabtu, 1 Agustus 2026, mulai 18.00 WIB, start/finish Alun-Alun Purworejo.
Jarak lari berapa? | 5K (satu kategori).
Berapa biaya & apa yang didapat? | Presale 1 Rp120.000 (100 pertama), Normal Rp135.000; dapat jersey, BIB, medali finisher, e-sertifikat, refreshment, doorprize.
Bagaimana cara daftar & bayar? | Daftar online, bayar Transfer/DANA/QRIS, upload bukti, tunggu verifikasi.
Ada hadiah juara? | Ada, per kategori usia & gender (lihat tabel hadiah).
Pengambilan race pack kapan? | Dijadwalkan sebelum hari H; detail dikonfirmasi panitia via kontak/WhatsApp.')
ON CONFLICT (event_type, key) DO UPDATE
SET value = EXCLUDED.value,
    updated_at = NOW();
