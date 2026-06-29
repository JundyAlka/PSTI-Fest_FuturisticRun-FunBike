import { CONTACT_EMAIL, DEFAULT_WHATSAPP, FEST_FULL_NAME, ORGANIZER_NAME } from "./brand";

export type EventSlug = "futuristic-run" | "fun-bike";

export type RundownItem = {
  time: string;
  duration?: string;
  activity: string;
  pic?: string;
};

export type Benefit = {
  id: string;
  icon: string;
  title: string;
  value?: string;
  status: "ready" | "tbd";
};

export type Champion = {
  id: string;
  label: string;
  prize?: string;
};

export type EventLocation = {
  lat: number;
  lng: number;
  label: string;
  plusCode?: string;
};

export type EventContent = {
  slug: EventSlug;
  route: string;
  registerRoute: string;
  name: string;
  shortName: string;
  alias: string;
  seoTitle: string;
  tagline: string;
  theme: "neon-night" | "sunrise-ride";
  accentColor: string;
  secondaryColor: string;
  categoryCode: string;
  categoryLabel: string;
  eventDate: string | null;
  eventTime: string;
  startTime: string;
  location: EventLocation | null;
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    tema: string;
    description: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  deskripsiPelaksanaan: string;
  rundown: RundownItem[];
  juara: Champion[];
  benefit: string[];
  benefits: Benefit[];
  racepack: string[];
  hiburan: string[];
  rute: string | null;
  doorprize: string[];
  contactPersons: Array<{ name: string; role: string; contact: string }>;
  faq: Array<{ q: string; a: string }>;
  rules: string[];
};

