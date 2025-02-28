import { describe, it, expect } from 'vitest';
import { subtractPercentage } from './use-subtract-percentage';

describe('subtractPercentage', () => {
  it('should subtract a percentage from a value', () => {
    expect(subtractPercentage(1000, 10)).toBe(900);
  });
});
