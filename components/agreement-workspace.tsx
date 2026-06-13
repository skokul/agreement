"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AgreementFormValues } from "@/lib/agreement-schema";
import { agreementSchema } from "@/lib/agreement-schema";
import { createDefaultAgreementValues } from "@/lib/agreement-defaults";
import { AgreementForm } from "@/components/agreement-form";
import { AgreementPreview } from "@/components/agreement-preview";
import { DownloadButtons } from "@/components/download-buttons";
import { ShareButton } from "@/components/share-button";
import { buildAgreementShareLink, decodeAgreementSnapshot } from "@/lib/agreement-share";
import { buildAgreementTemplate } from "@/lib/agreement-template";
import { safeFileName } from "@/lib/format";
import { getAgreementRecord, upsertAgreementRecord } from "@/lib/agreement-storage";

type WorkspaceMode = "new" | "view" | "edit";

interface AgreementWorkspaceProps {
  mode: WorkspaceMode;
  agreementId: string;
}

export function AgreementWorkspace({ mode, agreementId }: AgreementWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [defaultValues] = useState(() => createDefaultAgreementValues());
  const searchQuery = searchParams.toString();

  const form = useForm<AgreementFormValues>({
    resolver: zodResolver(agreementSchema),
    defaultValues,
    mode: "onChange"
  });

  const watchedValues = useWatch({ control: form.control });
  const currentValues = {
    ...defaultValues,
    ...(watchedValues ?? {})
  } as AgreementFormValues;
  const template = buildAgreementTemplate(currentValues);

  const [hydrated, setHydrated] = useState(mode === "new");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAgreement() {
      const snapshotParam = new URLSearchParams(searchQuery).get("snapshot");
      const snapshot = snapshotParam ? decodeAgreementSnapshot(snapshotParam) : null;

    if (mode === "new") {
        if (!active) {
          return;
        }

        if (snapshot?.record?.values) {
          form.reset(snapshot.record.values);
          await form.trigger();
          setStatus("Loaded shared snapshot.");
        } else {
          form.reset(defaultValues);
          await form.trigger();
        }

        setHydrated(true);
        return;
      }

      const existing = await getAgreementRecord(agreementId);
      if (!active) {
        return;
      }

      if (existing) {
        form.reset(existing.values);
        await form.trigger();
        setHydrated(true);
        setStatus(null);
        return;
      }

      if (snapshot?.record?.values) {
        form.reset(snapshot.record.values);
        await upsertAgreementRecord(agreementId, snapshot.record.values);
        await form.trigger();
        setHydrated(true);
        setStatus("Loaded shared snapshot.");
        return;
      }

      setLoadError("No saved agreement was found for this ID.");
      setHydrated(true);
    }

    loadAgreement();

    return () => {
      active = false;
    };
  }, [agreementId, defaultValues, form, mode, searchQuery]);

  async function handleSave(values: AgreementFormValues) {
    const record = await upsertAgreementRecord(agreementId, values);
    setStatus(mode === "new" ? "Draft saved locally." : "Changes saved locally.");
    if (mode === "new") {
      router.replace(`/agreement/${record.id}/edit`);
      return;
    }
    form.reset(record.values);
    void form.trigger();
  }

  const shareLinkBuilder = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const record = {
      id: agreementId,
      values: currentValues,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return origin ? buildAgreementShareLink(origin, { record }) : "";
  };

  const filenameBase = safeFileName(`leave-license-${agreementId}`);
  const isReady = hydrated && !loadError;
  const canExport = isReady && form.formState.isValid;

  const header = (
    <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">
          {mode === "new" ? "Create" : mode === "edit" ? "Edit" : "View"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
          Leave & License Agreement Builder
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-ink-600">
          Local-first agreement editor with live preview, DOCX and PDF export, and shareable links.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/agreement/new" className="button-secondary">
          New Agreement
        </Link>
        {mode !== "new" ? (
          <Link href={`/agreement/${agreementId}/edit`} className="button-secondary">
            Edit
          </Link>
        ) : null}
        {mode !== "view" ? (
          <Link href={`/agreement/${agreementId}`} className="button-secondary">
            Read-only view
          </Link>
        ) : null}
      </div>
    </header>
  );

  if (loadError && mode !== "new") {
    return (
      <div className="mx-auto min-h-screen max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="document-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-500">Agreement not found</p>
          <h1 className="mt-2 text-2xl font-semibold text-ink-950">No saved agreement found for this ID.</h1>
          <p className="mt-3 text-sm text-ink-600">{loadError}</p>
          <div className="mt-6">
            <Link href="/agreement/new" className="button-primary">
              Create a new agreement
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {header}
        <div className="document-card p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-500">Loading agreement</p>
          <div className="mt-4 space-y-3">
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-ink-200" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-ink-200" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-ink-200" />
          </div>
        </div>
      </div>
    );
  }

  if (mode === "view") {
    return (
      <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {header}
        <div className="document-card p-5 sm:p-6">
          <AgreementPreview model={template} />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <DownloadButtons model={template} filenameBase={filenameBase} disabled={!canExport} />
            <ShareButton getLink={shareLinkBuilder} disabled={!isReady} />
          </div>
          {status ? <p className="mt-4 text-sm text-ink-600">{status}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {header}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div className="document-card p-5 sm:p-6">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-5">
              <AgreementForm />
              <div className="flex flex-wrap items-center gap-3 border-t border-ink-200 pt-5">
                <button type="submit" className="button-primary" disabled={!canExport || form.formState.isSubmitting}>
                  {mode === "new" ? "Save Draft" : "Save Changes"}
                </button>
                <DownloadButtons model={template} filenameBase={filenameBase} disabled={!canExport} />
                <ShareButton getLink={shareLinkBuilder} disabled={!isReady} />
              </div>
              {status ? <p className="text-sm text-ink-600">{status}</p> : null}
            </form>
          </FormProvider>
        </div>

        <div className="document-card p-5 sm:p-6">
          <AgreementPreview model={template} />
        </div>
      </div>
    </div>
  );
}
