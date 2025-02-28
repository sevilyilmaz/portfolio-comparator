import { describe, test, expect } from 'vitest';
import { getWealthTax, subtractWealthTax } from './use-wealth-tax';

describe('getWealthTax', () => {
  test.each([
    28000, 50000, 80000, 100000, 120000, 150000, 950000, 1200000, 200000,
  ])('should return the wealth tax for [%s]', (amount) => {
    expect(getWealthTax(amount)).toMatchSnapshot();
  });
});

describe('subtractWealthTax', () => {
  test.each([28000, 50000, 80000, 100000, 120000, 950000, 1200000])(
    'should subtract wealth tax from [%s] for single person',
    (amount) => {
      expect(subtractWealthTax(amount, 1)).toMatchSnapshot();
    }
  );

  test.each([28000, 50000, 80000, 100000, 120000, 950000, 1200000])(
    'should subtract wealth tax from [%s] for a couple (50%/50% split)',
    (amount) => {
      expect(subtractWealthTax(amount, 2)).toMatchSnapshot();
    }
  );
});
