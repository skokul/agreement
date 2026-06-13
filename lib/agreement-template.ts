import type { AgreementFormValues } from "@/lib/agreement-schema";
import { buildPropertyAddress, formatAgreementDate, joinNonEmpty, normalizeText } from "@/lib/format";

export interface AgreementClause {
  number: number;
  title: string;
  paragraphs: string[];
}

export interface AgreementSignatureBlock {
  title: string;
  name: string;
  fatherName?: string;
  age?: string;
  email?: string;
  address?: string;
  mobile?: string;
  idType?: string;
  idNumber?: string;
  upiId?: string;
}

export interface AgreementDocumentModel {
  title: string;
  place: string;
  agreementDate: string;
  subtitle: string;
  parties: {
    licensor: AgreementSignatureBlock;
    licensee: AgreementSignatureBlock;
  };
  property: {
    description: string;
    fullAddress: string;
    scheduleLines: string[];
  };
  clauses: AgreementClause[];
  signatures: Array<{
    role: string;
    name: string;
    address: string;
    mobile: string;
  }>;
  witnesses: Array<{
    name: string;
    address: string;
  }>;
}

function personBlock(
  role: string,
  name: string,
  fatherName: string,
  age: string,
  address: string,
  mobile: string,
  email: string,
  idType: string,
  idNumber: string,
  upiId: string
): AgreementSignatureBlock {
  return {
    title: role,
    name: normalizeText(name),
    fatherName: normalizeText(fatherName),
    age: normalizeText(age),
    email: normalizeText(email),
    address: normalizeText(address),
    mobile: normalizeText(mobile),
    idType: normalizeText(idType),
    idNumber: normalizeText(idNumber),
    upiId: normalizeText(upiId)
  };
}

