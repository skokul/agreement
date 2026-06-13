import type { AgreementFormValues } from "@/lib/agreement-schema";

export function normalizeText(value: string | null | undefined) {
  return (value ?? "").trim().replace(/\s+/g, " ");
}

export function joinNonEmpty(parts: Array<string | null | undefined>, separator = ", ") {
  return parts.map(normalizeText).filter(Boolean).join(separator);
}

export function formatDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatAgreementDate(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return normalizeText(dateValue);
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function formatAgreementDateTime(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return normalizeText(dateValue);
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function buildPropertyAddress(values: Pick<
  AgreementFormValues,
  | "propertyDoorNo"
  | "propertyStreet"
  | "propertyArea"
  | "propertyCity"
  | "propertyDistrict"
  | "propertyState"
  | "propertyPincode"
  | "fullPropertyAddress"
>) {
  const structuredAddress = joinNonEmpty([
    values.propertyDoorNo,
    values.propertyStreet,
    values.propertyArea,
    values.propertyCity,
    values.propertyDistrict,
    values.propertyState,
    values.propertyPincode
  ]);

  return normalizeText(values.fullPropertyAddress) || structuredAddress;
}

export function safeFileName(value: string) {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

  return cleaned || "agreement";
}
