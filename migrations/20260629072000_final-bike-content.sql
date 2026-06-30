-- Final Futuristic Bike public content. Values remain editable through event_settings.
INSERT INTO public.event_settings (event_type, key, value) VALUES
  ('fun-bike', 'event_location', 'Alun-Alun Purworejo'),
  ('fun-bike', 'event_location_address', 'Alun-Alun Purworejo, Purworejo, Jawa Tengah'),
  ('fun-bike', 'location_lat', '-7.7130878'),
  ('fun-bike', 'location_lng', '110.0090583'),
  ('fun-bike', 'location_plus_code', '72P5+QJ'),
  ('fun-bike', 'contact_person', '+62 856-4390-9808'),
  ('fun-bike', 'contact_person_name', 'Bimo Putra'),
  ('fun-bike', 'contact_person_whatsapp', '+62 856-4390-9808'),
  ('fun-bike', 'bike_prize_amount', ''),
  ('fun-bike', 'bike_route_note', 'Rute final menyusul technical meeting.'),
  ('fun-bike', 'faq', 'Kapan & di mana Futuristic Bike? | Minggu, 2 Agustus 2026, mulai 05.00 WIB, start & finish di Alun-Alun Purworejo.
Apakah ini lomba kecepatan? | Bukan, ini Fun Ride santai bertema sunrise, fokus kebersamaan.
Apa saja yang didapat peserta? | Jersey, nomor peserta, e-sertifikat, refreshment, doorprize, hiburan, tim medis & marshal.
Bagaimana cara daftar & bayar? | Daftar online di web, bayar via Transfer/DANA/QRIS, upload bukti, tunggu verifikasi.
Bagaimana rutenya? | Rute pagi mengelilingi Purworejo dari & kembali ke Alun-Alun; detail checkpoint diumumkan saat technical meeting.
Boleh ikut keluarga/anak? | Boleh, ini fun ride keluarga; anak harap didampingi.')
ON CONFLICT (event_type, key) DO UPDATE
SET value = EXCLUDED.value,
    updated_at = NOW();
