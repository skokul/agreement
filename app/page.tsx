import { Suspense } from "react";
import { randomUUID } from "crypto";
import { AgreementWorkspace } from "@/components/agreement-workspace";

export default function HomePage() {
  const agreementId = randomUUID();
  return (
    <Suspense fallback={<div className="p-6 text-sm text-ink-600">Loading agreement workspace...</div>}>
      <AgreementWorkspace mode="new" agreementId={agreementId} />
    </Suspense>
  );
}
