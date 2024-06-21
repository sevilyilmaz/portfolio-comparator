import { describe, it, expect } from 'vitest';
import { useDisplayValue } from './use-display-value';

describe('useDisplayValue', () => {
  it('should display a value with a localized currency', () => {
    expect(useDisplayValue(12000)).toEqual('€ 12.000,00');
  });
});
