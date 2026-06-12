import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Events ────────────────────────────────────────────────────────────────
  const events = [
    {
      slug: "futuristic-run",
      name: "Futuristic RUN 2026",
      theme: "futuristic",
      isOpen: true,
      eventDate: new Date("2026-06-22"),
      location: "Purworejo, Jawa Tengah",
      deadline: new Date("2026-06-14"),
    },
    {
      slug: "fun-bike",
      name: "Fun Bike 2026",
      theme: "sunrise",
      isOpen: true,
      eventDate: null,
      location: null,
      deadline: null,
    },
  ];

  for (const ev of events) {
    await prisma.event.upsert({
      where: { slug: ev.slug },
      update: { name: ev.name, theme: ev.theme },
      create: ev,
    });
  }
  console.log("✅ Events seeded");

  // ── Event Categories ───────────────────────────────────────────────────────
  const eventCategories = [
    { eventType: "futuristic-run", code: "5K", label: "Run 5K", price: 200000, quota: 200, minAge: 13 },
    { eventType: "fun-bike", code: "funbike", label: "Fun Bike Ride", price: 150000, quota: 300, minAge: 10 },
  ];

  for (const ec of eventCategories) {
    await prisma.eventCategory.upsert({
      where: { eventType_code: { eventType: ec.eventType, code: ec.code } },
      update: { label: ec.label, price: ec.price, quota: ec.quota },
      create: ec,
    });
  }
  console.log("✅ Event categories seeded");

  // ── Admin user ─────────────────────────────────────────────────────────────
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: "admin@pstifest.com" },
  });

  if (!existingAdmin) {
    const hashed = await bcrypt.hash("admin123", 12);
    await prisma.adminUser.create({
      data: {
        email: "admin@pstifest.com",
        password: hashed,
        name: "Admin PSTI FEST",
        role: "admin",
      },
    });
    console.log("✅ Admin created: admin@pstifest.com / admin123");
  } else {
    console.log("ℹ️  Admin already exists");
  }

  // ── Event settings (scoped per event) ──────────────────────────────────────
  const settings = [
    { eventType: "futuristic-run", key: "registration_open", value: "true" },
    { eventType: "futuristic-run", key: "registration_fee", value: "200000" },
    { eventType: "futuristic-run", key: "event_date", value: "2026-06-22" },
    { eventType: "futuristic-run", key: "event_location", value: "Purworejo, Jawa Tengah" },
    { eventType: "futuristic-run", key: "early_bird_deadline", value: "2026-05-31" },
    { eventType: "futuristic-run", key: "registration_deadline", value: "2026-06-14" },
  ];

  for (const s of settings) {
    await prisma.eventSetting.upsert({
      where: { eventType_key: { eventType: s.eventType, key: s.key } },
      update: { value: s.value },
      create: s,
    });
  }
  console.log("✅ Event settings seeded");

  // ── Sample participants ────────────────────────────────────────────────────
  const statuses = ["pending", "verified", "rejected"];
  const jerseySizes = ["S", "M", "L", "XL"];
  const prices: Record<string, number> = { "5K": 200000 };

  const existingCount = await prisma.participant.count();
  if (existingCount === 0) {
    for (let i = 1; i <= 15; i++) {
      const cat = "5K";
      const status = statuses[i % 3];
      await prisma.participant.create({
        data: {
          regNumber: `FR2026-${String(i).padStart(4, "0")}`,
          eventType: "futuristic-run",
          fullName: `Peserta Contoh ${i}`,
          nik: `317401${String(i).padStart(10, "0")}`,
          gender: i % 2 === 0 ? "male" : "female",
          birthPlace: "Purworejo",
          birthDate: new Date(`199${i % 10}-0${(i % 9) + 1}-15`),
          phone: `0812345678${String(i).padStart(2, "0")}`,
          email: `peserta${i}@contoh.com`,
          address: `Jl. Masa Depan No. ${i}`,
          city: "Purworejo",
          province: "Jawa Tengah",
          category: cat,
          jerseySize: jerseySizes[i % 4],
          bibName: `RUNNER${i}`,
          emergencyContactName: `Keluarga ${i}`,
          emergencyContactPhone: `0856789012${String(i).padStart(2, "0")}`,
          bloodType: ["A+", "B+", "O+", "AB+"][i % 4],
          paymentMethod: ["transfer", "qris", "midtrans"][i % 3],
          paymentStatus: status,
          paymentAmount: prices[cat],
          status: "registered",
          bibNumber: status === "verified" ? 1000 + i : null,
          verifiedAt: status === "verified" ? new Date() : null,
          verifiedBy: status === "verified" ? "admin@pstifest.com" : null,
        },
      });
    }
    console.log("✅ 15 sample participants created");
  } else {
    console.log(`ℹ️  ${existingCount} participants already exist`);
  }

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
