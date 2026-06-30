import { createHash, timingSafeEqual } from "node:crypto";

type RegistrationAccessRow = {
  registration_access_token_hash?: string | null;
  phone?: string | null;
  email?: string | null;
};

export function hashRegistrationAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function safeHashMatch(expectedHex: string, token: string) {
  if (!/^[a-f0-9]{64}$/i.test(expectedHex)) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const actual = Buffer.from(hashRegistrationAccessToken(token), "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("62")) return `0${digits.slice(2)}`;
  return digits;
}

export function verifyRegistrationAccess(
  participant: RegistrationAccessRow,
  accessToken?: string | null,
  contact?: string | null,
) {
  const token = accessToken?.trim();
  const expectedHash = participant.registration_access_token_hash?.trim();
  if (token && expectedHash && safeHashMatch(expectedHash, token)) return true;

  const candidate = contact?.trim().toLowerCase();
  if (!candidate && !token) return true;
  if (!candidate) return false;
  if (candidate.includes("@")) return candidate === participant.email?.trim().toLowerCase();
  return normalizePhone(candidate) === normalizePhone(participant.phone ?? "");
}

