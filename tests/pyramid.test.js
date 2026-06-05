import { describe, it, expect } from 'vitest';
import { computePyramidStats } from '../src/logic.js';

describe('computePyramidStats', () => {
  it('computes correct stats for factor=5, levels=3', () => {
    const { rows, atLevel, below, total, abovePct } = computePyramidStats(5, 3);
    // rows: [1, 5, 25, 125]
    expect(rows).toEqual([1, 5, 25, 125]);
    expect(atLevel).toBe(125);
    // below: 5^4 + 5^5 + 5^6 = 625 + 3125 + 15625 = 19375
    expect(below).toBe(19375);
    // total: 1 + 5 + 25 + 125 = 156
    expect(total).toBe(156);
    // abovePct: (156-125)/156*100 = 19.9%
    expect(abovePct).toBe('19.9');
  });

  it('computes correct stats for factor=2, levels=4', () => {
    const { rows, atLevel, below, total } = computePyramidStats(2, 4);
    // rows: [1, 2, 4, 8, 16]
    expect(rows).toEqual([1, 2, 4, 8, 16]);
    expect(atLevel).toBe(16);
    // below: 2^5 + 2^6 + 2^7 = 32 + 64 + 128 = 224
    expect(below).toBe(224);
    // total: 1+2+4+8+16 = 31
    expect(total).toBe(31);
  });

  it('level 0 means only the founder', () => {
    const { rows, atLevel, total, abovePct } = computePyramidStats(5, 0);
    expect(rows).toEqual([1]);
    expect(atLevel).toBe(1);
    expect(total).toBe(1);
    expect(abovePct).toBe('0.0');
  });

  it('factor=1 produces flat structure', () => {
    const { rows, atLevel, total } = computePyramidStats(1, 5);
    expect(rows).toEqual([1, 1, 1, 1, 1, 1]);
    expect(atLevel).toBe(1);
    expect(total).toBe(6);
  });

  it('high factor creates extreme pyramid', () => {
    const { atLevel, total } = computePyramidStats(10, 5);
    expect(atLevel).toBe(100000);
    // total: 1 + 10 + 100 + 1000 + 10000 + 100000 = 111111
    expect(total).toBe(111111);
  });

  it('abovePct is always a string with one decimal', () => {
    const { abovePct } = computePyramidStats(3, 7);
    expect(typeof abovePct).toBe('string');
    expect(abovePct).toMatch(/^\d+\.\d$/);
  });
});
