import { describe, it, expect } from 'vitest';
import { computeRescueReport, mlmData, retailMarkup, levelMultiplier } from '../src/logic.js';

describe('computeRescueReport', () => {
  const baseInput = {
    mlmName: 'Herbalife',
    months: 18,
    hrsWeek: 15,
    buyin: 500,
    events: 400,
    training: 49,
    closeP: 12,
    damaged: 5,
    selectedLevel: 1,
    monthlyMlm: 200,
    monthlyRetail: 60,
  };

  it('computes totalSpent correctly', () => {
    const r = computeRescueReport(baseInput);
    // buyin + (monthlyMlm + training) * months + events
    // 500 + (200 + 49) * 18 + 400 = 500 + 4482 + 400 = 5382
    expect(r.totalSpent).toBe(5382);
  });

  it('computes retailEquiv correctly', () => {
    const r = computeRescueReport(baseInput);
    // (monthlyRetail * months) + buyin * 0.1
    // (60 * 18) + 500 * 0.1 = 1080 + 50 = 1130
    expect(r.retailEquiv).toBe(1130);
  });

  it('computes grossIncome based on level multiplier', () => {
    const r = computeRescueReport(baseInput);
    // medianIncome(300) * (18/12) * levelMultiplier[1](0.12)
    // 300 * 1.5 * 0.12 = 54
    expect(r.grossIncome).toBe(54);
  });

  it('computes netLoss as max(totalSpent - grossIncome, 0)', () => {
    const r = computeRescueReport(baseInput);
    expect(r.netLoss).toBe(Math.max(r.totalSpent - r.grossIncome, 0));
    expect(r.netLoss).toBeGreaterThan(0);
  });

  it('netLoss is never negative', () => {
    // Use very high level multiplier to try to make income > spent
    const input = { ...baseInput, selectedLevel: 5, months: 1, monthlyMlm: 1, training: 0, buyin: 0, events: 0 };
    const r = computeRescueReport(input);
    expect(r.netLoss).toBeGreaterThanOrEqual(0);
  });

  it('computes totalHours correctly', () => {
    const r = computeRescueReport(baseInput);
    // hrsWeek * months * 4.33 = 15 * 18 * 4.33 = 1169.1 → 1169
    expect(r.totalHours).toBe(Math.round(15 * 18 * 4.33));
  });

  it('time breakdown adds up approximately to totalHours', () => {
    const r = computeRescueReport(baseInput);
    const sum = r.sellHours + r.recruitHrs + r.contentHrs + r.adminHrs;
    // Due to rounding, allow ±2 difference
    expect(Math.abs(sum - r.totalHours)).toBeLessThanOrEqual(2);
  });

  it('computes minWageVal at $12/hr', () => {
    const r = computeRescueReport(baseInput);
    expect(r.minWageVal).toBe(Math.round(r.totalHours * 12));
  });

  it('computes awkwardMoments at 1.8 per month', () => {
    const r = computeRescueReport(baseInput);
    expect(r.awkwardMoments).toBe(Math.round(18 * 1.8));
  });

  it('uses higher message rate for hrsWeek > 20', () => {
    const low = computeRescueReport({ ...baseInput, hrsWeek: 15 });
    const high = computeRescueReport({ ...baseInput, hrsWeek: 25 });
    expect(high.msgsSent).toBeGreaterThan(low.msgsSent);
  });

  it('falls back to default mlmData for unknown company', () => {
    const r = computeRescueReport({ ...baseInput, mlmName: 'FakeMLM' });
    expect(r.mInfo.medianIncome).toBe(200);
    expect(r.mInfo.netLossPct).toBe(82);
  });

  it('returns investedVal > 0 for positive contributions', () => {
    const r = computeRescueReport(baseInput);
    expect(r.investedVal).toBeGreaterThan(0);
  });
});

describe('mlmData', () => {
  it('has 18 companies', () => {
    expect(Object.keys(mlmData)).toHaveLength(18);
  });

  it('each company has required fields', () => {
    Object.values(mlmData).forEach(d => {
      expect(d).toHaveProperty('medianIncome');
      expect(d).toHaveProperty('netLossPct');
      expect(d).toHaveProperty('category');
      expect(d).toHaveProperty('minMonthly');
      expect(d.netLossPct).toBeGreaterThan(0);
      expect(d.netLossPct).toBeLessThanOrEqual(100);
    });
  });

  it('all categories have a retail markup defined', () => {
    Object.values(mlmData).forEach(d => {
      expect(retailMarkup).toHaveProperty(d.category);
    });
  });
});

describe('levelMultiplier', () => {
  it('has 6 levels (0-5)', () => {
    expect(levelMultiplier).toHaveLength(6);
  });

  it('level 0 yields zero income', () => {
    expect(levelMultiplier[0]).toBe(0);
  });

  it('level 5 yields full income', () => {
    expect(levelMultiplier[5]).toBe(1.0);
  });

  it('multipliers increase monotonically', () => {
    for (let i = 1; i < levelMultiplier.length; i++) {
      expect(levelMultiplier[i]).toBeGreaterThan(levelMultiplier[i - 1]);
    }
  });
});
