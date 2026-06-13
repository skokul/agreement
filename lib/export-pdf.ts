import { createElement, type ReactElement } from "react";
import type { AgreementDocumentModel } from "@/lib/agreement-template";

export async function createAgreementPdfBlob(model: AgreementDocumentModel) {
  const [{ pdf }, { AgreementPdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/agreement-pdf")
  ]);

  const documentElement = createElement(AgreementPdfDocument, { model }) as unknown as ReactElement;
  return pdf(documentElement).toBlob();
}
