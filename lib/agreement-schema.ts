import { z } from "zod";

const requiredText = z.string().trim().min(1, "This field is required");

export const agreementSchema = z
  .object({
    agreementPlace: requiredText,
    agreementDate: requiredText,
    agreementStartDate: requiredText,
    agreementEndDate: requiredText,
    agreementTermMonths: requiredText,

    ownerName: requiredText,
    ownerFatherName: requiredText,
    ownerAge: requiredText,
    ownerAddress: requiredText,
    ownerMobile: requiredText,
    ownerEmail: requiredText,
    ownerIdType: requiredText,
    ownerIdNumber: requiredText,
    ownerUpiId: requiredText,

    tenantName: requiredText,
    tenantFatherName: requiredText,
    tenantAge: requiredText,
    tenantAddress: requiredText,
    tenantMobile: requiredText,
    tenantEmail: requiredText,
    tenantIdType: requiredText,
    tenantIdNumber: requiredText,

    propertyType: requiredText,
    propertyDoorNo: requiredText,
    propertyStreet: requiredText,
    propertyArea: requiredText,
    propertyCity: requiredText,
    propertyDistrict: requiredText,
    propertyState: requiredText,
    propertyPincode: requiredText,
    fullPropertyAddress: requiredText,

    securityDepositAmount: requiredText,
    securityDepositAmountWords: requiredText,
    monthlyRentAmount: requiredText,
    monthlyRentAmountWords: requiredText,
    rentDueDay: requiredText,
    rentPaymentMode: requiredText,
    lateFeeType: requiredText,
    lateFeeValue: requiredText,
    rentEscalationPercent: requiredText,
    depositRefundDays: requiredText,

    lockInMonths: requiredText,
    terminationNoticeMonths: requiredText,
    overstayPenaltyPerDay: requiredText,
    additionalOccupantMaxDays: requiredText,
    abandonmentDays: requiredText,
    cleaningPaintingDeductionEnabled: z.boolean(),
    policeVerificationEnabled: z.boolean(),
    noRentWithholdingEnabled: z.boolean(),

    jurisdictionCity: requiredText,
    jurisdictionState: requiredText,

    witness1Name: requiredText,
    witness1Address: requiredText,
    witness2Name: requiredText,
    witness2Address: requiredText,

    keysClauseEnabled: z.boolean(),
    inspectionClauseEnabled: z.boolean(),
    emergencyEntryClauseEnabled: z.boolean()
  })
  .superRefine((values, context) => {
    const start = new Date(`${values.agreementStartDate}T00:00:00`);
    const end = new Date(`${values.agreementEndDate}T00:00:00`);

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end <= start) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Agreement end date must be later than the start date.",
        path: ["agreementEndDate"]
      });
    }
  });

export type AgreementFormValues = z.infer<typeof agreementSchema>;

