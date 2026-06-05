import { describe, it, expect } from 'vitest';
import { computeQuicksandTotal, qsItems } from '../src/logic.js';

describe('computeQuicksandTotal', () => {
  it('computes correct total with default values', () => {
    // Default vals: 800($) + 150($/mo)*12 + 49($/mo)*12 + 400($/yr) + 120($/yr) + 80($/yr)
    // = 800 + 1800 + 588 + 400 + 120 + 80 = 3788
    const total = computeQuicksandTotal(qsItems.map(i => i.val));
    expect(total).toBe(3788);
  });

  it('handles $/mo items by multiplying by 12', () => {
    // Set only the $/mo items (index 1 and 2), rest to 0
    const values = [0, 100, 50, 0, 0, 0];
    const total = computeQuicksandTotal(values);
    // 0 + 100*12 + 50*12 + 0 + 0 + 0 = 1800
    expect(total).toBe(1800);
  });

  it('handles $/yr items directly', () => {
    // Set only the $/yr items (index 3, 4, 5), rest to 0
    const values = [0, 0, 0, 500, 200, 100];
    const total = computeQuicksandTotal(values);
    // 0 + 0 + 0 + 500 + 200 + 100 = 800
    expect(total).toBe(800);
  });

  it('handles $ items (one-time) directly', () => {
    // Set only the $ item (index 0), rest to 0
    const values = [2000, 0, 0, 0, 0, 0];
    const total = computeQuicksandTotal(values);
    expect(total).toBe(2000);
  });

  it('handles all zeros', () => {
    const total = computeQuicksandTotal([0, 0, 0, 0, 0, 0]);
    expect(total).toBe(0);
  });

  it('handles max values', () => {
    const values = qsItems.map(i => i.max);
    // 3000 + 400*12 + 200*12 + 1500 + 500 + 400 = 3000 + 4800 + 2400 + 1500 + 500 + 400 = 12600
    const total = computeQuicksandTotal(values);
    expect(total).toBe(12600);
  });

  it('uses default values when values array is shorter', () => {
    const total = computeQuicksandTotal([1000]);
    // 1000 + 150*12 + 49*12 + 400 + 120 + 80
    // = 1000 + 1800 + 588 + 400 + 120 + 80 = 3988
    expect(total).toBe(3988);
  });
});

describe('qsItems', () => {
  it('has 6 expense items', () => {
    expect(qsItems).toHaveLength(6);
  });

  it('each item has required fields', () => {
    qsItems.forEach(item => {
      expect(item).toHaveProperty('label');
      expect(item).toHaveProperty('min');
      expect(item).toHaveProperty('max');
      expect(item).toHaveProperty('val');
      expect(item).toHaveProperty('unit');
      expect(item.max).toBeGreaterThan(item.min);
      expect(item.val).toBeGreaterThanOrEqual(item.min);
      expect(item.val).toBeLessThanOrEqual(item.max);
    });
  });

  it('units are valid', () => {
    const validUnits = ['$', '$/mo', '$/yr'];
    qsItems.forEach(item => {
      expect(validUnits).toContain(item.unit);
    });
  });
});
