import { describe, it, expect, test } from 'vitest';
import { getServiceFeeTiers, subtractServiceFee } from './use-service-fee';

describe('getServiceFees', () => {
  it('should return the service fee as a number from a single value', () => {
    expect(getServiceFeeTiers('0.1')).toBe(0.1);
  });

  it('should return the service fees from a tiered value', () => {
    expect(getServiceFeeTiers('0:0.2;100000:0.12;400000:0.06')).toEqual([
      {
        threshold: 0,
        rate: 0.2,
      },
      {
        threshold: 100000,
        rate: 0.12,
      },
      {
        threshold: 400000,
        rate: 0.06,
      },
    ]);
  });
});

describe('subtractServiceFee', () => {
  it('should return a fee subtracted amount for a single value fee', () => {
    expect(subtractServiceFee(10000, '0.2')).toBe(9980);
  });

  test.each([
    [50000, 49900],
    [150000, 149740],
    [450000, 449410],
  ])(
    'should return a fee subtracted amount for [%s] for a tiered fee',
    (input, expected) => {
      expect(subtractServiceFee(input, '0:0.2;100000:0.12;400000:0.06')).toBe(
        expected
      );
    }
  );
});
