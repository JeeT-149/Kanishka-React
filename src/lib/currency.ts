const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrWithDecimalsFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats an amount in Indian Rupees (₹).
 * Shows decimals only if the amount has fractional paise.
 */
export function formatINR(amount: number): string {
  if (Number.isInteger(amount)) {
    return inrFormatter.format(amount);
  }
  return inrWithDecimalsFormatter.format(amount);
}

export const money = formatINR;
export const formatMoney = formatINR;

/**
 * Converts major currency units (rupees) to minor units (paise).
 * Integer math prevents floating point accumulation bugs in cart calculations.
 */
export function toMinor(major: number): number {
  return Math.round(major * 100);
}

/**
 * Converts minor currency units (paise) back to major units (rupees).
 */
export function fromMinor(minor: number): number {
  return minor / 100;
}

/**
 * Formats an amount in minor units (paise) as an INR string.
 */
export function formatMinor(minor: number): string {
  return formatINR(fromMinor(minor));
}
