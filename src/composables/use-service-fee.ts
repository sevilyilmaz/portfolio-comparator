import { substractPercentage } from './use-substract-percentage';

type FeeBracket = {
  amount: number;
  fee: number;
};

function getServiceFees(value: string): FeeBracket[] | number {
  let brackets = value.split(';');
  if (brackets.length === 1) {
    return Number(value);
  }

  return brackets
    .reduce((acc, curr) => {
      const [amount, fee] = curr.split(':');

      acc.push({
        amount: Number(amount),
        fee: Number(fee),
      });

      return acc;
    }, [] as FeeBracket[])
    .sort((a, b) => b.amount - a.amount); // in reverse order
}

export function substractServiceFee(amount: number, value: string): number {
  const serviceFee = getServiceFees(value);

  if (Array.isArray(serviceFee)) {
    const currentBracket = serviceFee.find(
      (bracket) => amount > bracket.amount
    ) || { fee: 0 };

    return substractPercentage(amount, currentBracket.fee);
  }

  return substractPercentage(amount, serviceFee);
}
