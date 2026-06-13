"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import type { AgreementDocumentModel } from "@/lib/agreement-template";
import { createAgreementDocxBlob } from "@/lib/export-docx";
import { createAgreementPdfBlob } from "@/lib/export-pdf";
import { safeFileName } from "@/lib/format";

interface DownloadButtonsProps {
  model: AgreementDocumentModel;
  filenameBase: string;
  disabled?: boolean;
}

export function DownloadButtons({ model, filenameBase, disabled }: DownloadButtonsProps) {
  const [busy, setBusy] = useState<"docx" | "pdf" | null>(null);

  async function handleDocx() {
    setBusy("docx");
    try {
      const blob = await createAgreementDocxBlob(model);
      saveAs(blob, `${safeFileName(filenameBase)}.docx`);
    } finally {
      setBusy(null);
    }
  }

  async function handlePdf() {
    setBusy("pdf");
    try {
      const blob = await createAgreementPdfBlob(model);
      saveAs(blob, `${safeFileName(filenameBase)}.pdf`);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" className="button-secondary" onClick={handleDocx} disabled={disabled || busy !== null}>
        {busy === "docx" ? "Preparing DOCX..." : "Download DOCX"}
      </button>
      <button type="button" className="button-secondary" onClick={handlePdf} disabled={disabled || busy !== null}>
        {busy === "pdf" ? "Preparing PDF..." : "Download PDF"}
      </button>
    </div>
  );
}

