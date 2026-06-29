import { describe, expect, it } from "vitest";
import { PRIZES, PRIZE_FIELDS } from "@/data/prizes";

describe("Futuristic Run prizes", () => {
  it("has the final Rp4.200.000 allocated pool", () => {
    const total = PRIZES.reduce((sum, prize) => (
      sum + PRIZE_FIELDS.reduce((subtotal, field) => (
        subtotal + (typeof prize[field] === "number" ? prize[field] : 0)
      ), 0)
    ), 0);
    expect(total).toBe(4_200_000);
  });

  it("leaves only SD prize allocations unannounced", () => {
    const sd = PRIZES.filter((prize) => prize.kategori.startsWith("SD"));
    const announced = PRIZES.filter((prize) => !prize.kategori.startsWith("SD"));
    expect(sd).toHaveLength(2);
    expect(sd.every((prize) => PRIZE_FIELDS.every((field) => prize[field] === null))).toBe(true);
    expect(announced.every((prize) => PRIZE_FIELDS.every((field) => prize[field] !== null))).toBe(true);
  });
});
