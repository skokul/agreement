import { AgreementWorkspace } from "@/components/agreement-workspace";

interface AgreementPageProps {
  params: Promise<{ id: string }>;
}

export default async function AgreementPage({ params }: AgreementPageProps) {
  const { id } = await params;
  return <AgreementWorkspace mode="view" agreementId={id} />;
}

