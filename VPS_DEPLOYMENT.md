# VPS Deployment via GitHub

Panduan ini memakai file database yang aman untuk deploy: `prisma/schema.prisma`, `prisma/migrations/`, dan `prisma/seed.ts`.
File database lokal seperti `dev.db` tidak dipush ke GitHub karena bisa berisi data lokal, akun admin, atau bukti pembayaran.

## 1. Clone repo di VPS

```bash
git clone https://github.com/JundyAlka/PSTI-Fest_FuturisticRun-FunBike.git
cd PSTI-Fest_FuturisticRun-FunBike
```

## 2. Install dependency

```bash
npm ci
```

## 3. Buat `.env`

Salin dari `.env.example`, lalu isi nilai production:

```bash
cp .env.example .env
```

Minimal variabel penting:

```env
DATABASE_URL=file:./prisma/prod.db
INSFORGE_URL=https://your-project.insforge.app
INSFORGE_API_KEY=your-server-side-insforge-api-key
AUTH_SECRET=generate-a-long-random-secret
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

Untuk SQLite lokal di VPS, `DATABASE_URL=file:./prisma/prod.db` cukup. Jika memakai database managed, sesuaikan `DATABASE_URL` dan provider Prisma sesuai database yang dipakai.

## 4. Buat/update database

```bash
npm run db:deploy
npm run db:seed
```

`db:deploy` membuat tabel dari migration. `db:seed` mengisi data awal event, kategori, setting, dan admin awal.

## 5. Build dan jalankan aplikasi

```bash
npm run build
npm run start
```

Untuk production, jalankan dengan process manager seperti PM2:

```bash
pm2 start npm --name futuristic-vibes -- start
pm2 save
```

## 6. Update dari GitHub

Setiap ada update:

```bash
git pull origin main
npm ci
npm run db:deploy
npm run build
pm2 restart futuristic-vibes
```

