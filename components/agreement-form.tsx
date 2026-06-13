"use client";

import { useFormContext, type Path } from "react-hook-form";
import type { AgreementFormValues } from "@/lib/agreement-schema";

type FieldKind = "text" | "email" | "date" | "textarea" | "checkbox";

type FieldDescriptor = {
  name: Path<AgreementFormValues>;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  help?: string;
  rows?: number;
};

const sections: Array<{
  title: string;
  description: string;
  fields: FieldDescriptor[];
}> = [
  {
    title: "Agreement Details",
    description: "Core dates and location of execution.",
    fields: [
      { name: "agreementPlace", label: "Agreement place", kind: "text", placeholder: "Place of execution" },
      { name: "agreementDate", label: "Agreement date", kind: "date" },
      { name: "agreementStartDate", label: "Agreement start date", kind: "date" },
      { name: "agreementEndDate", label: "Agreement end date", kind: "date" },
      { name: "agreementTermMonths", label: "Agreement term (months)", kind: "text", placeholder: "11" }
    ]
  },
  {
    title: "Owner / Licensor",
    description: "The property owner or licensor details.",
    fields: [
      { name: "ownerName", label: "Owner name", kind: "text" },
      { name: "ownerFatherName", label: "Owner father name", kind: "text" },
      { name: "ownerAge", label: "Owner age", kind: "text" },
      { name: "ownerAddress", label: "Owner address", kind: "textarea", rows: 3 },
      { name: "ownerMobile", label: "Owner mobile", kind: "text" },
      { name: "ownerEmail", label: "Owner email", kind: "email" },
      { name: "ownerIdType", label: "Owner ID type (optional)", kind: "text", help: "Leave blank if you do not want to provide an owner ID." },
      { name: "ownerIdNumber", label: "Owner ID number (optional)", kind: "text" },
      { name: "ownerUpiId", label: "Owner UPI ID (optional)", kind: "text" }
    ]
  },
  {
    title: "Tenant / Licensee",
    description: "The person occupying the premises under license.",
    fields: [
      { name: "tenantName", label: "Tenant name", kind: "text" },
      { name: "tenantFatherName", label: "Tenant father name", kind: "text" },
      { name: "tenantAge", label: "Tenant age", kind: "text" },
      { name: "tenantAddress", label: "Tenant address", kind: "textarea", rows: 3 },
      { name: "tenantMobile", label: "Tenant mobile", kind: "text" },
      { name: "tenantEmail", label: "Tenant email", kind: "email" },
      { name: "tenantIdType", label: "Tenant ID type", kind: "text" },
      { name: "tenantIdNumber", label: "Tenant ID number", kind: "text" }
    ]
  },
  {
    title: "Property",
    description: "Structured and full property description.",
    fields: [
      { name: "propertyType", label: "Property type", kind: "text", placeholder: "Residential House" },
      { name: "propertyDoorNo", label: "Door / flat number", kind: "text" },
      { name: "propertyStreet", label: "Street / road", kind: "text" },
      { name: "propertyArea", label: "Area / locality", kind: "text" },
      { name: "propertyCity", label: "City / town", kind: "text" },
      { name: "propertyDistrict", label: "District", kind: "text" },
      { name: "propertyState", label: "State", kind: "text" },
      { name: "propertyPincode", label: "Pincode", kind: "text" },
      { name: "fullPropertyAddress", label: "Full property address", kind: "textarea", rows: 4, help: "Use this if you want the agreement to carry one consolidated address block." }
    ]
  },
  {
    title: "Financial Terms",
    description: "Amounts and payment terms.",
    fields: [
      { name: "securityDepositAmount", label: "Security deposit amount", kind: "text" },
      { name: "securityDepositAmountWords", label: "Security deposit in words", kind: "textarea", rows: 2 },
      { name: "monthlyRentAmount", label: "Monthly rent amount", kind: "text" },
      { name: "monthlyRentAmountWords", label: "Monthly rent in words", kind: "textarea", rows: 2 },
      { name: "rentDueDay", label: "Rent due day", kind: "text" },
      { name: "rentPaymentMode", label: "Rent payment mode", kind: "text" },
      { name: "lateFeeType", label: "Late fee type", kind: "text" },
      { name: "lateFeeValue", label: "Late fee value", kind: "text" },
      { name: "rentEscalationPercent", label: "Rent escalation %", kind: "text" },
      { name: "depositRefundDays", label: "Deposit refund days", kind: "text" }
    ]
  },
  {
    title: "Owner Protection Clauses",
    description: "Operational protections and restrictions.",
    fields: [
      { name: "lockInMonths", label: "Lock-in period (months)", kind: "text" },
      { name: "terminationNoticeMonths", label: "Termination notice (months)", kind: "text" },
      { name: "overstayPenaltyPerDay", label: "Overstay penalty per day", kind: "text" },
      { name: "additionalOccupantMaxDays", label: "Additional occupant max days", kind: "text" },
      { name: "abandonmentDays", label: "Abandonment inspection days", kind: "text" },
      { name: "cleaningPaintingDeductionEnabled", label: "Allow cleaning / painting deduction", kind: "checkbox" },
      { name: "policeVerificationEnabled", label: "Police verification clause enabled", kind: "checkbox" },
      { name: "noRentWithholdingEnabled", label: "No rent withholding clause enabled", kind: "checkbox" }
    ]
  },
  {
    title: "Jurisdiction",
    description: "Court jurisdiction details.",
    fields: [
      { name: "jurisdictionCity", label: "Jurisdiction city", kind: "text" },
      { name: "jurisdictionState", label: "Jurisdiction state", kind: "text" }
    ]
  },
  {
    title: "Witnesses",
    description: "Witness names and addresses.",
    fields: [
      { name: "witness1Name", label: "Witness 1 name", kind: "text" },
      { name: "witness1Address", label: "Witness 1 address", kind: "textarea", rows: 3 },
      { name: "witness2Name", label: "Witness 2 name", kind: "text" },
      { name: "witness2Address", label: "Witness 2 address", kind: "textarea", rows: 3 }
    ]
  }
];

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== "object" || !("message" in error)) {
    return null;
  }

  const message = (error as { message?: string }).message;
  return message ?? null;
}

