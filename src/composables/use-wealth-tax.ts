// https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/nieuwe-berekening-box-3-inkomen
const wealthTax = 36 / 100;
const taxFreeWealth = 57000;
const fictitiusReturnPercentage = 6.04 / 100;

export function getWealthTax(amount: number): number {
  if (amount <= taxFreeWealth) return 0;
  const fictitiusReturn = amount * fictitiusReturnPercentage;
  const taxableAmount = amount - taxFreeWealth;
  const taxableContributionPercentage = taxableAmount / amount;
  const fictitiusGain = fictitiusReturn * taxableContributionPercentage;

  return fictitiusGain * wealthTax;
}

export function substractWealthTax(
  amount: number,
  fiscalStatus: number
): number {
  const amountPerPerson = amount / fiscalStatus;
  const tax = getWealthTax(amountPerPerson) * fiscalStatus;
  return amount - tax;
}
