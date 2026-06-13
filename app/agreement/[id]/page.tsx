import { Suspense } from "react";
import { AgreementWorkspace } from "@/components/agreement-workspace";

interface AgreementPageProps {
  params: Promise<{ id: string }>;
}

export default async function AgreementPage({ params }: AgreementPageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="p-6 text-sm text-ink-600">Loading agreement...</div>}>
      <AgreementWorkspace mode="view" agreementId={id} />
    </Suspense>
  );
}
