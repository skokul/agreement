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
  preamble: string[];
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
  closing: string[];
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
  idType?: string,
  idNumber?: string,
  upiId?: string
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

function buildOwnerIdentityLine(
  idType: string | undefined,
  idNumber: string | undefined,
  upiId: string | undefined
) {
  const normalizedIdType = normalizeText(idType);
  const normalizedIdNumber = normalizeText(idNumber);
  const normalizedUpiId = normalizeText(upiId);
  const parts: string[] = [];

  if (normalizedIdType || normalizedIdNumber) {
    parts.push(
      [normalizedIdType, normalizedIdNumber ? `No. ${normalizedIdNumber}` : ""]
        .filter(Boolean)
        .join(" ")
        .trim()
    );
  }

  if (normalizedUpiId) {
    parts.push(`UPI ID ${normalizedUpiId}`);
  }

  if (!parts.length) {
    return "";
  }

  if (parts.length === 1 && normalizedUpiId && !(normalizedIdType || normalizedIdNumber)) {
    return `, ${parts[0]}`;
  }

  return `, holding ${parts.join(", ")}`;
}

function makeClause(number: number, title: string, paragraphs: string[]): AgreementClause {
  return { number, title, paragraphs };
}

function buildPreamble(values: AgreementFormValues, place: string, agreementDate: string, startDate: string, endDate: string, propertyAddress: string) {
  return [
    `This Agreement of LEAVE & LICENSE is made and entered into at ${place || "[Place]"} on this ${agreementDate || "[Date]"},`,
    "BETWEEN",
    `Mr. ${normalizeText(values.ownerName)}, an adult Indian inhabitant, residing at ${normalizeText(values.ownerAddress)}, hereinafter called the "LICENSOR" (which expression shall unless it be repugnant to the context or meaning thereof be deemed to mean and include his heirs, executors, administrators and assigns) of the FIRST PART.`,
    "AND",
    `Mr. ${normalizeText(values.tenantName)}, S/o ${normalizeText(values.tenantFatherName)}, residing at ${normalizeText(values.tenantAddress)}, Mobile No.: ${normalizeText(values.tenantMobile)}; hereinafter called and referred to as the "LICENSEE" (which expression shall unless it be repugnant to the context or meaning thereof mean and include his heirs, executors, administrators and assigns) of the OTHER PART.`,
    "WHEREAS",
    `The Licensor is the owner and well possessed of a residential house bearing address: ${propertyAddress || "[Property address]"} hereinafter referred to as the "SAID PREMISES" for the sake of brevity, more particularly described in the Schedule hereunder.`,
    `AND WHEREAS the Licensee has approached the Licensor with a request to occupy the said premises on Leave and License basis, and the Licensor has agreed to grant such permission for a period of ${normalizeText(values.agreementTermMonths)} months commencing from ${startDate || "[Start date]"} and ending on ${endDate || "[End date]"}. The Agreement may be extended upon mutual agreement between the parties.`,
    "NOW THIS INDENTURE WITNESSETH AS UNDER:"
  ];
}

