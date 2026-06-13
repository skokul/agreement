import type { AgreementDocumentModel } from "@/lib/agreement-template";
import { ClauseSection } from "@/components/clause-section";

interface AgreementPreviewProps {
  model: AgreementDocumentModel;
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-ink-900">{value || "Not specified"}</p>
    </div>
  );
}

export function AgreementPreview({ model }: AgreementPreviewProps) {
  return (
    <article className="space-y-6">
      <header className="space-y-3 rounded-3xl border border-ink-200 bg-gradient-to-br from-white via-white to-ink-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">Agreement preview</p>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink-950">{model.title}</h2>
          <p className="mt-1 text-sm text-ink-600">{model.subtitle}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <DetailLine label="Licensor" value={model.parties.licensor.name} />
          <DetailLine label="Licensee" value={model.parties.licensee.name} />
          <DetailLine label="Property" value={model.property.description} />
          <DetailLine label="Location" value={model.place} />
        </div>
      </header>

      <div className="space-y-4">
        {model.clauses.map((clause) => (
          <ClauseSection key={clause.number} {...clause} />
        ))}
      </div>
    </article>
  );
}
