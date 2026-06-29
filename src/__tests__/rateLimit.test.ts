import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit } from "@/lib/rateLimit";

// Mock NextRequest
function mockRequest(ip = "127.0.0.1") {
  return {
    headers: new Map([
      ["x-forwarded-for", ip],
    ]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

describe("checkRateLimit", () => {
  beforeEach(() => {
    // Reset internal state by using a unique bucket name per test
  });

  it("allows requests under limit", () => {
    const req = mockRequest("10.0.0.1");
    const result = checkRateLimit(req, "test-under-limit-" + Date.now(), 5, 60_000);
    expect(result.allowed).toBe(true);
  });

  it("returns correct headers", () => {
    const req = mockRequest("10.0.0.2");
    const bucket = "test-headers-" + Date.now();
    const result = checkRateLimit(req, bucket, 5, 60_000);
    expect(result.headers).toBeDefined();
    expect(result.headers["X-RateLimit-Limit"]).toBe("5");
  });

  it("blocks requests over limit", () => {
    const req = mockRequest("10.0.0.3");
    const bucket = "test-block-" + Date.now();
    // Consume all tokens
    for (let i = 0; i < 5; i++) {
      checkRateLimit(req, bucket, 5, 60_000);
    }
    // Next request should be blocked
    const result = checkRateLimit(req, bucket, 5, 60_000);
    expect(result.allowed).toBe(false);
  });

  it("separates buckets by IP", () => {
    const req1 = mockRequest("10.0.0.4");
    const req2 = mockRequest("10.0.0.5");
    const bucket = "test-separate-" + Date.now();

    // Consume all tokens for IP1
    for (let i = 0; i < 5; i++) {
      checkRateLimit(req1, bucket, 5, 60_000);
    }

    // IP2 should still be allowed
    const result = checkRateLimit(req2, bucket, 5, 60_000);
    expect(result.allowed).toBe(true);
  });
});
