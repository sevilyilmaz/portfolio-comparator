type FeeTiers = {
  threshold: number;
  rate: number;
};

export function getServiceFeeTiers(value: string): FeeTiers[] | number {
  let brackets = value.split(';');
  if (brackets.length === 1) {
    return Number(value);
  }

  return brackets.reduce((acc, curr) => {
    const [threshold, rate] = curr.split(':');

    acc.push({
      threshold: Number(threshold),
      rate: Number(rate),
    });

    return acc;
  }, [] as FeeTiers[]);
}

function calculateBrokerFees(
  investmentAmount: number,
  serviceFeeTiers: FeeTiers[] | number
) {
  if (Array.isArray(serviceFeeTiers)) {
    return serviceFeeTiers.reduce(
      (acc, curr, idx, arr) => {
        const next = arr[idx + 1] ?? null;
        let val = 0;

        if (next) {
          val =
            investmentAmount <= next.threshold
              ? acc.remainder
              : next.threshold - curr.threshold;
        } else {
          val = acc.remainder;
        }

        acc.remainder -= val;
        acc.fee += val * (curr.rate / 100);

        return acc;
      },
      {
        fee: 0,
        remainder: investmentAmount,
      }
    ).fee;
  }

  return (investmentAmount * serviceFeeTiers) / 100;
}

export function subtractServiceFee(
  amount: number,
  serviceFeeString: string
): number {
  const serviceFeeTiers = getServiceFeeTiers(serviceFeeString);
  const totalServiceFee = calculateBrokerFees(amount, serviceFeeTiers);

  return amount - totalServiceFee;
}
