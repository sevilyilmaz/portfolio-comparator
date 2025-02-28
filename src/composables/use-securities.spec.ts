import { describe, it, expect } from 'vitest';
import { subtractSecurityExitCost, addSecurityValues } from './use-securities';

describe('substractSecurityExitCost', () => {
  it('should substract exit cost for a single security', () => {
    const securities = [
      {
        id: 'test-id',
        name: 'NT World',
        tertd: 0.2,
        dividend: 0,
        annualReturn: 12.66,
        fixedTransactionCost: 0,
        variableTransactionCost: 0,
        exitCost: 0.1,
        allocation: 100,
      },
    ];
    expect(subtractSecurityExitCost(1000, securities)).toBe(999);
  });

  it('should substract exit cost for multiple securities', () => {
    const securities = [
      {
        id: 'nt-world',
        name: 'NT World',
        tertd: 0.2,
        dividend: 0,
        annualReturn: 12.66,
        fixedTransactionCost: 0,
        variableTransactionCost: 0,
        exitCost: 0.1,
        allocation: 86,
      },
      {
        id: 'nt-em',
        name: 'NT EM',
        tertd: 0.37,
        dividend: 0,
        annualReturn: 11.38,
        fixedTransactionCost: 0,
        variableTransactionCost: 0,
        exitCost: 0.2,
        allocation: 14,
      },
    ];

    expect(subtractSecurityExitCost(1000, securities)).toBe(998.86);
  });
});

describe('addSecurityValues', () => {
  it('should add a security return and costs to the amount', () => {
    const securities = [
      {
        id: 'test-id',
        name: 'NT World',
        tertd: 0.2,
        dividend: 0,
        annualReturn: 12.66,
        fixedTransactionCost: 0,
        variableTransactionCost: 0,
        exitCost: 0.1,
        allocation: 100,
      },
    ];

    expect(addSecurityValues(1000, securities)).toBe(1124.6);
  });

  it('should add multiple security returns and costs to the amount', () => {
    const securities = [
      {
        id: 'nt-world',
        name: 'NT World',
        tertd: 0.2,
        dividend: 0,
        annualReturn: 12.66,
        fixedTransactionCost: 0,
        variableTransactionCost: 0,
        exitCost: 0.1,
        allocation: 86,
      },
      {
        id: 'nt-em',
        name: 'NT EM',
        tertd: 0.37,
        dividend: 0,
        annualReturn: 11.38,
        fixedTransactionCost: 0,
        variableTransactionCost: 0,
        exitCost: 0.2,
        allocation: 14,
      },
    ];

    expect(addSecurityValues(1000, securities)).toBe(1122.57);
  });
});
