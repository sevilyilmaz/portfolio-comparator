import { substractPercentage } from './use-substract-percentage';

describe('substractPercentage', () => {
  it('should substract a percentage from a value', () => {
    expect(substractPercentage(1000, 10)).toBe(900);
  });
});
