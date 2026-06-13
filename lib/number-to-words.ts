const ONES = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen"
];

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety"
];

function twoDigitWords(value: number) {
  if (value < 20) {
    return ONES[value] ?? "";
  }

  const tens = Math.floor(value / 10);
  const ones = value % 10;
  return [TENS[tens], ones ? ONES[ones] : ""].filter(Boolean).join(" ");
}

function segmentWords(value: number) {
  const lakh = Math.floor(value / 100000);
  const thousand = Math.floor((value % 100000) / 1000);
  const hundred = Math.floor((value % 1000) / 100);
  const remainder = value % 100;

  const parts: string[] = [];

  if (lakh) {
    parts.push(`${twoDigitWords(lakh)} Lakh`);
  }

  if (thousand) {
    parts.push(`${twoDigitWords(thousand)} Thousand`);
  }

  if (hundred) {
    parts.push(`${ONES[hundred]} Hundred`);
  }

  if (remainder) {
    if (parts.length) {
      parts.push("and");
    }
    parts.push(twoDigitWords(remainder));
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
}

export function numberToIndianWords(input: string) {
  const digits = input.replace(/[^\d]/g, "");
  if (!digits) {
    return "";
  }

  const value = Number.parseInt(digits, 10);
  if (!Number.isFinite(value)) {
    return "";
  }

  if (value === 0) {
    return "Zero";
  }

  return segmentWords(value);
}

export function amountToRupeeWords(input: string) {
  const words = numberToIndianWords(input);
  return words ? `Rupees ${words} Only` : "";
}

