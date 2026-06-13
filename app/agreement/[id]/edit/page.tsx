import { Suspense } from "react";
import { AgreementWorkspace } from "@/components/agreement-workspace";

interface AgreementEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AgreementEditPage({ params }: AgreementEditPageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="p-6 text-sm text-ink-600">Loading agreement editor...</div>}>
      <AgreementWorkspace mode="edit" agreementId={id} />
    </Suspense>
  );
}
