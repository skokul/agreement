import { randomUUID } from "crypto";
import { AgreementWorkspace } from "@/components/agreement-workspace";

export default function NewAgreementPage() {
  const agreementId = randomUUID();
  return <AgreementWorkspace mode="new" agreementId={agreementId} />;
}

