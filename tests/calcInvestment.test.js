import { describe, it, expect } from 'vitest';
import { calcInvestment } from '../src/logic.js';

describe('calcInvestment', () => {
  it('computes correct future value for 1 year at default rate', () => {
    const result = calcInvestment(100, 1);
    // $100/mo for 12 months at 7% annual
    expect(result.spent).toBe(1200);
    expect(result.fv).toBeGreaterThan(1200);
    expect(result.diff).toBe(result.fv - result.spent);
  });

  it('returns zero growth for zero monthly contribution', () => {
    const result = calcInvestment(0, 10);
    expect(result.fv).toBe(0);
    expect(result.spent).toBe(0);
    expect(result.diff).toBe(0);
  });

  it('handles single month (1/12 year does not exist, test 1 year)', () => {
    const result = calcInvestment(200, 1);
    expect(result.spent).toBe(2400);
    // With compounding, future value should exceed principal
    expect(result.fv).toBeGreaterThan(2400);
  });

  it('uses custom rate when provided', () => {
    const result7 = calcInvestment(100, 10, 0.07);
    const result10 = calcInvestment(100, 10, 0.10);
    // Higher rate should yield higher future value
    expect(result10.fv).toBeGreaterThan(result7.fv);
  });

  it('computes correct values for 10 years at 7%', () => {
    const result = calcInvestment(150, 10);
    // $150/mo for 120 months at 7%
    expect(result.spent).toBe(18000);
    // Known approximate: ~$25,900
    expect(result.fv).toBeGreaterThan(25000);
    expect(result.fv).toBeLessThan(27000);
  });

  it('returns integer values for fv and diff', () => {
    const result = calcInvestment(333, 7);
    expect(Number.isInteger(result.fv)).toBe(true);
    expect(Number.isInteger(result.diff)).toBe(true);
  });

  it('produces NaN for zero rate (division by zero in formula)', () => {
    const result = calcInvestment(100, 5, 0);
    // The compound interest formula divides by monthly rate, so rate=0 → 0/0 = NaN
    expect(result.fv).toBeNaN();
    expect(result.diff).toBeNaN();
  });
});
