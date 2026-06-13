import type { AgreementClause } from "@/lib/agreement-template";

interface ClauseSectionProps extends AgreementClause {
  className?: string;
}

export function ClauseSection({ number, title, paragraphs, className }: ClauseSectionProps) {
  return (
    <section className={`rounded-2xl border border-ink-200 bg-white p-4 sm:p-5 ${className ?? ""}`}>
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-semibold text-white">
          {number}
        </div>
        <div>
          <h3 className="text-base font-semibold text-ink-900">{title}</h3>
        </div>
      </div>

      <div className="space-y-3 text-sm leading-6 text-ink-700">
        {paragraphs.map((paragraph, index) => (
          <p key={`${number}-${index}`} className="whitespace-pre-line text-justify">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