function buildClauses(values: AgreementFormValues, propertyAddress: string, startDate: string, endDate: string): AgreementClause[] {
  const permittedUse = `The Licensor grants permission to the Licensee to use and occupy the premises for ${normalizeText(values.propertyType) || "Residential"} Purpose only.`;

  return [
    makeClause(1, "Security Deposit", [
      `The Licensee shall deposit a sum of Rs.${normalizeText(values.securityDepositAmount)}/- (${normalizeText(values.securityDepositAmountWords)}) with the Licensor as security deposit for the due and proper performance of this Agreement.`,
      "The said deposit amount shall not bear any interest whatsoever and the Licensee shall not be entitled to claim any interest thereon.",
      `The deposit amount shall be refunded by the Licensor within ${normalizeText(values.depositRefundDays)} days after the Licensee hands over quiet, vacant and peaceful possession of the premises and after adjustment of all dues including unpaid rent, electricity, water, internet, maintenance charges, damages, penalties and any other amounts payable by the Licensee.`,
      values.cleaningPaintingDeductionEnabled
        ? "The Licensor shall be entitled to deduct reasonable cleaning, painting, repair, restoration and waste-removal charges from the security deposit if the premises are not returned in substantially the same condition as delivered, subject to normal wear and tear."
        : "Any deduction from the security deposit shall be limited to unpaid dues and documented damage beyond normal wear and tear."
    ]),
    makeClause(2, "Monthly Rent", [
      `The Licensee shall pay to the Licensor a sum of Rs.${normalizeText(values.monthlyRentAmount)}/- (${normalizeText(values.monthlyRentAmountWords)}) towards monthly rent regularly on or before the ${normalizeText(values.rentDueDay)} day of every month.`,
      `The monthly rent shall be paid through ${normalizeText(values.rentPaymentMode)}.`,
      "The Property Tax of the premises shall be paid by the Licensor.",
      "Other charges towards utility payments, maintenance charges, water charges, electricity charges, internet charges, security charges, community functions, festivals, sweeper expenses and other actual expenses shall be paid by the Licensee.",
      `Any rent remaining unpaid beyond 10 days from the due date shall attract a late payment charge equal to ${normalizeText(values.lateFeeValue)} of the monthly rent for every month or part thereof during which such delay continues.`
    ]),
    makeClause(3, "Rent Escalation", [
      `There shall be an escalation of ${normalizeText(values.rentEscalationPercent)} in the monthly rent after completion of every 12 months from the commencement date of this Agreement, subject to extension or renewal of the Agreement.`
    ]),
    makeClause(4, "Obligation to Pay Rent", [
      "It is an obligation of the Licensee to pay the rent on the due date without any obligation on the part of the Licensor to demand the same."
    ]),
    makeClause(5, "Permitted Use", [permittedUse]),
    makeClause(6, "No Ownership Rights", [
      "The Licensee shall not claim any estate or interest in the licensed premises except its rights under this Agreement."
    ]),
    makeClause(7, "No Transfer or Subletting", [
      "The Licensee shall not transfer, assign, sub-let, mortgage, create any charge, lien or encumbrance or part with possession of the Licensed Premises or any part thereof."
    ]),
    makeClause(8, "Illegal Activities Prohibited", [
      "The Licensee shall not conduct any illegal or immoral activities in the Licensed Premises."
    ]),
    makeClause(9, "No Nuisance", [
      "The Licensee shall not cause any nuisance, disturbance, annoyance, inconvenience or interference to neighboring occupants."
    ]),
    makeClause(10, "Care of Property", [
      "The Licensee shall use the Licensed Premises with proper care and caution as an ordinary prudent person would do."
    ]),
    makeClause(11, "Damage to Property", [
      "Any damage caused by the Licensee shall be repaired at the Licensee's cost and may be adjusted from the security deposit."
    ]),
    makeClause(12, "Telecom and Internet Charges", [
      "The Licensee shall pay all bills relating to telephone, mobile, internet and similar services installed in the premises."
    ]),
    makeClause(13, "Furniture and Fixtures", [
      "The Licensee may place furniture and fixtures required for comfortable stay and shall remove the same upon expiry of this Agreement while restoring the premises to its original condition, subject to normal wear and tear."
    ]),
    makeClause(14, "No Sub-Tenant", [
      "The Licensee shall not introduce any sub-tenant nor create any rights in favor of any third party."
    ]),
    makeClause(15, "Alterations", [
      "The Licensee shall not make any structural alteration or modification without the prior written consent of the Licensor."
    ]),
    makeClause(16, "Taxes and User Charges", [
      "Property tax and all ownership-related taxes, assessments and statutory levies shall be borne by the Licensor.",
      "Consumption-based charges including electricity, water, internet, gas, maintenance charges and user charges shall be borne by the Licensee."
    ]),
    makeClause(17, "Nature of Possession", [
      "The Licensee shall be deemed only a Licensee and not a tenant, and shall not claim any tenancy or ownership rights."
    ]),
    makeClause(18, "Payment of Utilities", [
      "The Licensee shall pay Electricity Bills, Water Bills, Internet Bills, Gas Bills and all utility bills regularly."
    ]),
    makeClause(19, "Termination for Default", [
      "The License may be terminated under any of the following circumstances:",
      "i) By efflux of time.",
      "ii) In the event of non-payment of rent by the Licensee for a period of 2 (Two) months."
    ]),
    makeClause(20, "Leave and License Relationship", [
      "The parties expressly agree that this Agreement is a Leave and License Agreement and does not create a landlord-tenant relationship."
    ]),
    makeClause(21, "Right of Inspection", [
      "The Licensee shall allow the Licensor or his authorized representatives to enter and inspect the premises at reasonable times upon reasonable notice for the purpose of verifying the condition of the premises, carrying out repairs, maintenance, inspections, or showing the premises to prospective purchasers or tenants.",
      "Any unreasonable refusal by the Licensee to permit such inspection after reasonable notice shall constitute a breach of this Agreement and shall entitle the Licensor to take appropriate action under this Agreement and applicable law."
    ]),
    makeClause(22, "Sale or Transfer of Property", [
      "The Licensor shall be entitled to sell or transfer the premises during the term of this Agreement. Upon such transfer, the Licensor shall either refund the security deposit to the Licensee or transfer the security deposit to the purchaser/transferee, who shall thereafter assume all obligations relating to the security deposit."
    ]),
    makeClause(23, "Redevelopment or Government Acquisition", [
      "In the event the premises is required to be demolished for redevelopment or governmental acquisition, the Licensee shall cooperate with the Licensor and vacate the premises upon notice.",
      "The Licensor shall refund the security deposit in accordance with Clause 1.",
      `Upon vacating the premises, the Licensee shall hand over all keys, access cards, remotes, passwords, gate controls and other means of access relating to the premises${values.keysClauseEnabled ? " and any duplicated access credentials shall be returned or deleted." : "."}`
    ]),
    makeClause(24, "Vacant Possession", [
      "Upon termination of this Agreement for any reason whatsoever, the Licensee shall hand over vacant, quiet and peaceful possession of the premises."
    ]),
    makeClause(25, "Rent Liability", [
      "The Licensee shall continue to pay rent regularly irrespective of actual occupation during the term of the Agreement."
    ]),
    makeClause(26, "Holding Over Damages", [
      `If the Licensee fails to vacate after termination or expiry of the Agreement, the Licensor shall be entitled to claim liquidated damages at the rate of Rs.${normalizeText(values.overstayPenaltyPerDay)}/- per day until vacant possession is handed over.`
    ]),
    makeClause(27, "Termination Notice and Lock-in Period", [
      `Either party shall have the right to terminate this Agreement without assigning any reason by giving the other party ${normalizeText(values.terminationNoticeMonths)} months' prior notice in writing after the initial ${normalizeText(values.lockInMonths)} months lock-in period.`,
      "Such notice may be given through WhatsApp message, email, registered post, courier or any other written communication sent to the contact details provided by the parties.",
      "The date of delivery or transmission of such notice shall be deemed to be the date of notice.",
      "If the Licensee vacates the premises during the initial lock-in period without any breach on the part of the Licensor, the Licensor shall be entitled to adjust an amount equivalent to one month's rent together with reasonable actual re-letting expenses from the security deposit."
    ]),
    makeClause(28, "Stamp Duty and Registration", [
      "The Licensee shall bear the expenses of Stamp Duty and Registration of this Agreement wherever applicable."
    ]),
    makeClause(29, "Custody of Agreement", [
      "The Original Agreement shall remain with the Licensor and a signed copy shall be provided to the Licensee."
    ]),
    makeClause(30, "Jurisdiction", [
      `Any disputes arising out of this Agreement shall be subject to the exclusive jurisdiction of the competent Courts at ${normalizeText(values.jurisdictionCity)}, ${normalizeText(values.jurisdictionState)}.`
    ]),
    makeClause(31, "Inspection of Locked Premises", [
      `If the premises remain locked, unattended or inaccessible for more than ${normalizeText(values.abandonmentDays)} consecutive days without prior written intimation by the Licensee, the Licensor shall have the right to inspect the premises after making reasonable efforts to contact the Licensee through phone, WhatsApp, email or other available means.`,
      values.emergencyEntryClauseEnabled
        ? "In cases of emergency, suspected damage, water leakage, fire hazard, illegal activity, safety concerns or circumstances likely to cause loss or damage to the premises, the Licensor may enter and inspect the premises without prior notice to the Licensee."
        : "If required by law or emergency, the Licensor may enter and inspect the premises in accordance with applicable law."
    ]),
    makeClause(32, "Police Verification", [
      "The Licensee shall provide Aadhaar Card, photograph, contact details and any other documents reasonably required by the Licensor for police verification, tenant verification or compliance with applicable laws."
    ]),
    makeClause(33, "Restriction on Additional Occupants", [
      `The Licensee shall not permit any person other than the Licensee and his immediate family members to reside in the premises for more than ${normalizeText(values.additionalOccupantMaxDays)} consecutive days without the prior written consent of the Licensor.`
    ]),
    makeClause(34, "Rent Payment Not To Be Withheld", [
      "The Licensee shall not make any claim, objection or withholding against payment of rent on the ground of any dispute with the Licensor. Any dispute shall be resolved separately and shall not affect the Licensee's obligation to pay rent and other charges under this Agreement."
    ]),
    makeClause(35, "Breach of Agreement", [
      "In the event the Licensee breaches any material term or condition of this Agreement and fails to remedy such breach within 15 days of receiving written notice from the Licensor, the Licensor shall be entitled to terminate this Agreement and take such action as may be available under law."
    ])
  ];
}

function buildClosing() {
  return [
    "IN WITNESS WHEREOF, Both the parties have set and subscribed their respective hands on the day, month and year first hereinabove written."
  ];
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
  const preamble = buildPreamble(values, place, agreementDate, startDate, endDate, propertyAddress);
  const clauses = buildClauses(values, propertyAddress, startDate, endDate);
  const closing = buildClosing();

  return {
    title: "AGREEMENT FOR LEAVE & LICENSE",
    place,
    agreementDate,
    subtitle: `Made at ${place || "[Place]"} on ${agreementDate || "[Date]"}.`,
    preamble,
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
    closing,
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
