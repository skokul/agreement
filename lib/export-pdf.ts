import { createElement } from "react";
import type { AgreementDocumentModel } from "@/lib/agreement-template";

export async function createAgreementPdfBlob(model: AgreementDocumentModel) {
  const [{ pdf }, { AgreementPdfDocument }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/agreement-pdf")
  ]);

  const renderPdf = pdf as unknown as (document: ReturnType<typeof createElement>) => {
    toBlob: () => Promise<Blob>;
  };
  return renderPdf(createElement(AgreementPdfDocument, { model })).toBlob();
}
