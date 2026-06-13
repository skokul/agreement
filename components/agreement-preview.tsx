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

      <section className="rounded-3xl border border-ink-200 bg-white p-5">
        <h3 className="text-base font-semibold text-ink-900">Schedule and signatures</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-ink-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Schedule</p>
            <p className="mt-2 text-sm leading-6 text-ink-700">{model.property.fullAddress || "Not specified"}</p>
          </div>
          <div className="rounded-2xl bg-ink-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Witnesses</p>
            <div className="mt-3 space-y-3 text-sm text-ink-700">
              {model.witnesses.map((witness, index) => (
                <div key={index} className="space-y-1">
                  <p className="font-medium text-ink-900">
                    Witness {index + 1}: {witness.name || "Not specified"}
                  </p>
                  <p>{witness.address || "Not specified"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {model.signatures.map((signature) => (
            <div key={signature.role} className="rounded-2xl border border-dashed border-ink-300 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">{signature.role}</p>
              <p className="mt-2 text-sm font-semibold text-ink-900">{signature.name || "Not specified"}</p>
              <p className="mt-1 text-sm text-ink-600">{signature.address || "Not specified"}</p>
              <p className="mt-1 text-sm text-ink-600">{signature.mobile || "Not specified"}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