export function buildAgreementTemplate(values: AgreementFormValues): AgreementDocumentModel {
  const place = normalizeText(values.agreementPlace);
  const agreementDate = formatAgreementDate(values.agreementDate);
  const startDate = formatAgreementDate(values.agreementStartDate);
  const endDate = formatAgreementDate(values.agreementEndDate);
  const propertyAddress = buildPropertyAddress(values);
  const scheduleAddress = propertyAddress || joinNonEmpty([
    values.propertyDoorNo,
    values.propertyStreet,
    values.propertyArea,
    values.propertyCity,
    values.propertyDistrict,
    values.propertyState,
    values.propertyPincode
  ]);

  const clause8PermittedUse = `The Licensee shall use the premises only for lawful ${normalizeText(values.propertyType).toLowerCase()} purposes and for no other purpose without the Licensor's prior written consent.`;
  const inspectionRightsLead = values.inspectionClauseEnabled
    ? `The Licensor or the Licensor's authorized representatives may enter the premises at reasonable times, after reasonable notice, to inspect the condition of the premises, carry out repairs, maintenance, or to show the premises to prospective purchasers or future licensees.`
    : `The Licensor may inspect the premises as required by law or upon reasonable notice given to the Licensee.`;

  const emergencyEntry = values.emergencyEntryClauseEnabled
    ? `In an emergency, or where there is a risk of damage, leakage, fire, safety concern, illegal activity, or other circumstances likely to cause loss or harm, the Licensor may enter the premises without prior notice to prevent or reduce damage.`
    : `Emergency entry, if required, shall be limited to what applicable law permits.`;

  const clauses: AgreementClause[] = [
    {
      number: 1,
      title: "Parties",
      paragraphs: [
        `This Leave and License Agreement is made at ${place || "[Place]"} on ${agreementDate || "[Date]"} between ${normalizeText(values.ownerName)}, S/o/D/o ${normalizeText(values.ownerFatherName)}, aged ${normalizeText(values.ownerAge)}, residing at ${normalizeText(values.ownerAddress)}, mobile ${normalizeText(values.ownerMobile)}, email ${normalizeText(values.ownerEmail)}, holding ${normalizeText(values.ownerIdType)} No. ${normalizeText(values.ownerIdNumber)}, UPI ID ${normalizeText(values.ownerUpiId)}, hereinafter called the "LICENSOR" of the FIRST PART, and ${normalizeText(values.tenantName)}, S/o/D/o ${normalizeText(values.tenantFatherName)}, aged ${normalizeText(values.tenantAge)}, residing at ${normalizeText(values.tenantAddress)}, mobile ${normalizeText(values.tenantMobile)}, email ${normalizeText(values.tenantEmail)}, holding ${normalizeText(values.tenantIdType)} No. ${normalizeText(values.tenantIdNumber)}, hereinafter called the "LICENSEE" of the OTHER PART.`
      ]
    },
    {
      number: 2,
      title: "Property Description",
      paragraphs: [
        `The Licensor represents that the Licensor is the lawful owner and person in possession of the premises described below: ${propertyAddress || "[Property address]"} (${normalizeText(values.propertyType)}).`,
        "The said premises shall hereafter be referred to as the licensed premises and are more particularly described in the Schedule annexed to this Agreement."
      ]
    },
    {
      number: 3,
      title: "Agreement Term",
      paragraphs: [
        `The Licensee has requested permission to occupy the licensed premises on leave and license basis, and the Licensor has agreed to grant such permission for a period of ${normalizeText(values.agreementTermMonths)} months commencing from ${startDate || "[Start date]"} and ending on ${endDate || "[End date]"}.`,
        "Any extension or renewal shall be only by mutual written agreement between the parties."
      ]
    },
    {
      number: 4,
      title: "Security Deposit",
      paragraphs: [
        `The Licensee shall deposit ${normalizeText(values.securityDepositAmount)} (${normalizeText(values.securityDepositAmountWords)}) with the Licensor as security deposit for the due performance of this Agreement.`,
        "The security deposit shall not carry any interest.",
        `The Licensor shall refund the security deposit within ${normalizeText(values.depositRefundDays)} days after the Licensee hands over quiet, vacant and peaceful possession of the premises, after adjusting all dues, unpaid rent, utilities, damages, penalties, and other sums payable under this Agreement.`,
        values.cleaningPaintingDeductionEnabled
          ? "If the premises are not returned in substantially the same condition as delivered, the Licensor may deduct reasonable cleaning, painting, repair, restoration, and waste-removal charges, subject to normal wear and tear."
          : "Any deduction from the security deposit shall be limited to unpaid dues and documented damage beyond normal wear and tear."
      ]
    },
    {
      number: 5,
      title: "Monthly Rent",
      paragraphs: [
        `The Licensee shall pay monthly rent of ${normalizeText(values.monthlyRentAmount)} (${normalizeText(values.monthlyRentAmountWords)}) on or before the ${normalizeText(values.rentDueDay)} day of every month.`,
        `The monthly rent shall be paid by ${normalizeText(values.rentPaymentMode)}.`,
        `Any rent remaining unpaid beyond the due date shall attract late payment consequences of ${normalizeText(values.lateFeeType)} calculated as ${normalizeText(values.lateFeeValue)}.`,
        "All rent and charges shall be payable without any set-off except as expressly required by law."
      ]
    },
    {
      number: 6,
      title: "Rent Escalation",
      paragraphs: [
        `There shall be an escalation of ${normalizeText(values.rentEscalationPercent)} in the monthly rent after completion of every 12 months from the commencement date of this Agreement, unless the parties agree otherwise in writing.`
      ]
    },
    {
      number: 7,
      title: "Permitted Use",
      paragraphs: [clause8PermittedUse]
    },
    {
      number: 8,
      title: "No Ownership or Tenancy Rights",
      paragraphs: [
        "The Licensee shall not claim any ownership, tenancy, leasehold, or other proprietary right in the licensed premises except the limited permission granted under this Agreement.",
        "This Agreement is intended only as a leave and license arrangement and does not create a landlord-tenant relationship."
      ]
    },
    {
      number: 9,
      title: "No Transfer or Subletting",
      paragraphs: [
        "The Licensee shall not transfer, assign, sub-license, sub-let, mortgage, create any charge, lien, encumbrance, or part with possession of the licensed premises or any part thereof without the prior written consent of the Licensor."
      ]
    },
    {
      number: 10,
      title: "Prohibited Activities",
      paragraphs: [
        "The Licensee shall not conduct any illegal, immoral, hazardous, or unlawful activity in the licensed premises and shall comply with all applicable laws, rules, and regulations."
      ]
    },
    {
      number: 11,
      title: "No Nuisance",
      paragraphs: [
        "The Licensee shall not cause any nuisance, disturbance, annoyance, inconvenience, noise, or interference to the Licensor, neighbors, or other occupants."
      ]
    },
    {
      number: 12,
      title: "Care of Property",
      paragraphs: [
        "The Licensee shall use the licensed premises with proper care and caution as an ordinary prudent person would do, and shall keep the premises reasonably clean and tidy."
      ]
    },
    {
      number: 13,
      title: "Damage, Cleaning, Painting and Repairs",
      paragraphs: [
        values.cleaningPaintingDeductionEnabled
          ? "Any damage caused by the Licensee, the Licensee's family members, guests, servants, or visitors shall be repaired at the Licensee's cost and may be adjusted from the security deposit."
          : "Any damage caused by the Licensee, the Licensee's family members, guests, servants, or visitors shall be repaired at the Licensee's cost, and the parties may separately agree on any security deposit adjustment in writing.",
        "The Licensee shall not make structural alterations or modifications without the prior written consent of the Licensor.",
        "Upon expiry or termination, the Licensee shall remove personal furniture and fixtures and restore the premises to the original condition subject to normal wear and tear."
      ]
    },
    {
      number: 14,
      title: "Utilities and User Charges",
      paragraphs: [
        "The Licensee shall pay all consumption-based charges relating to electricity, water, internet, gas, maintenance, and other user charges arising from occupation of the premises.",
        "Any service used by the Licensee shall be paid regularly and directly to the concerned authority or service provider, where applicable."
      ]
    },
    {
      number: 15,
      title: "Taxes",
      paragraphs: [
        "Property tax and all ownership-related taxes, assessments, and statutory levies shall be borne by the Licensor unless otherwise required by law.",
        "Consumption-based and user-linked charges shall be borne by the Licensee."
      ]
    },
    {
      number: 16,
      title: "Inspection Rights",
      paragraphs: [
        inspectionRightsLead,
        emergencyEntry,
        `If the premises remain locked, unattended, or inaccessible for more than ${normalizeText(values.abandonmentDays)} consecutive days without prior written intimation by the Licensee, the Licensor may make reasonable efforts to contact the Licensee and inspect the premises to safeguard the property.`
      ]
    },
    {
      number: 17,
      title: "Sale or Transfer of Property",
      paragraphs: [
        "The Licensor shall be entitled to sell or transfer the property during the term of this Agreement. Upon such transfer, the Licensor shall either refund the security deposit to the Licensee or transfer the security deposit to the purchaser/transferee, who shall thereafter assume the obligations relating to the security deposit."
      ]
    },
    {
      number: 18,
      title: "Redevelopment or Government Acquisition",
      paragraphs: [
        "In the event the premises is required to be demolished for redevelopment, reconstruction, public purpose, or government acquisition, the Licensee shall cooperate with the Licensor and vacate the premises upon reasonable notice.",
        `Upon vacating the premises, the Licensee shall hand over all keys, access cards, remotes, passwords, gate controls, and other means of access relating to the premises ${values.keysClauseEnabled ? "and any duplicated access credentials shall be returned or deleted" : ""}.`
      ]
    },
    {
      number: 19,
      title: "Vacant Possession",
      paragraphs: [
        "Upon termination or expiry of this Agreement for any reason whatsoever, the Licensee shall hand over vacant, quiet, and peaceful possession of the premises to the Licensor."
      ]
    },
    {
      number: 20,
      title: "Holding Over Damages",
      paragraphs: [
        `If the Licensee fails to vacate after termination or expiry, the Licensor shall be entitled to claim liquidated damages at the rate of ${normalizeText(values.overstayPenaltyPerDay)} per day until vacant possession is handed over, without prejudice to other remedies available under law.`
      ]
    },
    {
      number: 21,
      title: "Termination Notice and Lock-in Period",
      paragraphs: [
        `Either party may terminate this Agreement without assigning any reason by giving the other party ${normalizeText(values.terminationNoticeMonths)} months' prior written notice after the initial ${normalizeText(values.lockInMonths)} months lock-in period, unless otherwise agreed in writing.`,
        "Notice may be given through WhatsApp message, email, registered post, courier, or any other written communication sent to the contact details provided by the parties.",
        "If the Licensee vacates during the lock-in period without breach by the Licensor, the Licensor may adjust one month's rent together with reasonable actual re-letting expenses from the security deposit, subject to applicable law."
      ]
    },
    {
      number: 22,
      title: "Police Verification",
      paragraphs: [
        values.policeVerificationEnabled
          ? "The Licensee shall provide identification documents, photograph, contact details, and other documents reasonably required by the Licensor for police verification, tenant verification, or compliance with applicable law."
          : "The Licensee shall cooperate with any verification process required by applicable law."
      ]
    },
    {
      number: 23,
      title: "Additional Occupants",
      paragraphs: [
        `The Licensee shall not permit any person other than the Licensee and immediate family members to reside in the premises for more than ${normalizeText(values.additionalOccupantMaxDays)} consecutive days without the prior written consent of the Licensor.`
      ]
    },
    {
      number: 24,
      title: "Rent Payment Not To Be Withheld",
      paragraphs: [
        values.noRentWithholdingEnabled
          ? "The Licensee shall not make any claim, objection, or withholding against payment of rent on account of any dispute with the Licensor. Any dispute shall be resolved separately and shall not affect the obligation to pay rent and other charges under this Agreement."
          : "The parties acknowledge that rent shall be paid in accordance with this Agreement, subject to any mandatory legal entitlement that cannot be waived."
      ]
    },
    {
      number: 25,
      title: "Jurisdiction",
      paragraphs: [
        `Any disputes arising out of this Agreement shall be subject to the exclusive jurisdiction of the competent courts at ${normalizeText(values.jurisdictionCity)}, ${normalizeText(values.jurisdictionState)}.`
      ]
    },
    {
      number: 26,
      title: "Schedule of Property",
      paragraphs: [
        `Residential property situated at ${scheduleAddress || "[Property address]"} and all appurtenances attached thereto.`,
        `Door / Flat No.: ${normalizeText(values.propertyDoorNo)}`,
        `Street / Road: ${normalizeText(values.propertyStreet)}`,
        `Area / Locality: ${normalizeText(values.propertyArea)}`,
        `City / Town: ${normalizeText(values.propertyCity)}`,
        `District: ${normalizeText(values.propertyDistrict)}`,
        `State: ${normalizeText(values.propertyState)}`,
        `Pincode: ${normalizeText(values.propertyPincode)}`,
        "This schedule forms an integral part of the Agreement."
      ]
    },
    {
      number: 27,
      title: "Signatures and Witnesses",
      paragraphs: [
        "IN WITNESS WHEREOF, the parties hereto have set and subscribed their respective hands on the day, month, and year first above written.",
        `LICENSOR: ${normalizeText(values.ownerName)}\nAddress: ${normalizeText(values.ownerAddress)}\nMobile: ${normalizeText(values.ownerMobile)}\nSignature: ____________________`,
        `LICENSEE: ${normalizeText(values.tenantName)}\nAddress: ${normalizeText(values.tenantAddress)}\nMobile: ${normalizeText(values.tenantMobile)}\nSignature: ____________________`,
        `Witness 1: ${normalizeText(values.witness1Name)}\nAddress: ${normalizeText(values.witness1Address)}\nSignature: ____________________`,
        `Witness 2: ${normalizeText(values.witness2Name)}\nAddress: ${normalizeText(values.witness2Address)}\nSignature: ____________________`
      ]
    }
  ];

  return {
    title: "AGREEMENT FOR LEAVE & LICENSE",
    place,
    agreementDate,
    subtitle: `Made at ${place || "[Place]"} on ${agreementDate || "[Date]"}.`,
    parties: {
      licensor: personBlock(
        "Licensor",
        values.ownerName,
        values.ownerFatherName,
        values.ownerAge,
        values.ownerAddress,
        values.ownerMobile,
        values.ownerEmail,
        values.ownerIdType,
        values.ownerIdNumber,
        values.ownerUpiId
      ),
      licensee: personBlock(
        "Licensee",
        values.tenantName,
        values.tenantFatherName,
        values.tenantAge,
        values.tenantAddress,
        values.tenantMobile,
        values.tenantEmail,
        values.tenantIdType,
        values.tenantIdNumber,
        ""
      )
    },
    property: {
      description: `${normalizeText(values.propertyType)} at ${propertyAddress}`.trim(),
      fullAddress: propertyAddress,
      scheduleLines: [
        normalizeText(values.propertyDoorNo),
        normalizeText(values.propertyStreet),
        normalizeText(values.propertyArea),
        joinNonEmpty([values.propertyCity, values.propertyDistrict]),
        joinNonEmpty([values.propertyState, values.propertyPincode])
      ].filter(Boolean)
    },
    clauses,
    signatures: [
      {
        role: "LICENSOR",
        name: normalizeText(values.ownerName),
        address: normalizeText(values.ownerAddress),
        mobile: normalizeText(values.ownerMobile)
      },
      {
        role: "LICENSEE",
        name: normalizeText(values.tenantName),
        address: normalizeText(values.tenantAddress),
        mobile: normalizeText(values.tenantMobile)
      }
    ],
    witnesses: [
      {
        name: normalizeText(values.witness1Name),
        address: normalizeText(values.witness1Address)
      },
      {
        name: normalizeText(values.witness2Name),
        address: normalizeText(values.witness2Address)
      }
    ]
  };
}