function Field({ field }: { field: FieldDescriptor }) {
  const {
    register,
    formState: { errors }
  } = useFormContext<AgreementFormValues>();

  const typedErrors = errors as Partial<Record<keyof AgreementFormValues, { message?: string }>>;
  const error = getErrorMessage(typedErrors[field.name as keyof AgreementFormValues]);

  if (field.kind === "checkbox") {
    return (
      <label className="flex items-start gap-3 rounded-2xl border border-ink-200 bg-white p-4">
        <input
          type="checkbox"
          className="mt-1 h-5 w-5 rounded border-ink-300 text-ink-900 focus:ring-ink-300"
          {...register(field.name)}
        />
        <span className="min-w-0">
          <span className="block text-sm font-medium text-ink-900">{field.label}</span>
          {field.help ? <span className="mt-1 block text-sm text-ink-500">{field.help}</span> : null}
        </span>
      </label>
    );
  }

  const commonProps = register(field.name);

  return (
    <div className={field.kind === "textarea" ? "md:col-span-2" : ""}>
      <label className="label-text" htmlFor={field.name}>
        {field.label}
      </label>
      {field.kind === "textarea" ? (
        <textarea
          id={field.name}
          rows={field.rows ?? 3}
          className="textarea-base"
          placeholder={field.placeholder}
          {...commonProps}
        />
      ) : (
        <input
          id={field.name}
          type={field.kind}
          className="input-base"
          placeholder={field.placeholder}
          inputMode={field.kind === "date" ? undefined : "text"}
          {...commonProps}
        />
      )}
      {field.help ? <p className="mt-1 text-xs text-ink-500">{field.help}</p> : null}
      {error ? <p className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

function Section({ title, description, fields }: (typeof sections)[number]) {
  return (
    <section className="rounded-3xl border border-ink-200 bg-ink-50/80 p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-ink-950">{title}</h3>
        <p className="mt-1 text-sm text-ink-600">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <Field key={field.name} field={field} />
        ))}
      </div>
    </section>
  );
}

export function AgreementForm() {
  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <Section key={section.title} {...section} />
      ))}
    </div>
  );
}
