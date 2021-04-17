import { getServiceFees, substractServiceFee } from './use-service-fee';

describe('getServiceFees', () => {
  it('should return the service fee as a number from a single value', () => {
    expect(getServiceFees('0.1')).toBe(0.1);
  });

  it('should return the service fees from a tiered value', () => {
    expect(getServiceFees('0:0.2;100000:0.12;400000:0.06')).toEqual([
      {
        amount: 400000,
        fee: 0.06,
      },
      {
        amount: 100000,
        fee: 0.12,
      },
      {
        amount: 0,
        fee: 0.2,
      },
    ]);
  });
});

describe('substractServiceFee', () => {
  it('should return a fee substracted amount for a single value fee', () => {
    expect(substractServiceFee(10000, '0.2')).toBe(9980);
  });

  test.each([
    [50000, 49900],
    [150000, 149820],
    [450000, 449730],
  ])(
    'should return a fee substracted amount for [%s] for a tiered fee',
    (input, expected) => {
      expect(substractServiceFee(input, '0:0.2;100000:0.12;400000:0.06')).toBe(
        expected
      );
    }
  );
});
