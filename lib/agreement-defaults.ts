import type { AgreementFormValues } from "@/lib/agreement-schema";
import { formatDateInputValue } from "@/lib/format";

function addMonths(date: Date, months: number) {
  const clone = new Date(date);
  const day = clone.getDate();

  clone.setMonth(clone.getMonth() + months, 1);
  const maxDay = new Date(clone.getFullYear(), clone.getMonth() + 1, 0).getDate();
  clone.setDate(Math.min(day, maxDay));
  return clone;
}

export function createDefaultAgreementValues(): AgreementFormValues {
  const today = new Date();
  const endDate = addMonths(today, 11);

  return {
    agreementPlace: "",
    agreementDate: formatDateInputValue(today),
    agreementStartDate: formatDateInputValue(today),
    agreementEndDate: formatDateInputValue(endDate),
    agreementTermMonths: "11",

    ownerName: "",
    ownerFatherName: "",
    ownerAge: "",
    ownerAddress: "",
    ownerMobile: "",
    ownerEmail: "",
    ownerIdType: "",
    ownerIdNumber: "",
    ownerUpiId: "",

    tenantName: "",
    tenantFatherName: "",
    tenantAge: "",
    tenantAddress: "",
    tenantMobile: "",
    tenantEmail: "",
    tenantIdType: "",
    tenantIdNumber: "",

    propertyType: "Residential House",
    propertyDoorNo: "",
    propertyStreet: "",
    propertyArea: "",
    propertyCity: "",
    propertyDistrict: "",
    propertyState: "",
    propertyPincode: "",
    fullPropertyAddress: "",

    securityDepositAmount: "",
    securityDepositAmountWords: "",
    monthlyRentAmount: "",
    monthlyRentAmountWords: "",
    rentDueDay: "",
    rentPaymentMode: "",
    lateFeeType: "",
    lateFeeValue: "",
    rentEscalationPercent: "",
    depositRefundDays: "",

    lockInMonths: "6",
    terminationNoticeMonths: "2",
    overstayPenaltyPerDay: "1000",
    additionalOccupantMaxDays: "15",
    abandonmentDays: "30",
    cleaningPaintingDeductionEnabled: true,
    policeVerificationEnabled: true,
    noRentWithholdingEnabled: true,

    jurisdictionCity: "",
    jurisdictionState: "",

    witness1Name: "",
    witness1Address: "",
    witness2Name: "",
    witness2Address: "",

    keysClauseEnabled: true,
    inspectionClauseEnabled: true,
    emergencyEntryClauseEnabled: true
  };
}
