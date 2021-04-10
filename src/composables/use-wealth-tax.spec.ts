import { getWealthTax } from './use-wealth-tax';

describe('getWealthTax', () => {
  it('should return the wealth tax for 40K', () => {
    const amount = 40000;
    expect(getWealthTax(amount)).toBe(0);
  });

  it('should return the wealth tax for 80K', () => {
    const amount = 80000;
    expect(getWealthTax(amount)).toMatchSnapshot();
  });

  it('should return the wealth tax for 100K', () => {
    const amount = 100000;
    expect(getWealthTax(amount)).toMatchSnapshot();
  });

  it('should return the wealth tax for 150K', () => {
    const amount = 150000;
    expect(getWealthTax(amount)).toMatchSnapshot();
  });

  it('should return the wealth tax for 200K', () => {
    const amount = 200000;
    expect(getWealthTax(amount)).toMatchSnapshot();
  });

  it('should return the wealth tax for 1.2m', () => {
    const amount = 1200000;
    expect(getWealthTax(amount)).toMatchSnapshot();
  });
});
