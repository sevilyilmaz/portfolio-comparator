// https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/vermogen_en_aanmerkelijk_belang/vermogen/belasting_betalen_over_uw_vermogen/grondslag_sparen_en_beleggen/berekening-2021/
const wealthTax = 0.31;
const wealthTaxBrackets = [
  {
    amount: 50000,
    fee: 1.898 * wealthTax,
  },
  {
    amount: 100000,
    fee: 4.501 * wealthTax,
  },
  {
    amount: 950000,
    fee: 5.69 * wealthTax,
  },
];

export function getWealthTax(amount: number): number {
  return wealthTaxBrackets.reduce(
    (acc, curr, idx, arr) => {
      const next = arr[idx + 1] ?? null;
      let val = 0;

      if (next) {
        if (acc.remainder === amount) {
          // First 50K is tax exempt
          acc.remainder -=
            acc.remainder < curr.amount ? acc.remainder : curr.amount;
        }

        val = amount < next.amount ? acc.remainder : next.amount - curr.amount;
      } else {
        val = acc.remainder;
      }

      acc.remainder -= val;
      acc.tax += val * (curr.fee / 100);

      return acc;
    },
    {
      tax: 0,
      remainder: amount,
    }
  ).tax;
}

export function substractWealthTax(
  amount: number,
  fiscalStatus: number
): number {
  const amountPerPerson = amount / fiscalStatus;
  const tax = getWealthTax(amountPerPerson) * fiscalStatus;
  return amount - tax;
}
