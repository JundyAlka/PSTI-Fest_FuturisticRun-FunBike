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
  eventTime: string;
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
    eventTime: "18.00 WIB - selesai",
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
      "Futuristic Run dimulai pukul 18.00 WIB. Peserta mengikuti registrasi, briefing, pemanasan, flag off Run 5K, refreshment, hiburan, pembagian hadiah, dan dokumentasi dalam satu alur yang terkoordinasi.",
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
      "Jersey event",
      "BIB number",
      "Medali finisher",
      "E-sertifikat",
      "Refreshment",
      "Doorprize",
      "Hiburan",
      "Tim medis",
    ],
    benefits: [
      {
        id: "jersey",
        icon: "Ticket",
        title: "Jersey Event",
        value: "Jersey event Futuristic Run untuk peserta.",
        status: "ready",
      },
      {
        id: "bib-number",
        icon: "BadgeCheck",
        title: "BIB Number",
        value: "Nomor BIB peserta untuk identitas lari 5K.",
        status: "ready",
      },
      {
        id: "finisher-medal",
        icon: "Medal",
        title: "Medali Finisher",
        value: "Medali untuk peserta yang mencapai garis finish.",
        status: "ready",
      },
      {
        id: "e-certificate",
        icon: "BadgeCheck",
        title: "E-Sertifikat",
        value: "Sertifikat digital untuk finisher.",
        status: "ready",
      },
      {
        id: "refreshment",
        icon: "CupSoda",
        title: "Refreshment",
        value: "Air mineral dan snack peserta di area finish.",
        status: "ready",
      },
      {
        id: "doorprize",
        icon: "Trophy",
        title: "Doorprize",
        value: "Doorprize pembelian panitia dan dukungan sponsor.",
        status: "ready",
      },
      {
        id: "support",
        icon: "Music",
        title: "Hiburan & Tim Medis",
        value: "Band SUNFLOW & Ollsame, tim medis, dan marshal panitia.",
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
      "Band SUNFLOW",
      "Ollsame",
    ],
    rute: null,
    doorprize: [
      "Doorprize pembelian panitia",
      "Dukungan sponsor",
      "Diundi saat acara",
    ],
    contactPersons: [
      { name: "Panitia Registrasi", role: "Informasi peserta", contact: DEFAULT_WHATSAPP },
      { name: "Email Resmi", role: "Administrasi", contact: CONTACT_EMAIL },
    ],
    faq: [
      {
        q: "Kapan dan di mana tepatnya Futuristic Run 2026 diselenggarakan?",
        a: "Futuristic Run 2026 diselenggarakan pada Sabtu malam, 1 Agustus 2026. Open gate dan registrasi ulang dimulai pukul 18.00 WIB, dilanjutkan dengan pemanasan bersama dan flag-off tepat pukul 20.00 WIB. Lokasi start dan finish berpusat di Alun-Alun Purworejo dengan suasana Night Run bertema neon futuristik.",
      },
      {
        q: "Berapa jarak tempuh rute dan apakah ada batas waktu (Cut Off Time / COT)?",
        a: "Jarak lari resmi adalah 5 kilometer (5K Run) mengelilingi pusat kota Purworejo yang datar dan aman. Batas waktu penyelesaian rute (Cut Off Time / COT) adalah 90 menit (1,5 jam) sejak flag-off, sehingga sangat ramah dan nyaman bagi pelari pemula (newbie) maupun fun runner.",
      },
      {
        q: "Berapa biaya pendaftaran dan apa saja fasilitas benefit yang didapatkan?",
        a: "Tiket Presale sebesar Rp120.000 (kuota terbatas 100 pertama) dan harga Normal Rp135.000. Setiap peserta resmi berhak mendapatkan Jersey Eksklusif Futuristic Run, Nomor BIB resmi, Medali Finisher (setelah mencapai garis finish), E-Sertifikat, Refreshment (air mineral & isotonik), kupon undian Doorprize utama, serta pengamanan tim medis & marshal.",
      },
      {
        q: "Bagaimana alur pembayaran dan berapa lama proses verifikasi pendaftaran?",
        a: "Pendaftaran dilakukan secara online melalui website ini. Pembayaran dapat dilakukan via Transfer Bank, DANA, atau QRIS. Setelah mengunggah bukti bayar, admin panitia akan melakukan verifikasi maksimal dalam waktu 1x24 jam. Status pendaftaran akan berubah menjadi 'Terverifikasi' disertai e-ticket resmi.",
      },
      {
        q: "Kapan jadwal dan syarat pengambilan Race Pack Collection (RPC)?",
        a: "Pengambilan Race Pack dijadwalkan pada H-2 dan H-1 acara (30 - 31 Juli 2026) pukul 08.00 - 16.00 WIB. Syarat pengambilan adalah menunjukkan e-ticket/invoice terverifikasi beserta identitas diri (KTP/Kartu Pelajar). Jika diwakilkan, wajib membawa surat kuasa bermaterai dan salinan KTP peserta.",
      },
      {
        q: "Apakah tersedia fasilitas penitipan barang (Drop Bag) dan pertolongan medis?",
        a: "Ya, panitia menyediakan tenda penitipan barang (Drop Bag) gratis dan aman di area start/finish bagi peserta terverifikasi. Tim medis profesional, ambulans siaga, serta water station bersiap di beberapa titik rute 5K dan garis finish.",
      },
    ],
    rules: [
      "01. Registrasi & Identitas Resmi | Peserta wajib mendaftar menggunakan identitas asli (KTP/SIM/Kartu Pelajar/Paspor) yang masih berlaku. • Pendaftaran dinyatakan sah setelah verifikasi pembayaran oleh panitia. • Tiket yang telah dibeli bersifat final dan tidak dapat direfund atas alasan apapun.",
      "02. Kesiapan Fisik & Medis | Peserta wajib berada dalam kondisi sehat jasmani dan rohani serta siap menempuh jarak 5 km. • Peserta dengan riwayat penyakit khusus wajib berkonsultasi dengan dokter sebelum berlari. • Panitia menyediakan tim medis darurat namun tidak bertanggung jawab atas kondisi medis bawaan peserta.",
      "03. Aturan Penggunaan Nomor BIB | Nomor BIB wajib dipasang di bagian depan dada secara jelas selama acara berlangsung. • Dilarang memindahtangankan, memalsukan, atau memperjualbelikan nomor BIB kepada pihak lain. • Pelanggaran penggunaan BIB berakibat diskualifikasi dari perebutan juara dan doorprize.",
      "04. Regulasi Lomba & Rute 5K | Peserta wajib menempuh rute resmi 5K yang ditetapkan panitia dan melewati seluruh water station. • Penggunaan kendaraan bermotor, sepeda listrik, atau jalan pintas (shortcut) dilarang keras dan akan didiskualifikasi seketika. • Peserta wajib mematuhi arahan marshal dan petugas lalu lintas.",
      "05. Pengambilan Race Pack (RPC) | Race Pack wajib diambil sesuai jadwal pada 30-31 Juli 2026 dengan menunjukkan bukti pendaftaran terverifikasi. • Race Pack yang tidak diambil sampai tenggat waktu penutupan tidak dapat dikirim menyusul atau diuangkan.",
      "06. Force Majeure & Keputusan Mutlak | Dalam kondisi kahar (hujan badai ekstrem, bencana, kebijakan keamanan), panitia berhak menyesuaikan jadwal atau rute demi keselamatan. • Seluruh keputusan dewan juri dan panitia terkait hasil finish dan teknis acara bersifat mutlak dan tidak dapat diganggu gugat.",
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
    eventTime: "05.00 WIB - selesai",
    location: {
      lat: -7.7130878,
      lng: 110.0090583,
      label: "Alun-Alun Purworejo",
      plusCode: "72P5+QJ",
    },
    hero: {
      badge: `${FEST_FULL_NAME} Presents`,
      headline: "Futuristic Bike",
      subheadline: "Ride pagi bertema sunrise, satu paket Fun Ride. Koordinasi bersama PLF & ICF.",
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
      "Futuristic Bike dimulai pukul 05.00 WIB dengan alur registrasi, briefing keselamatan, fun ride hingga finish, istirahat, hiburan band, pembagian doorprize, dan penutup.",
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
      { id: "participation", label: "Fun Ride non-kompetitif, fokus pada partisipasi dan kebersamaan" },
      { id: "appreciation", label: "Uang pembinaan + piala penghargaan + doorprize utama" },
    ],
    benefit: [
      "Jersey event",
      "Nomor peserta",
      "E-sertifikat",
      "Refreshment (air + snack)",
      "Doorprize",
      "Hiburan",
      "Tim medis & marshal pengawal rute",
    ],
    benefits: [
      { id: "jersey", icon: "Ticket", title: "Jersey Event", value: "Jersey event peserta.", status: "ready" },
      { id: "participant-number", icon: "BadgeCheck", title: "Nomor Peserta", value: "Nomor identitas peserta ride.", status: "ready" },
      { id: "refreshment", icon: "CupSoda", title: "Refreshment", value: "Air mineral dan snack peserta.", status: "ready" },
      { id: "medical-marshal", icon: "ShieldCheck", title: "Medis & Marshal", value: "Tim medis dan marshal pengawal rute.", status: "ready" },
    ],
    racepack: [
      "Jersey event",
      "Nomor peserta",
      "E-sertifikat",
      "Refreshment peserta",
    ],
    hiburan: [
      "Band SUNFLOW",
      "Ollsame",
    ],
    rute: null,
    doorprize: [
      "Doorprize pembelian panitia",
      "Dukungan sponsor",
      "Diundi saat acara",
    ],
    contactPersons: [
      { name: "Panitia Registrasi", role: "Informasi peserta", contact: DEFAULT_WHATSAPP },
      { name: "Email Resmi", role: "Administrasi", contact: CONTACT_EMAIL },
    ],
    faq: [
      {
        q: "Kapan dan di mana pelaksanaan Futuristic Bike 2026?",
        a: "Futuristic Bike dilaksanakan pada Minggu pagi, 2 Agustus 2026. Persiapan dan kumpul dimulai pukul 05.00 WIB menyambut sunrise cerah, dengan titik start dan finish di Alun-Alun Purworejo.",
      },
      {
        q: "Apakah acara ini merupakan lomba balap sepeda adu kecepatan?",
        a: "Bukan. Futuristic Bike adalah kegiatan Fun Ride / gowes santai bertema kebersamaan dan gaya hidup sehat. Tidak ada pencatatan waktu pemenang (no timing chip), melainkan apresiasi kebersamaan, undian doorprize menarik, dan hiburan pagi.",
      },
      {
        q: "Jenis sepeda apa saja yang diperbolehkan untuk mengikuti Fun Ride ini?",
        a: "Seluruh jenis sepeda yang laik jalan diperbolehkan ikut serta, mulai dari Sepeda Gunung (MTB), Sepeda Lipat (Seli), Road Bike, Gravel, Minivelo, hingga Sepeda Kota (City Bike). Pastikan rem depan dan belakang berfungsi sempurna sebelum beranjak.",
      },
      {
        q: "Berapa biaya pendaftaran dan apa saja fasilitas yang didapat?",
        a: "Biaya pendaftaran mengikuti ketentuan paket resmi panitia. Peserta berhak mendapatkan Jersey Eksklusif Futuristic Bike, Nomor Peserta (Plat Sepeda/BIB), E-Sertifikat Finisher, Refreshment (snack & air mineral), kupon undian Doorprize utama, serta pengawalan tim marshal & medis.",
      },
      {
        q: "Bagaimana rute perjalanan dan apakah aman untuk pemula atau keluarga?",
        a: "Rute dirancang mengelilingi keindahan kota Purworejo dengan jalan raya beraspal mulus berjarak tempuh santai dan ramah pemula. Pengawalan ketat oleh marshal ICF/PLF dan kepolisian memastikan kenyamanan seluruh rombongan peleton.",
      },
      {
        q: "Apakah anak-atau anggota keluarga di bawah umur diperbolehkan ikut?",
        a: "Tentu! Ini adalah event gowes ramah keluarga. Anak-anak di bawah usia 15 tahun sangat diperbolehkan bergabung dengan syarat wajib didampingi oleh orang tua atau wali yang juga terdaftar resmi sebagai peserta.",
      },
    ],
    rules: [
      "01. Pendaftaran & Identitas Resmi | Peserta wajib mendaftar dengan identitas asli yang sah. • Pendaftaran baru dianggap selesai setelah bukti transfer diverifikasi sistem. • Slot kepesertaan bersifat final dan tidak dapat dibatalkan atau direfund.",
      "02. Kelayakan & Kondisi Sepeda | Peserta wajib menggunakan sepeda dalam kondisi prima dan laik jalan. • Sistem pengereman (rem depan dan belakang) wajib berfungsi dengan baik. • Disarankan memasang lampu depan atau reflektor karena start dilakukan pagi hari.",
      "03. Wajib Helm & Perlengkapan Safety | Setiap peserta diwajibkan memakai helm bersepeda (cycling helmet) dan sepatu tertutup selama aktivitas ride berlangsung demi keselamatan. • Peserta tanpa helm dilarang memasuki barisan peleton utama.",
      "04. Regulasi Rute & Tata Tertib Peleton | Peserta wajib mengikuti rute yang telah ditentukan panitia dan dilarang mendahului road captain/marshal terdepan. • Jaga jarak aman antar pesepeda dan patuhi rambu-rambu lalu lintas serta arahan petugas di lapangan.",
      "05. Peserta Anak & Pendampingan | Peserta di bawah usia 15 tahun berada di bawah tanggung jawab penuh orang tua/pendamping. • Pendamping wajib memastikan keselamatan dan laju sepeda anak selama kegiatan berlangsung.",
      "06. Keputusan Panitia & Darurat | Dalam situasi keadaan kahar (cuaca ekstrem atau kendala lalu lintas), panitia berhak mengubah rute atau memendekkan jarak tempuh demi keselamatan bersama. • Seluruh keputusan panitia bersifat mutlak dan final.",
    ],
  },
};

export const EVENT_LIST = [EVENTS["futuristic-run"], EVENTS["fun-bike"]] as const;

export function getEventContent(slug: EventSlug): EventContent {
  return EVENTS[slug];
}
