import { createElement } from "react";
import type { AgreementDocumentModel } from "@/lib/agreement-template";

export async function createAgreementPdfBlob(model: AgreementDocumentModel) {
  const [{ pdf }, { AgreementPdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/agreement-pdf")
  ]);

  return pdf(createElement(AgreementPdfDocument, { model })).toBlob();
}

