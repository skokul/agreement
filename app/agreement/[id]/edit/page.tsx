import { AgreementWorkspace } from "@/components/agreement-workspace";

interface AgreementEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AgreementEditPage({ params }: AgreementEditPageProps) {
  const { id } = await params;
  return <AgreementWorkspace mode="edit" agreementId={id} />;
}

