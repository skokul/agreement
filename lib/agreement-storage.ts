import type { AgreementFormValues } from "@/lib/agreement-schema";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "leave-license-agreements:v1";

export interface AgreementRecord {
  id: string;
  values: AgreementFormValues;
  createdAt: string;
  updatedAt: string;
}

type AgreementStore = {
  records: Record<string, AgreementRecord>;
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStore(): AgreementStore {
  if (!canUseLocalStorage()) {
    return { records: {} };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { records: {} };
  }

  try {
    const parsed = JSON.parse(raw) as AgreementStore;
    return parsed && typeof parsed === "object" && parsed.records ? parsed : { records: {} };
  } catch {
    return { records: {} };
  }
}

function writeStore(store: AgreementStore) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function listAgreementRecords() {
  return Object.values(readStore().records).sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function getAgreementRecord(id: string) {
  return readStore().records[id] ?? null;
}

export async function saveAgreementRecord(record: AgreementRecord) {
  const store = readStore();
  store.records[record.id] = record;
  writeStore(store);
  return record;
}

export async function upsertAgreementRecord(id: string, values: AgreementFormValues) {
  const store = readStore();
  const now = new Date().toISOString();
  const existing = store.records[id];
  const record: AgreementRecord = {
    id: existing?.id ?? id ?? uuidv4(),
    values,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  };

  store.records[record.id] = record;
  writeStore(store);
  return record;
}

export async function removeAgreementRecord(id: string) {
  const store = readStore();
  delete store.records[id];
  writeStore(store);
}

