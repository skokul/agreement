import { AgreementWorkspace } from "@/components/agreement-workspace";

interface AgreementEditPageProps {
  params: { id: string };
}

export default function AgreementEditPage({ params }: AgreementEditPageProps) {
  const { id } = params;
  return <AgreementWorkspace mode="edit" agreementId={id} />;
}
