import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { FEST_NAME } from "../src/content/brand";
import { DEFAULT_PRIZE_SETTINGS } from "../src/data/prizes";
import { EVENTS } from "../src/content/events";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ── Events ────────────────────────────────────────────────────────────────
  const events = [
    {
      slug: "futuristic-run",
      name: "Futuristic Run",
      theme: "futuristic",
      isOpen: true,
      eventDate: null,
      location: "Alun-Alun Purworejo",
      deadline: new Date("2026-06-14"),
    },
    {
      slug: "fun-bike",
      name: "Futuristic Bike",
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
      update: { name: ev.name, theme: ev.theme, eventDate: ev.eventDate, location: ev.location },
      create: ev,
    });
  }
  console.log("✅ Events seeded");

  // ── Event Categories ───────────────────────────────────────────────────────
  const eventCategories = [
    { eventType: "futuristic-run", code: "5K", label: "Run 5K", price: 120000, quota: 200, minAge: 13 },
    { eventType: "fun-bike", code: "funbike", label: "Futuristic Bike Ride", price: 150000, quota: 300, minAge: 10 },
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
    where: { email: "admin@futuristicvibes.id" },
  });

  if (!existingAdmin) {
    const hashed = await bcrypt.hash("admin123", 12);
    await prisma.adminUser.create({
      data: {
        email: "admin@futuristicvibes.id",
        password: hashed,
        name: `Admin ${FEST_NAME}`,
        role: "admin",
      },
    });
    console.log("✅ Admin created: admin@futuristicvibes.id / admin123");
  } else {
    console.log("ℹ️  Admin already exists");
  }

  // ── Event settings (scoped per event) ──────────────────────────────────────
  const settings = [
    { eventType: "futuristic-run", key: "registration_open", value: "true" },
    { eventType: "futuristic-run", key: "registration_fee", value: "120000" },
    { eventType: "futuristic-run", key: "event_date", value: "2026-08-01T18:00:00+07:00" },
    { eventType: "futuristic-run", key: "event_location", value: "Alun-Alun Purworejo" },
    { eventType: "futuristic-run", key: "event_location_address", value: "Alun-Alun Purworejo, Purworejo, Jawa Tengah" },
    { eventType: "futuristic-run", key: "location_lat", value: "-7.7130878" },
    { eventType: "futuristic-run", key: "location_lng", value: "110.0090583" },
    { eventType: "futuristic-run", key: "location_plus_code", value: "72P5+QJ" },
    { eventType: "futuristic-run", key: "early_bird_deadline", value: "2026-05-31" },
    { eventType: "futuristic-run", key: "registration_deadline", value: "2026-06-14" },
    { eventType: "futuristic-run", key: "payment_bank_name", value: "BRI" },
    { eventType: "futuristic-run", key: "payment_bank_account", value: "007801112841503" },
    { eventType: "futuristic-run", key: "payment_bank_holder", value: "SYIFA FITRIYANTI" },
    { eventType: "futuristic-run", key: "payment_qris_merchant_name", value: "SYIFA FITRIYANTI" },
    { eventType: "futuristic-run", key: "benefit_prize_details", value: "" },
    { eventType: "futuristic-run", key: "benefit_race_pack_contents", value: "Jersey event, BIB number, medali finisher, e-sertifikat, refreshment, doorprize, hiburan, tim medis." },
    { eventType: "futuristic-run", key: "racepack_location", value: "Kampus Plaosan" },
    { eventType: "futuristic-run", key: "contact_person", value: "+62 856-4390-9808" },
    { eventType: "futuristic-run", key: "contact_person_name", value: "Bimo Putra" },
    { eventType: "futuristic-run", key: "contact_person_whatsapp", value: "+62 856-4390-9808" },
    {
      eventType: "futuristic-run",
      key: "faq",
      value: EVENTS["futuristic-run"].faq.map((item) => `${item.q} | ${item.a}`).join("\n"),
    },
    {
      eventType: "futuristic-run",
      key: "rules",
      value: EVENTS["futuristic-run"].rules.join("\n"),
    },
    ...Object.entries(DEFAULT_PRIZE_SETTINGS).map(([key, value]) => ({ eventType: "futuristic-run", key, value })),
    { eventType: "fun-bike", key: "event_date", value: "2026-08-02T05:00:00+07:00" },
    { eventType: "fun-bike", key: "event_location", value: "Alun-Alun Purworejo" },
    { eventType: "fun-bike", key: "event_location_address", value: "Alun-Alun Purworejo, Purworejo, Jawa Tengah" },
    { eventType: "fun-bike", key: "location_lat", value: "-7.7130878" },
    { eventType: "fun-bike", key: "location_lng", value: "110.0090583" },
    { eventType: "fun-bike", key: "location_plus_code", value: "72P5+QJ" },
    { eventType: "fun-bike", key: "payment_bank_name", value: "BRI" },
    { eventType: "fun-bike", key: "payment_bank_account", value: "007801112841503" },
    { eventType: "fun-bike", key: "payment_bank_holder", value: "SYIFA FITRIYANTI" },
    { eventType: "fun-bike", key: "payment_qris_merchant_name", value: "SYIFA FITRIYANTI" },
    { eventType: "fun-bike", key: "contact_person", value: "+62 856-4390-9808" },
    { eventType: "fun-bike", key: "contact_person_name", value: "Bimo Putra" },
    { eventType: "fun-bike", key: "contact_person_whatsapp", value: "+62 856-4390-9808" },
    { eventType: "fun-bike", key: "bike_prize_amount", value: "" },
    { eventType: "fun-bike", key: "bike_route_note", value: "Rute final menyusul technical meeting." },
    {
      eventType: "fun-bike",
      key: "faq",
      value: EVENTS["fun-bike"].faq.map((item) => `${item.q} | ${item.a}`).join("\n"),
    },
    {
      eventType: "fun-bike",
      key: "rules",
      value: EVENTS["fun-bike"].rules.join("\n"),
    },
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
  const prices: Record<string, number> = { "5K": 120000 };

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
          verifiedBy: status === "verified" ? "admin@futuristicvibes.id" : null,
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
