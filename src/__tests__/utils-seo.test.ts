import { describe, it, expect, vi } from "vitest";

// Mock insforge module before importing utils
vi.mock("@/lib/insforge", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockDb: any = {};
  mockDb.from = () => mockDb;
  mockDb.select = () => mockDb;
  mockDb.eq = () => mockDb;
  mockDb.order = () => mockDb;
  mockDb.maybeSingle = () => Promise.resolve({ data: null, error: null });
  return { insforge: { database: mockDb } };
});

import {
  formatCurrency,
  formatDate,
  getPaymentStatusLabel,
  getPaymentStatusColor,
  generateRegistrationNumber,
  generateBibNumber,
} from "@/lib/utils";
import {
  EVENT_SEO,
  eventMetadata,
  registerMetadata,
  eventJsonLd,
  hubMetadata,
  withOperationalEventSeo,
} from "@/lib/seo";
import { DEFAULT_EVENT_DATES, formatTanggalID } from "@/lib/eventDate";

describe("formatCurrency", () => {
  it("formats IDR correctly", () => {
    expect(formatCurrency(200000)).toContain("200.000");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toContain("0");
  });
});

describe("formatDate", () => {
  it("formats date in Indonesian locale", () => {
    const result = formatDate("2026-06-22");
    expect(result).toContain("2026");
    expect(result).toContain("Juni");
  });
});

describe("getPaymentStatusLabel", () => {
  it("returns correct labels", () => {
    expect(getPaymentStatusLabel("pending")).toBe("Menunggu Pembayaran");
    expect(getPaymentStatusLabel("verified")).toBe("Terverifikasi");
    expect(getPaymentStatusLabel("rejected")).toBe("Ditolak");
  });

  it("returns raw status for unknown", () => {
    expect(getPaymentStatusLabel("unknown")).toBe("unknown");
  });
});

describe("getPaymentStatusColor", () => {
  it("returns correct colors", () => {
    expect(getPaymentStatusColor("pending")).toBe("#FF8C00");
    expect(getPaymentStatusColor("verified")).toBe("#00E5FF");
    expect(getPaymentStatusColor("rejected")).toBe("#FF006E");
  });
});

describe("generateRegistrationNumber", () => {
  it("generates futuristic-run number", () => {
    expect(generateRegistrationNumber("futuristic-run", 1)).toBe("FR2026-0001");
    expect(generateRegistrationNumber("futuristic-run", 123)).toBe("FR2026-0123");
  });

  it("generates fun-bike number", () => {
    expect(generateRegistrationNumber("fun-bike", 1)).toBe("FB2026-0001");
    expect(generateRegistrationNumber("fun-bike", 999)).toBe("FB2026-0999");
  });
});

describe("generateBibNumber", () => {
  it("starts at 1001", () => {
    expect(generateBibNumber(1)).toBe(1001);
    expect(generateBibNumber(100)).toBe(1100);
  });
});

describe("SEO", () => {
  describe("EVENT_SEO", () => {
    it("has both events configured", () => {
      expect(EVENT_SEO["futuristic-run"]).toBeDefined();
      expect(EVENT_SEO["fun-bike"]).toBeDefined();
    });

    it("does not hardcode operational event dates", () => {
      expect(EVENT_SEO["futuristic-run"].eventDate).toBeNull();
      expect(EVENT_SEO["fun-bike"].eventDate).toBeNull();
    });
  });

  describe("eventMetadata", () => {
    it("generates correct title", () => {
      const meta = eventMetadata(EVENT_SEO["futuristic-run"]);
      expect(meta.title).toContain("Futuristic Run 2026");
    });

    it("includes Open Graph", () => {
      const meta = eventMetadata(EVENT_SEO["fun-bike"]);
      expect(meta.openGraph).toBeDefined();
      expect(meta.openGraph?.title).toContain("Futuristic Bike 2026");
    });

    it("includes Twitter card", () => {
      const meta = eventMetadata(EVENT_SEO["futuristic-run"]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((meta.twitter as any)?.card).toBe("summary_large_image");
    });

    it("includes canonical URL", () => {
      const meta = eventMetadata(EVENT_SEO["futuristic-run"]);
      expect(meta.alternates?.canonical).toContain("futuristic-run");
    });
  });

  describe("registerMetadata", () => {
    it("includes Daftar in title", () => {
      const meta = registerMetadata(EVENT_SEO["futuristic-run"]);
      expect(meta.title).toContain("Daftar");
      expect(meta.title).toContain("Futuristic Run 2026");
    });
  });

  describe("eventJsonLd", () => {
    it("generates SportsEvent schema", () => {
      const jsonLd = eventJsonLd(EVENT_SEO["futuristic-run"]);
      expect(jsonLd["@type"]).toBe("SportsEvent");
      expect(jsonLd.name).toBe("Futuristic Run 2026");
    });

    it("omits location when operational data is not available", () => {
      const jsonLd = eventJsonLd(EVENT_SEO["fun-bike"]);
      expect(jsonLd.location).toBeUndefined();
    });

    it("includes organizer", () => {
      const jsonLd = eventJsonLd(EVENT_SEO["futuristic-run"]);
      const organizer = jsonLd.organizer as { name: string };
      expect(organizer.name).toBe("Himatekno UMPWR");
    });

    it("uses the exact WIB start dates from event settings", () => {
      const run = eventJsonLd(withOperationalEventSeo(EVENT_SEO["futuristic-run"], DEFAULT_EVENT_DATES["futuristic-run"], null));
      const bike = eventJsonLd(withOperationalEventSeo(EVENT_SEO["fun-bike"], DEFAULT_EVENT_DATES["fun-bike"], null));
      expect(run.startDate).toBe("2026-08-01T18:00:00+07:00");
      expect(bike.startDate).toBe("2026-08-02T05:00:00+07:00");
    });

    it("omits pricing when operational data is not available", () => {
      const jsonLd = eventJsonLd(EVENT_SEO["futuristic-run"]);
      expect(jsonLd.offers).toBeUndefined();
    });
  });

  describe("hubMetadata", () => {
    it("has correct title", () => {
      expect(hubMetadata.title).toContain("Futuristic Vibes 2026");
    });

    it("has Open Graph images", () => {
      expect(hubMetadata.openGraph?.images).toBeDefined();
    });
  });
});

describe("formatTanggalID", () => {
  it("formats the final dates in Asia/Jakarta", () => {
    expect(formatTanggalID(DEFAULT_EVENT_DATES["futuristic-run"])).toBe("Sabtu, 1 Agustus 2026");
    expect(formatTanggalID(DEFAULT_EVENT_DATES["fun-bike"])).toBe("Minggu, 2 Agustus 2026");
  });
});
