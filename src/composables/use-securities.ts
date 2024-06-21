import type { Security } from '../types';
import { substractPercentage } from './use-substract-percentage';

export function substractSecurityExitCost(
  amount: number,
  securities: Security[]
): number {
  const exitCost = securities.reduce((acc, curr) => {
    acc += (curr.exitCost * curr.allocation) / 100;
    return acc;
  }, 0);

  return substractPercentage(amount, exitCost);
}

export function addSecurityValues(
  amount: number,
  securities: Security[]
): number {
  const { variableCost, fixedCost, annualReturn } = securities.reduce(
    (acc, curr) => {
      acc.variableCost +=
        ((curr.variableTransactionCost + curr.tertd) * curr.allocation) / 100;
      acc.fixedCost += curr.fixedTransactionCost * 12; // monthly
      acc.annualReturn += curr.annualReturn * (curr.allocation / 100);

      return acc;
    },
    {
      variableCost: 0,
      fixedCost: 0,
      annualReturn: 0,
    }
  );

  const costs = (amount * variableCost) / 100 + fixedCost;
  const growth = (amount * annualReturn) / 100;

  return amount + growth - costs;
}
