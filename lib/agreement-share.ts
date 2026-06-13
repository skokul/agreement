import type { AgreementRecord } from "@/lib/agreement-storage";

export interface AgreementSnapshot {
  record: AgreementRecord;
}

function toBase64Url(value: string) {
  if (typeof window === "undefined") {
    return "";
  }

  const utf8 = encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, hex) =>
    String.fromCharCode(Number.parseInt(hex, 16))
  );
  return window.btoa(utf8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  if (typeof window === "undefined") {
    return "";
  }

  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = window.atob(padded);
  const utf8 = Array.from(binary, (char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`).join("");
  return decodeURIComponent(utf8);
}

export function encodeAgreementSnapshot(snapshot: AgreementSnapshot) {
  return toBase64Url(JSON.stringify(snapshot));
}

export function decodeAgreementSnapshot(encoded: string) {
  if (!encoded) {
    return null;
  }

  try {
    const json = fromBase64Url(encoded);
    const parsed = JSON.parse(json) as AgreementSnapshot;
    if (!parsed?.record?.id || !parsed.record.values) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function buildAgreementShareLink(origin: string, snapshot: AgreementSnapshot) {
  const encoded = encodeAgreementSnapshot(snapshot);
  return `${origin}/agreement/${snapshot.record.id}?snapshot=${encoded}`;
}

