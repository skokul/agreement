import { AgreementWorkspace } from "@/components/agreement-workspace";

interface AgreementPageProps {
  params: { id: string };
}

export default function AgreementPage({ params }: AgreementPageProps) {
  const { id } = params;
  return <AgreementWorkspace mode="view" agreementId={id} />;
}