export const EVENTS: Record<EventSlug, EventContent> = {
  "futuristic-run": {
    slug: "futuristic-run",
    route: "/futuristic-run",
    registerRoute: "/futuristic-run/daftar",
    name: "Futuristic Run",
    shortName: "Run",
    alias: "Fun Run",
    seoTitle: "Futuristic Run 2026",
    tagline: "Run The Future, Shine The Night",
    theme: "neon-night",
    accentColor: "#00E5FF",
    secondaryColor: "#8B00FF",
    categoryCode: "5K",
    categoryLabel: "Run 5K",
    eventDate: "2026-08-01",
    eventTime: "19.00-22.00 WIB",
    startTime: "20:00",
    location: {
      lat: -7.7130878,
      lng: 110.0090583,
      label: "Alun-Alun Purworejo",
      plusCode: "72P5+QJ",
    },
    hero: {
      badge: `${FEST_FULL_NAME} Presents`,
      headline: "Futuristic Run",
      subheadline: "Lari malam bertema neon untuk energi komunitas yang lebih hidup.",
      tema: "Neon Night Run",
      description:
        "Event lari malam dengan atmosfer futuristik, visual neon, jersey eksklusif, BIB name, dan pengalaman komunitas yang dirancang untuk semua level pelari.",
    },
    about: {
      eyebrow: "Tentang Event",
      title: "Tentang Futuristic Run",
      paragraphs: [
        `${ORGANIZER_NAME} menghadirkan Futuristic Run sebagai pengalaman lari malam yang menggabungkan olahraga, teknologi, musik, dan visual neon.`,
        "Konsepnya dibuat ramah untuk peserta baru maupun pelari komunitas: satu rute, satu energi, dan satu momen untuk bergerak bersama.",
      ],
    },
    deskripsiPelaksanaan:
      "Futuristic Run dilaksanakan pada malam hari pukul 19.00-22.00 WIB. Tanggal final mengikuti pengumuman resmi panitia. Peserta mengikuti registrasi, briefing, pemanasan, flag off Run 5K, refreshment, hiburan, pembagian hadiah, dan dokumentasi dalam satu alur yang terkoordinasi.",
    rundown: [
      { time: "19.00-19.30", duration: "30 menit", activity: "Registrasi peserta", pic: "Sekretaris & Sie Acara" },
      { time: "19.30-19.35", duration: "5 menit", activity: "Pembukaan", pic: "MC" },
      { time: "19.35-19.45", duration: "10 menit", activity: "Sambutan-sambutan", pic: "MC + Ketua Panitia" },
      { time: "19.45-19.50", duration: "5 menit", activity: "Briefing rute & aturan", pic: "MC + Panitia" },
      { time: "19.50-19.58", duration: "8 menit", activity: "Stretching / pemanasan" },
      { time: "19.58-20.00", duration: "2 menit", activity: "Persiapan garis start", pic: "Panitia" },
      { time: "20.00-20.05", duration: "5 menit", activity: "Countdown & flag off 5K", pic: "MC + Ketua Panitia" },
      { time: "20.05-20.50", duration: "45 menit", activity: "Peserta Run 5K", pic: "Panitia" },
      { time: "20.50-21.05", duration: "15 menit", activity: "Finish + refreshment", pic: "Sie Konsumsi" },
      { time: "21.05-21.10", duration: "5 menit", activity: "Cooling down" },
      { time: "21.10-21.40", duration: "30 menit", activity: "Hiburan live music / DJ / performance" },
      { time: "21.20-21.40", duration: "20 menit", activity: "Pembagian doorprize", pic: "MC + Panitia" },
      { time: "21.40-21.55", duration: "15 menit", activity: "Pengumuman pemenang & hadiah", pic: "Panitia" },
      { time: "21.55-22.00", duration: "5 menit", activity: "Penutup & dokumentasi", pic: "MC + Panitia" },
    ],
    juara: [
      { id: "umum-1", label: "Juara Umum 1" },
      { id: "umum-2", label: "Juara Umum 2" },
      { id: "umum-3", label: "Juara Umum 3" },
      { id: "pelajar-1", label: "Juara Pelajar 1" },
      { id: "pelajar-2", label: "Juara Pelajar 2" },
      { id: "pelajar-3", label: "Juara Pelajar 3" },
    ],
    benefit: [
      "Jersey eksklusif",
      "Race BIB",
      "Refreshment",
      "Dokumentasi event",
      "Doorprize",
      "e-Sertifikat",
    ],
    benefits: [
      {
        id: "e-certificate",
        icon: "BadgeCheck",
        title: "E-Sertifikat",
        value: "Sertifikat digital untuk semua finisher.",
        status: "ready",
      },
      {
        id: "champion-prize",
        icon: "Trophy",
        title: "Hadiah Juara",
        status: "tbd",
      },
      {
        id: "finisher-medal",
        icon: "Medal",
        title: "Medali Finisher",
        value: "Medali untuk peserta yang mencapai garis finish.",
        status: "ready",
      },
      {
        id: "race-pack",
        icon: "Ticket",
        title: "Race Pack + BIB",
        status: "tbd",
      },
      {
        id: "refreshment",
        icon: "CupSoda",
        title: "Refreshment",
        value: "Air dan snack di garis finish, plus water station dekat Caramel.",
        status: "ready",
      },
      {
        id: "entertainment",
        icon: "Music",
        title: "Hiburan",
        value: "Tari Ndolalak serta DJ atau live music.",
        status: "ready",
      },
    ],
    racepack: [
      "Pengambilan 30-31 Juli pukul 08.00-16.00",
      "Jersey event",
      "Nomor BIB",
      "Totebag",
      "Voucher/produk sponsor jika tersedia",
      "Water station dekat Caramel",
      "Pacer dari PASI",
      "Marshal dari panitia",
    ],
    hiburan: [
      "Musik di area finish",
      "Lighting dan visual neon",
      "Community moment",
    ],
    rute: null,
    doorprize: [
      "Perlengkapan olahraga",
      "Voucher sponsor",
      "Merchandise eksklusif",
    ],
    contactPersons: [
      { name: "Panitia Registrasi", role: "Informasi peserta", contact: DEFAULT_WHATSAPP },
      { name: "Email Resmi", role: "Administrasi", contact: CONTACT_EMAIL },
    ],
    faq: [
      {
        q: "Apakah Futuristic Run cocok untuk pemula?",
        a: "Ya. Rute dan ritme event dirancang agar bisa diikuti peserta umum, dengan tetap mengikuti arahan keselamatan dari panitia.",
      },
      {
        q: "Apakah peserta mendapat jersey?",
        a: "Ya. Jersey termasuk dalam race pack selama kuota dan ketentuan pendaftaran terpenuhi.",
      },
      {
        q: "Kapan detail rute diumumkan?",
        a: "Detail rute final akan diumumkan melalui website, email peserta, dan kanal resmi sebelum hari event.",
      },
    ],
    rules: [
      "Peserta wajib mengisi data pendaftaran dengan benar.",
      "Peserta wajib berada dalam kondisi sehat saat mengikuti event.",
      "Nomor BIB tidak boleh dipindahtangankan tanpa persetujuan panitia.",
      "Keputusan panitia terkait teknis event bersifat final.",
    ],
  },
  "fun-bike": {
    slug: "fun-bike",
    route: "/fun-bike",
    registerRoute: "/fun-bike/daftar",
    name: "Futuristic Bike",
    shortName: "Bike",
    alias: "Fun Bike",
    seoTitle: "Futuristic Bike 2026",
    tagline: "Ride The Sunrise",
    theme: "sunrise-ride",
    accentColor: "#FF6B2C",
    secondaryColor: "#7BC142",
    categoryCode: "funbike",
    categoryLabel: "Futuristic Bike Ride",
    eventDate: null,
    eventTime: "05.00-09.10 WIB",
    startTime: "06:00",
    location: null,
    hero: {
      badge: `${FEST_FULL_NAME} Presents`,
      headline: "Futuristic Bike",
      subheadline: "Ride pagi bertema sunrise untuk semua level pesepeda.",
      tema: "Sunrise Ride",
      description:
        "Event gowes santai dengan rute pagi, suasana komunitas, race pack, refreshment, hiburan, dan doorprize untuk peserta.",
    },
    about: {
      eyebrow: "Tentang Event",
      title: "Tentang Futuristic Bike",
      paragraphs: [
        `${ORGANIZER_NAME} menghadirkan Futuristic Bike sebagai ride pagi yang mengutamakan kebersamaan, kesehatan, dan pengalaman kota yang lebih segar.`,
        "Event ini terbuka untuk berbagai jenis sepeda dan dirancang agar ramah untuk pemula, komunitas, maupun peserta yang ingin menikmati suasana sunrise.",
      ],
    },
    deskripsiPelaksanaan:
      "Futuristic Bike berlangsung pada pagi hari dengan alur registrasi, briefing keselamatan, fun ride hingga finish, istirahat, hiburan band, pembagian doorprize, dan penutup. Tanggal final mengikuti pengumuman resmi panitia.",
    rundown: [
      { time: "05.00-05.30", duration: "30 menit", activity: "Registrasi" },
      { time: "05.30-05.45", duration: "15 menit", activity: "Pembukaan & sambutan ICF + ketupat", pic: "Panitia + ICF" },
      { time: "05.45-05.55", duration: "10 menit", activity: "Briefing rute & aturan", pic: "Panitia" },
      { time: "05.55-06.00", duration: "5 menit", activity: "Start", pic: "Panitia" },
      { time: "06.00-07.05", duration: "65 menit", activity: "Ride sampai finish", pic: "Marshal + Panitia" },
      { time: "07.05-07.35", duration: "30 menit", activity: "Perform band 1 + istirahat" },
      { time: "07.35-08.00", duration: "25 menit", activity: "Pembagian doorprize", pic: "MC + Panitia" },
      { time: "08.00-09.00", duration: "60 menit", activity: "Perform band 2" },
      { time: "09.00-09.10", duration: "10 menit", activity: "Penutup", pic: "MC + Panitia" },
    ],
    juara: [
      { id: "participation", label: "Event non-kompetitif, fokus pada partisipasi dan kebersamaan" },
      { id: "community", label: "Apresiasi komunitas dan peserta terpilih dapat diumumkan panitia" },
    ],
    benefit: [
      "Jersey cycling",
      "Nomor peserta",
      "Refreshment",
      "Dokumentasi event",
      "Doorprize",
      "e-Sertifikat",
    ],
    benefits: [
      { id: "jersey", icon: "Ticket", title: "Jersey Cycling", value: "Jersey cycling peserta.", status: "ready" },
      { id: "participant-number", icon: "BadgeCheck", title: "Nomor Peserta", value: "Nomor identitas peserta ride.", status: "ready" },
      { id: "refreshment", icon: "CupSoda", title: "Refreshment", value: "Refreshment setelah ride.", status: "ready" },
      { id: "entertainment", icon: "Music", title: "Hiburan", value: "Musik dan sesi komunitas.", status: "ready" },
    ],
    racepack: [
      "Jersey cycling",
      "Nomor peserta",
      "Totebag",
      "Produk sponsor jika tersedia",
    ],
    hiburan: [
      "SUNFLOW",
      "Ollsame",
      "Doorprize session",
      "Foto komunitas",
    ],
    rute: null,
    doorprize: [
      "Doorprize pembelian panitia",
      "Doorprize dari sponsor",
      "Hadiah diumumkan saat acara",
    ],
    contactPersons: [
      { name: "Panitia Registrasi", role: "Informasi peserta", contact: DEFAULT_WHATSAPP },
      { name: "Email Resmi", role: "Administrasi", contact: CONTACT_EMAIL },
    ],
    faq: [
      {
        q: "Apakah Futuristic Bike cocok untuk pemula?",
        a: "Ya. Event ini bersifat fun ride dan rute final akan disiapkan agar tetap ramah untuk peserta umum.",
      },
      {
        q: "Jenis sepeda apa yang boleh digunakan?",
        a: "Road bike, MTB, folding bike, hybrid, BMX, dan sepeda kota dapat digunakan selama kondisinya laik jalan.",
      },
      {
        q: "Apakah Futuristic Bike bersifat kompetisi?",
        a: "Tidak. Fokus utama event adalah kebersamaan, keselamatan, dan pengalaman ride pagi.",
      },
    ],
    rules: [
      "Peserta wajib menggunakan sepeda yang laik jalan.",
      "Peserta wajib mematuhi arahan marshal dan panitia.",
      "Peserta di bawah umur mengikuti ketentuan pendampingan panitia.",
      "Keputusan panitia terkait teknis event bersifat final.",
    ],
  },
};

export const EVENT_LIST = [EVENTS["futuristic-run"], EVENTS["fun-bike"]] as const;

export function getEventContent(slug: EventSlug): EventContent {
  return EVENTS[slug];
}
